# 🚀 Quick Start Guide

Welcome to Postman Parallel Collection Runner! This guide will get you running in **5 minutes**.

---

## ⚙️ Prerequisites

Before you start, make sure you have:
- **Node.js 14+** ([Download](https://nodejs.org/))
- **Postman Collections** (JSON files)
- **Postman CLI** - Install with: `npm install -g postman-cli`

Check your setup:
```bash
node --version          # Should be v14 or higher
npm --version           # Should be v6 or higher
postman --version       # Optional, for Postman CLI
```

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g @suban5/postman-parallel-runner
```

Verify installation:
```bash
postman-parallel --version
```

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Create a Config (Interactive)

```bash
postman-parallel --init
```

Answer the prompts:
- **Collections folder**: Where your `.postman_collection.json` files are (default: `./collections`)
- **Parallel execution**: Run collections simultaneously? (yes/no, default: yes)
- **Reporters**: How would you like results? (cli, json, html, etc.)
- **Output directory**: Where to save results (default: `./results`)

✅ This creates `config.json`

### Step 2: Verify Your Config

```bash
postman-parallel --validate
```

Expected output:
```
✅ Configuration is valid!
📄 Config file: /path/to/config.json
📂 Collections folder: ./collections
🚀 Collections to run: 2
⚡ Parallel mode: enabled
📊 Reporters: cli, json
```

### Step 3: Run Your Collections

```bash
postman-parallel
```

Watch the collections run in parallel! Results are saved to `./results`

---

## 📂 Project Structure

Set up your project like this:

```
my-api-tests/
├── collections/
│   ├── auth-tests.postman_collection.json
│   ├── user-api-tests.postman_collection.json
│   └── product-api-tests.postman_collection.json
├── environments/
│   ├── dev.postman_environment.json
│   └── prod.postman_environment.json
├── results/
│   ├── auth-tests.json
│   ├── user-api-tests.json
│   └── product-api-tests.json
└── config.json
```

---

## 🔧 Common Tasks

### List Available Collections

See what collections will run:

```bash
postman-parallel --list
```

Output:
```
📂 Found 3 collection(s):
  1. auth-tests.postman_collection.json
  2. user-api-tests.postman_collection.json
  3. product-api-tests.postman_collection.json

Run "postman-parallel" to execute these collections
```

### Check Your Setup

Diagnostic check to ensure everything is ready:

```bash
postman-parallel --doctor
```

Output:
```
🏥 Running diagnostic checks...

✅ Node.js: v18.12.0
✅ Postman CLI: installed (1.29.5)
✅ config.json: valid

Diagnostic complete. All systems operational! 🚀
```

### Run with a Different Config

```bash
postman-parallel --config ./custom-config.json
```

### Verbose Output

See detailed logs:

```bash
postman-parallel --verbose
```

---

## 📋 Configuration Examples

### Example 1: Single Environment

```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": "cli,json",
  "outputDir": "./results"
}
```

### Example 2: Multi-Environment Testing

```json
{
  "collections": [
    {
      "collection": "./collections/api-tests.json",
      "environment": "./environments/dev.json"
    },
    {
      "collection": "./collections/api-tests.json",
      "environment": "./environments/prod.json"
    }
  ],
  "parallel": true,
  "reporters": "json,html",
  "outputDir": "./results"
}
```

### Example 3: Sequential Execution

```json
{
  "collectionsFolder": "./collections",
  "parallel": false,
  "maxConcurrency": 1,
  "reporters": "html",
  "outputDir": "./test-results"
}
```

---

## 🐛 Troubleshooting

### "postman-parallel: command not found"

The CLI is not in your PATH. Reinstall and ensure npm global is configured:

```bash
npm install -g @suban5/postman-parallel-runner
npm config get prefix     # Check where global packages go
```

### "Config not found at ./config.json"

Create a config file:

```bash
postman-parallel --init
```

Or point to an existing one:

```bash
postman-parallel --config ./my-config.json
```

### "Collections folder does not exist"

During `--init`, create the folder or ensure the path is correct:

```bash
mkdir -p ./collections
postman-parallel --init
```

### "Cannot find module 'postman'"

Postman CLI is not installed. Install Newman (lightweight Postman CLI):

```bash
npm install -g postman
# Or use Newman
npm install -g newman
```

### Results are Empty

Ensure:
1. ✅ Collections are valid JSON (check with `postman-parallel --validate`)
2. ✅ Collections folder exists and has `.postman_collection.json` files
3. ✅ Output directory exists or is writable

---

## 🎓 Next Steps

- 📖 **[Configuration Guide](./CONFIGURATION.md)** - Learn all config options
- 💡 **[Usage Examples](./USAGE_EXAMPLES.md)** - Explore common scenarios
- 🔍 **[Full Documentation](../README.md)** - Complete reference

---

## ❓ Need Help?

- 📚 Check the [Troubleshooting guide](./TROUBLESHOOTING.md)
- 💬 Ask on [GitHub Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
- 🐛 Report issues on [GitHub Issues](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)

---

## 🎉 You're All Set!

You're now ready to run multiple Postman collections in parallel. Start with:

```bash
postman-parallel --init
postman-parallel --validate
postman-parallel
```

Happy testing! 🚀
