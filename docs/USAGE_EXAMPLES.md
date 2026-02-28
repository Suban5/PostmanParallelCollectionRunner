# 💡 Usage Examples

Real-world examples of how to use Postman Parallel Collection Runner.

---

## Example 1: Basic API Testing

**Scenario:** Test multiple API endpoints in parallel

**Project structure:**
```
api-tests/
├── collections/
│   ├── user-api.postman_collection.json
│   ├── product-api.postman_collection.json
│   └── order-api.postman_collection.json
├── results/
└── config.json
```

**config.json:**
```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": ["cli", "json"],
  "outputDir": "./results"
}
```

**Run:**
```bash
postman-parallel
```

**Output:**
```
📂 Found 3 collection(s):
🚀 Running collections in parallel...
✅ user-api.postman_collection.json completed
✅ product-api.postman_collection.json completed
✅ order-api.postman_collection.json completed
🎉 All collections completed
```

---

## Example 2: Multi-Environment Testing

**Scenario:** Run the same tests against dev, staging, and prod environments

**Project structure:**
```
multi-env-tests/
├── collections/
│   └── api-smoke-tests.postman_collection.json
├── environments/
│   ├── dev.postman_environment.json
│   ├── staging.postman_environment.json
│   └── production.postman_environment.json
├── results/
└── config.json
```

**config.json:**
```json
{
  "collections": [
    {
      "collection": "./collections/api-smoke-tests.postman_collection.json",
      "environment": "./environments/dev.postman_environment.json"
    },
    {
      "collection": "./collections/api-smoke-tests.postman_collection.json",
      "environment": "./environments/staging.postman_environment.json"
    },
    {
      "collection": "./collections/api-smoke-tests.postman_collection.json",
      "environment": "./environments/production.postman_environment.json"
    }
  ],
  "parallel": true,
  "reporters": ["json", "html"],
  "outputDir": "./results"
}
```

**Run:**
```bash
postman-parallel --validate
postman-parallel
```

**Output:**
```
📂 Found 3 collection(s):
  1. api-smoke-tests.postman_collection.json (env: dev.postman_environment.json)
  2. api-smoke-tests.postman_collection.json (env: staging.postman_environment.json)
  3. api-smoke-tests.postman_collection.json (env: production.postman_environment.json)

Running collections in parallel...
✅ Dev environment tests passed
✅ Staging environment tests passed
✅ Production environment tests passed
```

---

## Example 3: Regression Testing

**Scenario:** Run comprehensive regression tests on multiple APIs

**Project structure:**
```
regression-tests/
├── collections/
│   ├── authentication-tests.json
│   ├── user-management-tests.json
│   ├── api-endpoints-tests.json
│   └── database-integration-tests.json
├── environments/
│   └── test.postman_environment.json
├── results/
└── config.json
```

**config.json:**
```json
{
  "collectionsFolder": "./collections",
  "environment": "./environments/test.postman_environment.json",
  "parallel": true,
  "reporters": ["json", "html"],
  "outputDir": "./results",
  "maxConcurrency": 2
}
```

**Run:**
```bash
postman-parallel --list
postman-parallel
```

**Output:**
```
📂 Found 4 collection(s):
  1. authentication-tests.json
  2. user-management-tests.json
  3. api-endpoints-tests.json
  4. database-integration-tests.json

Running collections (max 2 at a time)...
✅ authentication-tests.json completed (45 tests, 0 failures)
✅ api-endpoints-tests.json completed (120 tests, 0 failures)
✅ user-management-tests.json completed (80 tests, 2 failures)
✅ database-integration-tests.json completed (30 tests, 0 failures)
```

---

## Example 4: Smoke Tests (Quick Health Check)

**Scenario:** Run quick smoke tests after deployment. Fail fast, minimal overhead.

**Project structure:**
```
smoke-tests/
├── collections/
│   └── smoke-tests.postman_collection.json
├── environments/
│   └── smoke.postman_environment.json
├── results/
└── config.json
```

**config.json:**
```json
{
  "collections": [
    {
      "collection": "./collections/smoke-tests.postman_collection.json",
      "environment": "./environments/smoke.postman_environment.json"
    }
  ],
  "parallel": true,
  "reporters": ["json"],
  "outputDir": "./results"
}
```

**Run (in CI/CD):**
```bash
postman-parallel --validate && postman-parallel || exit 1
```

**Usage in GitHub Actions:**
```yaml
- name: Run smoke tests
  run: |
    postman-parallel --validate
    postman-parallel
```

---

## Example 5: Performance Testing

**Scenario:** Test API performance under load with multiple concurrent collections

**Project structure:**
```
performance-tests/
├── collections/
│   ├── load-test-batch-1.json
│   ├── load-test-batch-2.json
│   ├── load-test-batch-3.json
│   └── load-test-batch-4.json
├── environments/
│   └── load-test.postman_environment.json
├── results/
└── config.json
```

