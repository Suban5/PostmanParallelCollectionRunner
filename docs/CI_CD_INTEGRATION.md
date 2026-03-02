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
3. Ensure `postman-cli` and `@suban5/postman-parallel-runner` are installed in the pipeline.
4. Set `CONFIG_PATH` (default: `config.json`) if your config file is elsewhere.
5. Archive `results/` as a build artifact.

## Example Copy Commands

```bash
# GitHub Actions
mkdir -p .github/workflows
cp docs/templates/ci.templates/github-actions.yml .github/workflows/postman-tests.yml

# GitLab
cp docs/templates/ci.templates/gitlab-ci.yml .gitlab-ci.yml

# Azure DevOps
cp docs/templates/ci.templates/azure-pipelines.yml azure-pipelines.yml

# Jenkins
cp docs/templates/ci.templates/jenkinsfile Jenkinsfile
```
