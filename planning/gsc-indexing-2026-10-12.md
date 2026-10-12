# GSC indexing audit — 2026-10-12

## Report scope

The supplied Coverage export is dated 2026-10-12, but its latest populated chart row is
2026-10-09: 46 indexed pages, 11 not indexed, and 4 impressions. The four CSV files contain
aggregate chart/reason/filter data only, not affected URLs or URL Inspection results.
The screenshot agrees with the reason counts:

| Reason                                                | Pages | Decision                                                                                        |
| ----------------------------------------------------- | ----: | ----------------------------------------------------------------------------------------------- |
| Alternate page with proper canonical                  |     1 | Not inherently a defect; verify the intended canonical when the URL is available.               |
| Duplicate, Google chose different canonical than user |     8 | Inspect each URL and Google's selected canonical; the aggregate cannot identify the cause.      |
| Crawled, currently not indexed                        |     2 | Inspect the exact pages and rendered content; HTTP 200 and a sitemap do not guarantee indexing. |

## Live audit

On 2026-10-12, all 94 URLs in the production sitemap returned HTTP 200 without a redirect,
had a self-canonical matching the sitemap URL, and had no HTML meta `noindex` directive.
This is a technical response check, not evidence of Google indexing or rendered-content quality.
The current sitemap is newer than the report's 2026-10-09 snapshot; the counts are not comparable.

Three deliberately nonexistent paths returned HTTP 200 with the Chinese homepage HTML and
`https://deepseekbot.app/` canonical:

- `/definitely-missing-gsc-audit`
- `/en/definitely-missing-gsc-audit`
- `/blog/definitely-missing-gsc-audit/`

The root cause is `assets.not_found_handling: "single-page-application"` in `wrangler.jsonc`.
These responses create unintended homepage duplicates. This is a confirmed routing defect,
but there is no evidence that these synthetic URLs are among the eight GSC duplicates;
do not label it as the proven cause of all 11 exclusions or as a GSC-reported soft 404.

## Bounded fix

- Use `not_found_handling: "none"` so absent assets return actual HTTP 404 responses.
- Redirect HTTP requests on the canonical product host to HTTPS with HTTP 301, preserving
  path/query and leaving local HTTP development and preview hostnames unchanged.
- Preserve default HTML handling, canonical tags, sitemap, language alternates, existing
  hostname and `/zh` redirects, and versioned Release attribution redirects.
- Add configuration and Worker 404 pass-through regression tests; verify built assets through
  the real local Wrangler runtime, not just mocked `ASSETS.fetch`.
- Do not change article copy or target keywords. Issues #59 and #68 remain `seo:observing`;
  #59's recorded review date is 2026-10-17.

## Follow-up after maintainer review and deployment

1. Confirm that missing Chinese/English paths and missing files return 404 in production,
   while actual sitemap pages remain 200 with matching canonicals.
2. Reinspect the affected URLs recorded in the browser follow-up below. For each, compare
   the last crawl date, user-declared canonical, Google-selected canonical, indexability,
   and live rendered content. The aggregate report and URL Inspection can differ.
3. Fix only confirmed mismatches. Intended duplicate/alternate URLs do not all need indexing;
   do not canonicalize English translations to Chinese pages or block duplicates in robots.txt.
4. Use URL Inspection live testing on affected intended canonical pages, then request indexing
   where appropriate and use the report's validation action where offered. Do not request
   indexing for deliberate aliases or nonexistent pages.
5. Record deployment time and compare a later GSC snapshot after recrawling. Indexing,
   rankings, and activation remain unproven; preserve the existing article cooldowns.

## Authenticated browser follow-up — 2026-10-12

Read the actual GSC reason-detail tables and individually inspected all 11 affected URLs.
The aggregate report still says last updated 2026-10-09, while its URL examples include
crawls on 2026-10-10. Times below are displayed by GSC; no timezone conversion is assumed.

All eight duplicate entries declare the matching `deepseekbot.app` URL as canonical and
show successful mobile Googlebot crawling with crawling and indexing allowed.