**config.json:**
```json
{
  "collectionsFolder": "./collections",
  "environment": "./environments/load-test.postman_environment.json",
  "parallel": true,
  "reporters": ["json"],
  "outputDir": "./results"
}
```

**Run:**
```bash
# Run all performance tests together
postman-parallel

# Check results
cat results/*
```

---

## Example 6: CI/CD Integration (Jenkins)

**Scenario:** Run in Jenkins pipeline, generate JUnit report

**Project structure:**
```
jenkins-tests/
├── collections/
│   └── api-tests.postman_collection.json
├── environments/
│   └── ci.postman_environment.json
├── Jenkinsfile
└── config.json
```

**config.json:**
```json
{
  "collections": [
    {
      "collection": "./collections/api-tests.postman_collection.json",
      "environment": "./environments/ci.postman_environment.json"
    }
  ],
  "parallel": false,
  "reporters": ["junit"],
  "outputDir": "./test-results"
}
```

**Jenkinsfile:**
```groovy
pipeline {
  stages {
    stage('Install') {
      steps {
        sh 'npm install -g @suban5/postman-parallel-runner'
      }
    }
    stage('Validate') {
      steps {
        sh 'postman-parallel --validate'
      }
    }
    stage('Test') {
      steps {
        sh 'postman-parallel'
      }
    }
    stage('Report') {
      steps {
        junit 'test-results/**/*.xml'
      }
    }
  }
}
```

---

## Example 7: Azure DevOps CI/CD

**Scenario:** Run tests in Azure DevOps pipeline

**azure-pipelines.yml:**
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: npm install -g @suban5/postman-parallel-runner
  displayName: 'Install Postman Parallel Runner'

- script: postman-parallel --validate
  displayName: 'Validate Configuration'

- script: postman-parallel
  displayName: 'Run Collections'
  continueOnError: false

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/test-results/*.xml'
  condition: always()
```

---

## Example 8: Advanced - Mixed Sequential & Parallel

**Scenario:** Some tests must run sequentially, others can run in parallel

**config.json:**
```json
{
  "collections": [
    {
      "collection": "./collections/setup-tests.json",
      "output": "./results/setup-results.json"
    },
    {
      "collection": "./collections/auth-tests.json",
      "output": "./results/auth-results.json"
    },
    {
      "collection": "./collections/api-tests.json",
      "output": "./results/api-results.json"
    },
    {
      "collection": "./collections/cleanup-tests.json",
      "output": "./results/cleanup-results.json"
    }
  ],
  "parallel": true,
  "maxConcurrency": 2,
  "reporters": ["json"],
  "outputDir": "./results"
}
```

---

## Common Commands

### 1. Initial Setup
```bash
postman-parallel --init     # Create config interactively
postman-parallel --validate # Verify config is valid
```

### 2. Preview What Will Run
```bash
postman-parallel --list     # See all collections
```

### 3. Run Tests
```bash
postman-parallel            # With default config.json
postman-parallel -c ./config.json  # With specific config
postman-parallel --verbose  # With detailed logging
```

### 4. Check System Health
```bash
postman-parallel --doctor   # Verify all dependencies
```

### 5. Get Help
```bash
postman-parallel --help     # Show all options
postman-parallel --version  # Show installed version
```

---

## Tips & Best Practices

### ✅ Do's

1. **Validate before running**: `postman-parallel --validate`
2. **Use environments**: Better test isolation and reusability
3. **Organize by function**: Auth, API, Integration, etc.
4. **Limit concurrency if needed**: `"maxConcurrency": 2` for resource constraints
5. **Use consistent naming**: Makes results easier to read

### ❌ Don'ts

1. **Don't hardcode URLs**: Use environment variables
2. **Don't mix sequential and parallel**: Use `maxConcurrency` instead
3. **Don't ignore validation errors**: Fix them before running
4. **Don't run too many in parallel**: Causes resource exhaustion
5. **Don't commit secrets**: Use environment variables

---

## Troubleshooting Examples

### Collections not found?

```bash
# Check what's there
ls -la ./collections

# List what will run
postman-parallel --list

# Validate config
postman-parallel --validate
```

### Wrong environment being used?

```bash
# Check current config
cat config.json

# Validate config
postman-parallel --validate

# Create correct config
postman-parallel --init
```

### Performance issues?

```json
{
  "parallel": true,
  "maxConcurrency": 2
}
```

Then run with `--verbose` to see what's happening:
```bash
postman-parallel --verbose
```

---

## More Help

- 📖 [Quick Start](./QUICK_START.md)
- ⚙️ [Configuration Reference](./CONFIGURATION.md)
- ❓ [Troubleshooting](./TROUBLESHOOTING.md)
- 📚 [Main README](../README.md)
