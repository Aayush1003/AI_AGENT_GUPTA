---
name: Workspace Copilot Instructions
description: "Bootstrap workspace instructions for AI assistants; use when authoring or modifying project code. Keep guidance short and link to authoritative docs."
applyTo:
  - "**/*"
---

Purpose
-------

Provide concise, project-level guidance for AI assistants and contributors. Keep this file link-first: prefer referencing existing docs (README, CONTRIBUTING, tests) rather than embedding large content.

Where to find authoritative docs
--------------------------------

- Project overview: [README.md](README.md)
- License: [LICENSE](LICENSE)

Conventions (high-level)
------------------------

- Language: English.
- Make minimal, test-backed changes; open PRs for non-trivial refactors.
- Prefer small, focused commits and descriptive PRs.

How to ask the assistant
------------------------

- Be specific about files and intents. Example: "Add input validation to the `process()` function in [src/main.py](src/main.py#L1)."
- When you want tests: say "Add unit tests for X and show how to run them." Include expected behaviors.

Example prompts
---------------

- "Implement feature: add a `--config` flag to the CLI and document usage in README."
- "Refactor `utils` to improve testability and add unit tests for `parse_config()`." 

Next steps
----------

- Adjust `applyTo` globs if you want this to apply only to certain folders or file types.
- Add per-area instructions under `.github/instructions/` for specialized guidance (tests, frontend, infra).
