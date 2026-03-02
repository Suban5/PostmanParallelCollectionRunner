# ⚙️ Configuration Reference

This guide explains all configuration options for Postman Parallel Collection Runner.

---

## 📋 Configuration File

Create a `config.json` file in your project root:

```bash
postman-parallel --init    # Interactive setup
```

Or manually create it:

```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "continueOnError": true,
  "reporters": "cli,json,html",
  "outputDir": "./results"
}
```

---

## 🔑 Configuration Options

### `collectionsFolder` (String)

**Required if** `collections` array is not specified

Path to folder containing Postman collection files (`.postman_collection.json`)

```json
{
  "collectionsFolder": "./collections"
}
```

**Notes:**
- Relative or absolute path
- All `.postman_collection.json` files will be discovered automatically
- Takes precedence if both `collectionsFolder` and `collections` are present

---

### `collections` (Array of Strings or Objects)

**Required if** `collectionsFolder` is not specified

Explicit list of collections to run.

#### Option A: Array of Strings

```json
{
  "collections": [
    "./collections/auth-tests.postman_collection.json",
    "./collections/api-tests.postman_collection.json"
  ]
}
```

#### Option B: Array of Objects (with environments)

```json
{
  "collections": [
    {
      "collection": "./collections/api-tests.postman_collection.json",
      "environment": "./environments/dev.postman_environment.json",
      "output": "./results/dev-results.json"
    },
    {
      "collection": "./collections/api-tests.postman_collection.json",
      "environment": "./environments/prod.postman_environment.json",
      "output": "./results/prod-results.json"
    }
  ]
}
```

**Notes:**
- `collection`: Required - path to `.postman_collection.json`
- `environment`: Optional - path to environment file
- `output`: Optional - where to save this collection's results

---

### `parallel` (Boolean)

Run collections simultaneously or sequentially.

```json
{
  "parallel": true
}
```

**Default:** `true`

**Examples:**
- `true`: Run all collections at the same time (faster)
- `false`: Run one collection at a time (slower, useful for resource-constrained systems)

---

### `continueOnError` (Boolean)

Continue running remaining collections even if one collection fails.

```json
{
  "continueOnError": true
}
```

**Default:** `true` (when omitted)

**Examples:**
- `true`: Complete all collections and summarize failures at the end
- `false`: Stop immediately on first failed collection (fail-fast)

---

### `maxConcurrency` (Integer)

Maximum number of collections to run at once.

```json
{
  "parallel": true,
  "maxConcurrency": 3
}
```

**Default:** `0` (unlimited)

**Notes:**
- Only used when `parallel` is `true`
- `0` or omitted = no limit
- `1` = same as `parallel: false`
- `3` = max 3 collections running simultaneously

---

### `reporters` (String)

Output formats for test results.

```json
{
  "reporters": "cli,json,html"
}
```

**Supported reporters:**
- `cli` - Terminal/console output
- `json` - JSON file with results
- `html` - HTML report (if using Newman)
- `junit` - JUnit XML (CI/CD integration)

**Default:** `cli,json`

---

### `outputDir` (String)

Where to save test results.

```json
{
  "outputDir": "./results"
}
```

**Default:** `./results`

**Notes:**
- Created automatically if doesn't exist
- All results go here unless `output` is specified per-collection

---

### `environment` (String)

Default environment file for all collections.

```json
{
  "environment": "./environments/test.postman_environment.json",
  "collections": [
    "./collections/auth-tests.postman_collection.json",
    "./collections/api-tests.postman_collection.json"
  ]
}
```

**Notes:**
- Applied to all collections unless overridden per-collection
- Can be overridden by `environment` in `collections` array

---

### `environmentsFolder` (String)

Folder containing environment files (for reference).

```json
{
  "environmentsFolder": "./environments"
}
```

**Notes:**
- Currently for documentation
- Future: may auto-discover environments

---

### `exportResultsFolder` (String)

Alias for `outputDir` (for backward compatibility).

```json
{
  "exportResultsFolder": "./test-results"
}
```

---

## 📝 Complete Config Examples

### Example 1: Basic Single Environment

```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "continueOnError": true,
  "reporters": "cli,json",
  "outputDir": "./results"
}
```

### Example 2: Multi-Environment Testing

```json
{
  "collections": [
    {
      "collection": "./collections/smoke-tests.json",
      "environment": "./environments/dev.json"
    },
    {
      "collection": "./collections/smoke-tests.json",
      "environment": "./environments/staging.json"
    },
    {
      "collection": "./collections/smoke-tests.json",
      "environment": "./environments/prod.json"
    }
  ],
  "parallel": true,
  "continueOnError": true,
  "maxConcurrency": 2,
  "reporters": "json,html",
  "outputDir": "./results"
}
```

### Example 3: Sequential Execution (CI/CD)

```json
{
  "collectionsFolder": "./collections",
  "parallel": false,
  "continueOnError": false,
  "reporters": "junit",
  "outputDir": "./test-results",
  "environment": "./environments/ci.json"
}
```

### Example 4: Mixed Collections with Different Outputs

```json
{
  "collections": [
    {
      "collection": "./collections/api-tests.json",
      "output": "./results/api-tests-results.json"
    },
    {
      "collection": "./collections/integration-tests.json",
      "environment": "./environments/test.json",
      "output": "./results/integration-tests-results.json"
    },
    {
      "collection": "./collections/performance-tests.json"
    }
  ],
  "parallel": true,
  "continueOnError": true,
  "reporters": "json",
  "outputDir": "./results"
}
```

### Example 5: Limited Concurrency

```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "continueOnError": true,
  "maxConcurrency": 2,
  "reporters": "cli,json",
  "outputDir": "./results"
}
```

---

## ✅ Validation

Validate your config before running:

```bash
postman-parallel --validate
```

This checks:
- ✅ File exists and is valid JSON
- ✅ All required fields are present
- ✅ All field types are correct
- ✅ All referenced files exist

---

## 🔍 Preview Collections

See what will run:

```bash
postman-parallel --list
```

Output:
```
📂 Found 3 collection(s):
  1. auth-tests.postman_collection.json
  2. api-tests.postman_collection.json (env: test.postman_environment.json)
  3. integration-tests.postman_collection.json

Run "postman-parallel" to execute these collections
```

---

## 🐛 Common Issues

### "collectionsFolder is not a string"

`collectionsFolder` must be a string:

```json
{
  "collectionsFolder": "./collections"  ✅
}
```

Not valid:
```json
{
  "collectionsFolder": ["./collections"]  ❌ (array)
}
```

### "collections must be an array"

`collections` must be an array:

```json
{
  "collections": [
    "./collections/test.json"  ✅
  ]
}
```

Not valid:
```json
{
  "collections": "./collections/test.json"  ❌ (string)
}
```

### "parallel must be a boolean"

`parallel` must be `true` or `false`:

```json
{
  "parallel": true  ✅
}
```

Not valid:
```json
{
  "parallel": "true"  ❌ (string)
}
```

---

## 📖 More Information

- 🚀 [Quick Start](./QUICK_START.md)
- 💡 [Usage Examples](./USAGE_EXAMPLES.md)
- ❓ [Troubleshooting](./TROUBLESHOOTING.md)
- 📚 [Main README](../README.md)

---

## 🤝 Questions?

- 💬 [GitHub Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
- 🐛 [GitHub Issues](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)
