# Contributing to Portflow Extended

Below you'll find a set of guidelines for how to contribute to Portflow Extended.

## Opening issues

Before you submit an issue, please check all existing open and closed issues to see if your issue has previously been resolved or is already known. If there is already an issue logged, feel free to upvote it. If you would like to submit a new issue, please be as descriptive as possible so we can accurately understand your report.

## Design Contributions

When it comes to design-related changes or additions, it's crucial to ensure a cohesive user experience. Before embarking on any implementation that would affect the design or UI/UX, we ask that you first share your design proposal for review and approval.

This step is meant to prevent unintentional design inconsistencies and to save you from investing time in implementing features that might need significant design alterations later.

## Installation & Requirements

To install all required dependencies, run `pnpm install` in the root directory. PNPM is required to develop and contribute to the repository.

## Pull Requests

For all Pull Requests, you should be extremely descriptive about both your problem and proposed solution. If there are any affected open or closed issues, please leave the issue number in your PR description.

All commits within a PR are squashed when merged, using the PR title as the commit message. For that reason, please use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your PR titles.

Here are some examples:

- `feat: add new feature`
- `fix: fix bug`
- `docs: add documentation`
- `test: add/fix tests`
- `refactor: refactor code`
- `chore: anything that does not fit into the above categories`

If applicable, you must indicate the affected packages or scopes in parentheses to "scope" the changes.

Here are some examples:

- `feat(popup): add new component`
- `fix(background): resolve sync issue`
