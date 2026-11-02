#!/usr/bin/env bash
# One-time setup for .github/workflows/deploy.yml (see README "Deploy").
# Opens the Cloudflare token page pre-filled, reads the token without echoing it,
# creates the `production` environment limited to `main`, and stores the token as
# its CLOUDFLARE_API_TOKEN secret. Needs the GitHub CLI (`gh auth login`) and curl.
# The token never leaves this machine except to Cloudflare (verify) and GitHub (secret).
set -euo pipefail

REPO="BotHarness/deepseekbot-site"
ACCOUNT_ID="332e72d480d7cb3e60ee671d3ca0cad0"
ENV_NAME="production"

PERMS='[{"key":"workers_scripts","type":"edit"},{"key":"workers_routes","type":"edit"},{"key":"account_settings","type":"read"},{"key":"user_details","type":"read"},{"key":"memberships","type":"read"}]'
urlencode() { node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$1"; }
TOKEN_URL="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=$(urlencode "$PERMS")&accountId=${ACCOUNT_ID}&zoneId=all&name=$(urlencode "deepseekbot-site GitHub deploy")"
ENV_URL="https://github.com/${REPO}/settings/environments"

open_url() { (command -v open >/dev/null && open "$1") || (command -v xdg-open >/dev/null && xdg-open "$1") || true; }

command -v gh >/dev/null || { echo "Install the GitHub CLI first: https://cli.github.com" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || gh auth login

echo "1/3 Opening Cloudflare to create the token (permissions are pre-filled):"
echo "    $TOKEN_URL"
echo "    Check Account = ${ACCOUNT_ID}, Zone Resources = All zones from that account, then Create Token."
open_url "$TOKEN_URL"
read -rsp "Paste the token here (input is hidden), then press Enter: " TOKEN
echo
[ -n "$TOKEN" ] || { echo "No token entered." >&2; exit 1; }

status=$(curl -fsS -H "Authorization: Bearer ${TOKEN}" \
  https://api.cloudflare.com/client/v4/user/tokens/verify | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.stdout.write(j.success?j.result.status:"invalid")})' || echo invalid)
[ "$status" = "active" ] || { echo "Cloudflare says this token is not active (${status})." >&2; exit 1; }
echo "    Token verified with Cloudflare."

echo "2/3 Creating the '${ENV_NAME}' environment, deployable from main and site-* tags only"
gh api -X PUT "repos/${REPO}/environments/${ENV_NAME}" --input - >/dev/null <<JSON
{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}
JSON
gh api -X POST "repos/${REPO}/environments/${ENV_NAME}/deployment-branch-policies" \
  -f name=main -f type=branch >/dev/null 2>&1 || true
gh api -X POST "repos/${REPO}/environments/${ENV_NAME}/deployment-branch-policies" \
  -f name='site-*' -f type=tag >/dev/null 2>&1 || true

echo "3/3 Saving CLOUDFLARE_API_TOKEN to the environment"
printf '%s' "$TOKEN" | gh secret set CLOUDFLARE_API_TOKEN --env "$ENV_NAME" --repo "$REPO"
unset TOKEN

echo "Done. Review it at ${ENV_URL}"
echo "Publish a release with: pnpm deploy:tag"
