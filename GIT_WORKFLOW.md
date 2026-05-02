# Git Flow Workflow Guide

## Branch Strategy

| Branch     | Purpose                                         |
|------------|-------------------------------------------------|
| `main`     | Production — stable, deployed code only         |
| `develop`  | Integration — features merged here first        |
| `testing`  | Testing new features / auth experiments         |

## Initial Setup

```bash
git clone <your-repo-url>
cd <project>

# Create the three branches
git checkout -b develop
git push -u origin develop

git checkout -b testing
git push -u origin testing

git checkout main
```

## Day-to-Day Workflow

### 1. Start a new feature

Always branch off `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<short-description>
# Example: feature/portfolio-crud, feature/cv-generator, feature/admin-auth
```

### 2. Develop and commit

```bash
git add .
git commit -m "feat(portfolio): add CRUD routes and frontend admin table"
```

**Commit convention (Conventional Commits):**
- `feat(scope): description` — new feature
- `fix(scope): description` — bug fix
- `refactor(scope): description` — code restructure
- `docs(scope): description` — documentation only
- `chore(scope): description` — tooling, deps

### 3. Push to testing for QA

```bash
git checkout testing
git merge feature/<short-description>
git push origin testing
# Run tests on this branch
```

### 4. Merge to develop when approved

```bash
git checkout develop
git merge feature/<short-description>
git push origin develop
git branch -d feature/<short-description>
```

### 5. Release to main (Production)

```bash
git checkout main
git pull origin main
git merge develop
git tag v1.0.0
git push origin main --tags
```

## Hotfix Workflow

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<description>
# Fix the issue
git commit -m "fix: critical auth bug in JWT middleware"
git checkout main
git merge hotfix/<description>
git push origin main
# Backport to develop
git checkout develop
git merge hotfix/<description>
git push origin develop
git branch -d hotfix/<description>
```

## Branch Protection Rules (GitHub Settings)

For `main`:
- Require pull request reviews before merging (minimum 1)
- Require status checks to pass (CI/CD)
- Do not allow force pushes
- Restrict who can push

For `develop`:
- Require pull request reviews (optional but recommended)
- Require status checks

## Visual Flow

```
main ←── develop ←── feature/xyz
  ↑           ↑
  └─ hotfix   └── testing (QA branch)
```
