# CI/CD Integration

Use the ready-to-use CI/CD templates from `docs/templates/ci.templates/`.

## Available Templates

- GitHub Actions: `docs/templates/ci.templates/github-actions.yml`
- GitLab CI: `docs/templates/ci.templates/gitlab-ci.yml`
- Azure DevOps: `docs/templates/ci.templates/azure-pipelines.yml`
- Bamboo: `docs/templates/ci.templates/bamboo.yml`
- Jenkins: `docs/templates/ci.templates/jenkinsfile`

## Common Setup Steps

1. Copy the required template into your CI system's expected location.
2. Ensure Node.js 18+ is available.
3. Ensure `postman-cli` and `@suban5/postman-parallel-runner@latest` are installed in the pipeline.
4. Set `CONFIG_PATH` (default: `config.json`) if your config file is elsewhere.
5. Artifacts are uploaded from `exportResultsFolder` in your config file.

## Example Copy Commands

```bash
# GitHub Actions
mkdir -p .github/workflows
cp docs/templates/ci.templates/github-actions.yml .github/workflows/github-actions.yml

# GitLab
cp docs/templates/ci.templates/gitlab-ci.yml .gitlab-ci.yml

# Azure DevOps
cp docs/templates/ci.templates/azure-pipelines.yml azure-pipelines.yml

# Jenkins
cp docs/templates/ci.templates/jenkinsfile Jenkinsfile
```

## Artifact Output Source

All CI templates resolve artifact output from:

`exportResultsFolder` in `CONFIG_PATH`

If `exportResultsFolder` is not present, templates fall back to `./results`.

## Manual Trigger Setup

Use this setup if you want pipelines to run only when a user explicitly starts them.

### GitHub Actions

In `.github/workflows/github-actions.yml`, keep only:

```yaml
on:
	workflow_dispatch:
```

Run manually from: **GitHub → Actions → Postman Parallel Tests → Run workflow**.

### GitLab CI

In `.gitlab-ci.yml`, add:

```yaml
workflow:
	rules:
		- if: '$CI_PIPELINE_SOURCE == "web"'
		- when: never
```

Run manually from: **GitLab → CI/CD → Pipelines → Run pipeline**.

### Azure DevOps

In `azure-pipelines.yml`, set:

```yaml
trigger: none
pr: none
```

Run manually from: **Azure DevOps → Pipelines → Run pipeline**.

### Jenkins

Use `Jenkinsfile` without SCM polling/webhook triggers.

Run manually from: **Jenkins → Build Now** or **Build with Parameters**.

### Bamboo

Disable repository/commit triggers in the plan trigger settings.

Run manually from: **Bamboo → Plan → Run**.
