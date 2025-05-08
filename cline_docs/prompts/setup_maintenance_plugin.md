# Set-up/Maintenance Phase Plugin

This plugin guides the Set-up/Maintenance phase of the CRCT system.

## Objectives

- Initialize the project structure.
- Identify code root and documentation directories.
- Verify and update dependency trackers.
- Add new modules or documentation.
- Perform periodic system maintenance.

## Steps

1.  **Check `.clinerules`**: Read `.clinerules` to determine the current state and next action.
2.  **Identify Code Root and Documentation Directories**: If `[CODE_ROOT_DIRECTORIES]` or `[DOC_DIRECTORIES]` are empty in `.clinerules`, identify them based on project structure and update `.clinerules`.
3.  **Run `analyze-project`**: Execute `python -m cline_utils.dependency_system.dependency_processor analyze-project` to generate/update tracker files and keys.
4.  **Verify Dependencies**: Use `show-keys` to identify keys with 'p', 's', or 'S' placeholders in tracker files (`doc_tracker.md`, mini-trackers, `module_relationship_tracker.md` - in that order). For each key needing checks, use `show-dependencies` to analyze relationships and `add-dependency` to set the correct dependency type ('<', '>', 'x', 'd', 'n'). Provide reasoning for each `add-dependency` call.
5.  **Create Core Files**: If `system_manifest.md`, `activeContext.md`, `changelog.md`, `userProfile.md`, or `progress.md` are missing in `memory_bank/`, create them using templates or placeholders.
6.  **Add New Modules/Docs (if applicable)**: If the task involves adding new major modules or documentation sections, create the necessary directories and initial files. Update `.clinerules` and run `analyze-project`.
7.  **Periodic Maintenance**: Perform checks for outdated dependencies, code style issues (if tools available), or other maintenance tasks as needed.
8.  **Update `.clinerules`**: Update `[LAST_ACTION_STATE]` and `[LEARNING_JOURNAL]` in `.clinerules` to reflect completed actions and transition to the next phase (`Strategy`) if setup is complete.
9.  **MUP**: Follow the Mandatory Update Protocol after significant actions.

## Mandatory Update Protocol (MUP) Additions

In addition to the core MUP steps (updating `activeContext.md`, `changelog.md`, `.clinerules`), the Set-up/Maintenance phase MUP includes:

-   Ensuring all tracker files (`module_relationship_tracker.md`, `doc_tracker.md`, mini-trackers) are present and have been processed by `analyze-project` at least once.
-   Verifying that `[CODE_ROOT_DIRECTORIES]` and `[DOC_DIRECTORIES]` in `.clinerules` are populated if the project has code/documentation.

## Phase Transition

Transition to the `Strategy` phase once initial setup is complete, code/doc roots are identified, core files are created, and `analyze-project` has been run. Update `next_phase` in `.clinerules` to `Strategy`.
