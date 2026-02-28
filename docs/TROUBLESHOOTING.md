# 🐛 Troubleshooting & FAQs

Solutions to common problems when using Postman Parallel Collection Runner.

---

## Installation Issues

### "npm: command not found"

Node.js is not installed properly.

**Fix:**
1. [Download Node.js](https://nodejs.org/) (version 14 or higher)
2. Install it
3. Verify: `node --version` and `npm --version`

---

### "postman-parallel: command not found"

The tool is not in your system's PATH.

**Fix:**

```bash
# Reinstall globally
npm install -g @suban5/postman-parallel-runner

# Check where npm puts global packages
npm config get prefix

# Verify installation
npm list -g @suban5/postman-parallel-runner

# Test the command
postman-parallel --version
```

If still not working, reinstall npm:
```bash
# macOS/Linux
curl https://www.npmjs.com/install.sh | sh

# Windows - download from https://nodejs.org/
```

---

### "Cannot find module 'postman'"

Postman CLI is not installed.

**Fix:**

```bash
npm install -g postman-cli
```

---

## Configuration Issues

### "Config not found at ./config.json"

The configuration file doesn't exist or is in the wrong location.

**Fix:**

```bash
# Create config interactively
postman-parallel --init

# Or manually create config.json in your project root
cat > config.json << 'EOF'
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": ["cli", "json"],
  "outputDir": "./results"
}
EOF

# Verify the file exists
ls -la config.json
```

---

### "JSON parse error in config.json"

Your config file has invalid JSON syntax.

**Common mistakes:**

```json
// ❌ Trailing comma before closing brace
{
  "key": "value",
}

// ✅ Remove trailing comma
{
  "key": "value"
}
```

```json
// ❌ Single quotes instead of double quotes
{
  'key': 'value'
}

// ✅ Use double quotes
{
  "key": "value"
}
```

```json
// ❌ Unquoted keys
{
  key: "value"
}

// ✅ Quote all keys
{
  "key": "value"
}
```

**Fix:**

1. Validate JSON online: [jsonlint.com](https://jsonlint.com/)
2. Copy your config to the validator
3. Check for syntax errors
4. Fix your config.json
5. Run `postman-parallel --validate`

---

### "collectionsFolder is not a string"

The `collectionsFolder` value is the wrong type.

**❌ Wrong:**
```json
{
  "collectionsFolder": ["./collections"]
}
```

**✅ Correct:**
```json
{
  "collectionsFolder": "./collections"
}
```

---

### "parallel must be a boolean"

The `parallel` value must be `true` or `false`, not a string.

**❌ Wrong:**
```json
{
  "parallel": "true"
}
```

**✅ Correct:**
```json
{
  "parallel": true
}
```

---

### "maxConcurrency must be a non-negative integer"

The `maxConcurrency` value must be a whole number >= 0.

**❌ Wrong:**
```json
{
  "maxConcurrency": -1
}
```

**✅ Correct:**
```json
{
  "maxConcurrency": 2
}
```

---

## Collections & Files

### "Collections folder does not exist"

The folder specified in `collectionsFolder` doesn't exist.

**Fix:**

```bash
# Create the folder
mkdir -p ./collections

# Add your Postman collection files (*.postman_collection.json)
# Then run
postman-parallel --init
```

---

### "Collections not found in folder"

The folder exists but is empty or has no `.postman_collection.json` files.

**Fix:**

1. Check what's in the folder:
   ```bash
   ls -la ./collections/
   ```

2. Ensure files end with `.postman_collection.json`:
   ```bash
   # ✅ Correct
   auth-tests.postman_collection.json
   api-tests.postman_collection.json
   
   # ❌ Wrong
   auth-tests.json
   api-tests.postman_collection
   ```

3. Export collections from Postman:
   - In Postman, right-click collection → Export
   - Save as JSON to your collections folder
   - Ensure filename ends with `.postman_collection.json`

---

### "Cannot find environment file at ..."

Environment file is missing or path is wrong.

**Fix:**

```bash
# Check the path exists
ls -la ./environments/my-env.json

# Check your config references the correct path
postman-parallel --validate

# If path is wrong, fix it in config.json
vim config.json
```

---

## Execution Issues

### "All collections completed but no results"

Collections ran but results weren't saved.

**Check:**

```bash
# Verify output directory was created
ls -la ./results/

# Check if results exist
ls -la ./results/*.json

# Check file permissions
chmod 755 ./results/
```

**Fix:**

```json
{
  "outputDir": "./results"
}
```

Ensure:
1. Output directory exists or is writable
2. You have write permissions
3. Disk has free space

---

### "Tests failed with no details"

Tests failed but error messages aren't clear.

**Fix:** Run with verbose output:

```bash
postman-parallel --verbose
```

This shows:
- Exact command being executed
- Environment variables
- Collection execution status
- Detailed error messages

---

### "Some tests timeout or hang"

Collections hang and don't complete.

**Fix:**

1. Check for infinite loops in your tests
2. Increase timeout if needed
3. Run sequentially to isolate the issue:

```json
{
  "parallel": false,
  "maxConcurrency": 1
}
```

Then run:
```bash
postman-parallel --verbose
```

---

### "Out of memory error"

Too many collections running at once consuming all RAM.

**Fix:**

Limit concurrent collections:

```json
{
  "parallel": true,
  "maxConcurrency": 2
}
```

Or run sequentially:

```json
{
  "parallel": false
}
```

---

## Validation

### "Missing required option"

Your config is missing required options.

**Fix:**

Run validation to see what's missing:
```bash
postman-parallel --validate
```

Or recreate the config:
```bash
postman-parallel --init
```

---

### "postman-parallel --validate" shows errors

Configuration has validation issues.

**Fix:**

1. Read the error message carefully
2. Check the offending field in config.json
3. Refer to the [Configuration Guide](./CONFIGURATION.md)
4. Fix the issue
5. Run `postman-parallel --validate` again

---

## Permissions & Access

### "Permission denied" when creating results

The results folder isn't writable.

**Fix:**

```bash
# Make directory writable
chmod 755 ./results

# Or create new results directory
mkdir -p ./results
chmod 755 ./results
```

---

### "Permission denied" running postman-parallel

The command isn't executable.

**Fix:**

```bash
# Make the script executable
chmod +x /usr/local/bin/postman-parallel

# Or reinstall
npm install -g @suban5/postman-parallel-runner
```

---

## Diagnostics

### Check System Health

Run the diagnostic tool:

```bash
postman-parallel --doctor
```

This verifies:
- ✅ Node.js version
- ✅ Postman CLI is available in PATH
- ✅ Config file validity
- ✅ Collections folder exists

---

### Get More Information

See all available options:

```bash
postman-parallel --help
```

Check your version:

```bash
postman-parallel --version
```

Preview what will run:

```bash
postman-parallel --list
```

---

## Can't Find Your Issue?

### 1. Check the Docs

- 📖 [Quick Start](./QUICK_START.md)
- ⚙️ [Configuration Guide](./CONFIGURATION.md)
- 💡 [Usage Examples](./USAGE_EXAMPLES.md)

### 2. Get Help Online

- 💬 [GitHub Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
- 🐛 [Report an Issue](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)

### 3. Provide Debug Info

When asking for help, include:

```bash
# Your system info
node --version
npm --version
postman --version

# Your config
cat config.json

# Your error message
postman-parallel --verbose  # Run with verbose output, copy the error
```

---

## 🎓 Common Patterns

### Pattern 1: Validate Before Running
```bash
postman-parallel --validate
postman-parallel
```

### Pattern 2: Check and Fix
```bash
postman-parallel --validate     # Errors? Fix config.json
postman-parallel --list         # Collections look right? Run
postman-parallel
```

### Pattern 3: Debug Failing Tests
```bash
postman-parallel --verbose     # See detailed logs
cat ./results/*.json           # Check results
```

### Pattern 4: Diagnose System
```bash
postman-parallel --doctor      # Check everything
postman-parallel --validate    # Check config
postman-parallel --list        # Check collections
```

---

## Success Checklist

Before running, ensure:

- ✅ Node.js 14+ is installed
- ✅ Postman CLI is installed
- ✅ config.json exists and is valid
- ✅ Collections folder exists
- ✅ Collection files end with `.postman_collection.json`
- ✅ Results folder is writable
- ✅ Config validates: `postman-parallel --validate`

---

Still stuck? 

💬 Ask on [GitHub Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
🐛 [Report on GitHub Issues](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)
