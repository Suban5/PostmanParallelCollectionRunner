# Configuration Templates

Copy one of these templates to your project root as `config.json`, then run:

```bash
postman-parallel --validate
postman-parallel
```

Available templates:
- `configs/config.single-environment.json`
- `configs/config.multi-environment.json`
- `configs/config.regression.json`
- `configs/config.smoke.json`
- `configs/config.scheduled-nightly.json`

CI/CD templates:
- `ci.templates/github-actions.yml`
- `ci.templates/gitlab-ci.yml`
- `ci.templates/azure-pipelines.yml`
- `ci.templates/bamboo.yml`
- `ci.templates/jenkinsfile`