| New-host path                      | Last crawl shown in URL Inspection | Google-selected canonical                |
| ---------------------------------- | ---------------------------------- | ---------------------------------------- |
| `/docs/channel-sidebar/bot-inbox/` | 2026-10-10 23:09:40                | Same path on `deepseekbot.botharness.ai` |
| `/en/docs/update-deepseekbot/`     | 2026-10-10 15:39:44                | Same path on `deepseekbot.botharness.ai` |
| `/docs/concepts/`                  | 2026-10-10 08:31:04                | Not applicable; no target shown          |
| `/en/docs/concepts/`               | 2026-10-10 00:42:30                | Same path on `deepseekbot.botharness.ai` |
| `/docs/soul-and-core-memory/`      | 2026-10-10 00:34:28                | Same path on `deepseekbot.botharness.ai` |
| `/docs/computer-export/`           | 2026-10-10 00:21:04                | Same path on `deepseekbot.botharness.ai` |
| `/en/changelog/`                   | 2026-10-09 23:49:55                | Same path on `deepseekbot.botharness.ai` |
| `/privacy/`                        | 2026-10-09 23:24:09                | Same path on `deepseekbot.botharness.ai` |

Fresh HTTP checks of all eight old-host counterparts show exact-path 301 redirects to the
new domain, followed by 200 pages with matching new-domain self-canonicals. This supports
domain-migration/index-consolidation lag as the leading explanation for seven entries,
not broken live canonical markup. The Chinese concepts entry remains unresolved because
Google does not show a selected canonical. Do not invent one or rewrite content to force
deduplication. The earlier homepage fallback defect is separate from these real examples.

The two entries in the aggregate "Crawled, currently not indexed" category are
`/en/docs/slack-connection/` and `/docs/file-open/`. Both individually show "URL is on Google"
and "Page is indexed" in current URL Inspection. This is indexed-state evidence from GSC,
not a live test or proof of search ranking; the aggregate category is behind the individual status.

The one alternate entry is `http://deepseekbot.app/`, last crawled 2026-10-09 18:49:21.
It declares `https://deepseekbot.app/`, and Google selects the same canonical. This exclusion
is intended. A fresh HTTP request nevertheless returns 200 instead of redirecting, so the
bounded HTTPS redirect strengthens URL consistency without trying to index the HTTP alias.

No validation, indexing requests, sitemap submissions, property changes, or account changes
were made. After deployment, recheck the HTTP redirect and request recrawling of intended
HTTPS canonical pages only if authorized; do not submit known alternates for indexing.

## Local validation

Base: `a139aac44421b078f812f8b4ad46b8673b2f996c` (current upstream main when inspected).
The initial verification below was performed on a local patch before PR creation or deployment.

- `pnpm verify` passed: formatting, lint, 45 tests, typecheck, and production build.
  The existing build warning about chunks larger than 500 kB remains non-blocking.
- `pnpm exec wrangler dev --local` served the built `dist/` through the actual Worker
  and static asset runtime. Six missing paths, including a file and invalid Release short
  link, returned 404 for both GET and HEAD without homepage canonical markup (12 checks).
- All 94 built sitemap URLs returned 200 and matching self-canonicals locally.
- Five locale/directory/extensionless redirect checks and three Release short-link checks
  passed. Existing hostname redirect behavior is also covered by the Worker unit tests.
- After adding HTTPS normalization, eight actual-runtime GET/HEAD checks using the product
  Host header returned 301 responses preserving path/query. Wrangler rewrites the redirect
  origin to its local dev address, so the exact production HTTPS destination is covered by
  unit tests, not claimed as local-runtime or deployed proof. Wrangler defaults its local
  upstream hostname to the configured product route; use `--local-upstream localhost` for
  HTTP asset testing rather than following a rewritten product-host redirect loop. With
  that explicit local upstream, all 94 sitemap pages, all 12 missing URL checks, and the
  English Release installation redirect passed again.
- At the initial audit stage, no article edits, GSC writes, commit, PR, merge, or production
  deployment were performed. The subsequent user instruction authorizes redeployment;
  PR/CI, merged-main deployment, and live response evidence must still be recorded separately.

## Primary references

- Google Search Central: [canonicalization signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- Google crawling documentation: [HTTP status codes](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes).
- Search Console Help: [Page indexing report](https://support.google.com/webmasters/answer/7440203).
- Cloudflare: [static asset configuration](https://developers.cloudflare.com/workers/static-assets/).
- Installed Wrangler configuration schema: `assets.not_found_handling` allows `none`,
  `404-page`, or `single-page-application`; this change uses `none` and does not disable HTML handling.
