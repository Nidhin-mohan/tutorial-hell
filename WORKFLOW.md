# Learning workflow

This repo is a personal learning log. Every tutorial / skill lives on its own
branch **and** gets merged into `main` for reference. Branches are **never
deleted and never rebased** — they stay forever as a snapshot of that session.

## Golden rules

1. One **branch** per tutorial/skill. Named after the topic (`redux-toolkit`,
   `graphql-net-ninja`, ...).
2. One **folder** per tutorial, so branches never touch the same files and
   merges never conflict.
3. Merge the topic **into `main`** with `--no-ff` (never `main` into the topic,
   never a fast-forward). This keeps each session as its own visible lane and
   lands the commits on `main` so they count on the GitHub contribution graph.
4. Never delete a branch. Merging does **not** delete it — the label stays.

## Per-session cheatsheet

```bash
# start a new tutorial
git learn redux-toolkit          # = checkout main, pull, create branch

mkdir redux-toolkit              # give the topic its own folder
# ...learn, code, commit as normal...
git add . && git commit -m "counter with slices"

# finished for now -> land it on main, keep the branch, push everything
git done                         # = merge --no-ff into main, push main + branch, back to branch
```

## Aliases (installed globally)

| Command             | What it does                                                            |
|---------------------|-------------------------------------------------------------------------|
| `git learn <name>`  | Checkout `main`, pull, create+switch to a new topic branch              |
| `git done`          | Merge current branch into `main` with `--no-ff`, push both, return to it |
| `git lg`            | Pretty graph of **all** branches (merged or not)                        |

## Seeing every commit, even unmerged ones

`git log` alone only shows the current branch. To see the whole picture:

```bash
git lg          # graph of all branches
```

## Contribution graph (green squares)

GitHub only counts commits that are reachable from the **default branch**
(`main`). That's why `git done` merges into `main` every session. Two extra
requirements for the squares to actually show up:

- Your commit email must be **added and verified** on your GitHub account
  (Settings -> Emails). Current commit email: check with `git config user.email`.
- The repo must be **pushed** to GitHub (`git done` pushes for you).
