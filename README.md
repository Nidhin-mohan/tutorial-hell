# TutorialHell — my learning log

A single repo for everything I learn. Instead of scattering tutorials across
dozens of repos, **each tutorial or skill gets its own branch and its own
folder here**, and then gets merged into `main` for a browsable archive.

- `main` = the home base + a side-by-side archive of every topic I've finished.
- Each **branch** = a permanent, standalone snapshot of one learning session.
- Branches are **never deleted and never rebased.** They stay forever for reference.

---

## The mental model

```
main:  A───B─────────M1────────────M2        <- home base; every topic lands here
            \       /   \          /
 redux:      C─────E      \        /          <- branch kept forever
                           \      /
 graphql:                   F────G            <- branch kept forever
```

- You **branch off `main`** to start a topic.
- You **merge the topic back into `main`** with `--no-ff` when done.
- The merge creates a join commit (`M1`, `M2`) but **does not delete the branch** —
  merging and deleting are different operations. The branch label stays put.

---

## Start here every session

### 1. Start a new topic

```bash
git learn redux-toolkit      # branches off a fresh main
mkdir redux-toolkit          # one folder per topic = merges never conflict
```

`git learn <name>` = `checkout main` → `pull` → `checkout -b <name>`.

### 2. Work & commit (normal git)

```bash
git add .
git commit -m "counter slice with reducers"
```

Commit as often as you like — small commits are good, they're your notes.

### 3. Finish the session — land it on main, keep the branch

```bash
git done
```

`git done` = merge the current branch into `main` with `--no-ff`, push `main`
**and** the branch, then switch back to your branch. The branch survives.

> Prefer to do it by hand? That's all `git done` runs:
> ```bash
> git checkout main
> git merge --no-ff redux-toolkit -m "learn: redux-toolkit"
> git push origin main redux-toolkit
> git checkout redux-toolkit
> ```

---

## Managing & viewing branches

| Goal                             | Command                                  |
|----------------------------------|------------------------------------------|
| See the whole history, all branches | `git lg`  (alias for a full graph)    |
| List every branch (local+remote) | `git branch -a`                          |
| Jump to an old topic for reference | `git checkout <branch-name>`           |
| Go back to home base             | `git checkout main`                      |

`git log` on its own only shows the current branch — use **`git lg`** to see
every branch at once, merged or not.

---

## Why `--no-ff` matters (don't skip it)

If `main` hasn't moved since you branched, a plain merge would "fast-forward" —
no join commit, and the branch shape vanishes from history. `--no-ff` **forces**
a join commit every time, so each session stays a distinct, labeled lane you can
always point back to. `git done` always uses it.

---

## Contribution graph (green squares)

GitHub only credits commits that are reachable from the **default branch**
(`main`). That's the whole reason `git done` merges into `main` — so your
learning actually shows up. Two extra requirements:

1. Your commit email must be **added & verified** on your GitHub account
   (**Settings → Emails**). Check yours with `git config user.email`.
2. The repo must be pushed (`git done` handles that).

---

## The aliases (installed globally, reusable in any repo)

| Command             | Does                                                              |
|---------------------|------------------------------------------------------------------|
| `git learn <name>`  | Start a topic: checkout main, pull, create+switch to new branch  |
| `git done`          | Finish: `--no-ff` merge into main, push both, return to branch   |
| `git lg`            | Pretty graph of **all** branches                                 |

Defined in your global git config. View them with
`git config --global --get-regexp '^alias\.'`.
