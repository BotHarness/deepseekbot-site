# Single-function test fixture

This deliberately small MIT fixture turns a work duration into minutes. It needs Node 22 or newer and no package install.

Run `node --test duration.test.mjs`. The starting fixture has one happy-path test. The DeepSeekBot task may modify only `duration.test.mjs`; implementation, package and license stay unchanged. The actual submitted patch and verification logs are recorded separately, so this directory remains the repeatable starting input.

Contract: a string in `H:MM` or `HH:MM` form; hours 0–23 and minutes 0–59; integer minutes returned. Non-string/malformed input raises TypeError, out-of-range components raise RangeError. No whitespace trimming or signed/decimal hours are accepted. This is a demonstration, not a production timekeeping library.
