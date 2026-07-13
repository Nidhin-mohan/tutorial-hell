# TutorialHell — my learning log

A single repo for everything I learn. Instead of scattering tutorials across
dozens of repos, **each tutorial or skill gets its own branch**, and the code
lives *only* on that branch.

- **`main` is a clean slate** — it holds only this `README.md` and `.gitignore`,
  nothing else. Ever. It's the launch pad I branch off from, not a dumping ground.
- Each **branch** = a permanent, standalone snapshot of one learning session.
  This is where the actual tutorial code lives.
- Branches are **never deleted and never rebased.** They stay forever for reference.

> **Where's the code, then?** On the branches. `git checkout redux-toolkit` to see
> that tutorial. `main` deliberately stays empty so every session starts fresh.

---

## The mental model

```
main:  A───B───────M1───────────M2        <- ALWAYS clean: just README + .gitignore
            \      /  (ours)    / (ours)
 redux:      C────E    \       /           <- the code lives here, kept forever
                        \     /
 graphql:                F───G             <- and here, kept forever
```

`M1`, `M2` are **merge commits made with `-s ours`**: they pull the branch into
`main`'s *history* (which is what makes the commits count on the graph) but take
**none** of its files. So `main`'s files never change, yet every session is
recorded and credited.

---

## Start here every session

### 1. Start a new topic

```bash
git learn redux-toolkit      # branches off a fresh, clean main
```

`git learn <name>` = `checkout main` → `pull` → `checkout -b <name>`.

### 2. Work & commit (normal git, on the branch)

```bash
git add .
git commit -m "counter slice with reducers"
```

Commit as often as you like — small commits are your notes. All of this stays
on the branch.

### 3. Finish the session

```bash
git done
```

`git done` records the branch into `main` with an **`-s ours` merge** (so it
counts on your graph), pushes `main` **and** the branch, then drops you back on
your branch. `main`'s files are untouched; the branch survives forever.

> By hand, that's:
> ```bash
> git checkout main
> git merge -s ours --no-ff redux-toolkit -m "learn: redux-toolkit"
> git push origin main redux-toolkit
> git checkout redux-toolkit
> ```

---

## Managing & viewing branches

| Goal                                | Command                       |
|-------------------------------------|-------------------------------|
| See the whole history, all branches | `git lg`                      |
| List every branch (local+remote)    | `git branch -a`               |
| Open an old topic's code            | `git checkout <branch-name>`  |
| Back to the clean launch pad        | `git checkout main`           |

`git log` alone only shows the current branch — use **`git lg`** to see every
branch at once, merged or not.

---

## Why `-s ours` (the trick that keeps main clean)

A normal merge copies the branch's files into `main` — which would clutter the
slate. `-s ours` ("keep *our* side") makes a real merge commit that records the
branch as a parent but **keeps `main`'s tree exactly as-is**. Result: the branch
commits become reachable from `main` (graph credit ✅) with zero files added.
`git done` always uses it.

---

## Contribution graph (green squares)

GitHub only credits commits that are **reachable from the default branch**
(`main`) **and authored with an email linked to your account**. So two things
must both be true:

1. `git done` has recorded the branch into `main` (it does this via `-s ours`).
2. The **commit's author email is verified on your GitHub account**
   (**Settings → Emails**). This repo commits as `nidhinmohannidhin@gmail.com` —
   check with `git config user.email`. A commit authored under any other email
   (e.g. a work email) will **not** turn green, even after merging.

---

## The aliases

| Command             | Does                                                              |
|---------------------|------------------------------------------------------------------|
| `git learn <name>`  | Start a topic: checkout main, pull, create+switch to new branch  |
| `git done`          | Finish: `-s ours` merge into main, push both, return to branch   |
| `git lg`            | Pretty graph of **all** branches                                 |

View them anytime with `git config --get-regexp '^alias\.'`.
