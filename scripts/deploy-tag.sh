#!/usr/bin/env bash
# Tags the latest origin/main as site-YYYY.MM.DD[.N] and pushes it, which runs
# .github/workflows/deploy.yml and publishes the site. Usage: pnpm deploy:tag
set -euo pipefail
git fetch --quiet --tags origin main
base="site-$(date -u +%Y.%m.%d)"
tag="$base"; n=1
while git rev-parse -q --verify "refs/tags/$tag" >/dev/null; do n=$((n + 1)); tag="$base.$n"; done
sha=$(git rev-parse origin/main)
echo "Releasing $(git log -1 --format='%h %s' "$sha") as $tag"
git tag -a "$tag" -m "Site release $tag" "$sha"
git push origin "refs/tags/$tag"
echo "Deploy started: https://github.com/BotHarness/deepseekbot-site/actions/workflows/deploy.yml"
