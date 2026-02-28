# 🚀 Postman Parallel Collection Runner

Run multiple Postman API collections in parallel from a single configuration file.

<p align="center">
  <strong>Easy • Fast • Reliable</strong>
</p>

---

## ✨ Features

- ✅ **Run collections in parallel** - Execute multiple collections simultaneously
- ✅ **Simple configuration** - Single `config.json` file controls everything
- ✅ **Multiple environments** - Test across dev, staging, and production
- ✅ **Auto-discovery** - Automatically finds collections in a folder
- ✅ **Flexible reporters** - CLI, JSON, HTML, and JUnit output formats
- ✅ **Easy setup** - Interactive setup wizard with `--init` flag
- ✅ **Global CLI** - Install once via npm, use everywhere

---

## 📦 Installation

```bash
npm install -g @suban5/postman-parallel-runner
```

That's it! You're ready to go.

---

## 🎯 Quick Start (3 Steps)

### 1️⃣ Create a Config

```bash
postman-parallel --init
```

Answer a few questions and your config is ready.

### 2️⃣ Validate Your Setup

```bash
postman-parallel --validate
```

Ensures everything is configured correctly.

### 3️⃣ Run Your Collections

```bash
postman-parallel
```

Results are saved to `./results` by default.

---

## 📚 Documentation

- 📖 **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 5 minutes
- ⚙️ **[Configuration Reference](./docs/CONFIGURATION.md)** - All configuration options
- 💡 **[Usage Examples](./docs/USAGE_EXAMPLES.md)** - Real-world scenarios
- 🐛 **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Solutions to common issues

---

## Prerequisites

Before getting started, ensure you have:

- **Node.js 14+** installed ([Download](https://nodejs.org/))
- **Postman CLI** - Install with:

```bash
npm install -g postman-cli
```

Verify everything is ready:

```bash
postman-parallel --doctor
```

This checks your Node.js version, Postman CLI availability, and overall setup.
It verifies that the Postman CLI executable is available in your PATH.

---

## 🎓 How It Works

### Basic Example

**Project structure:**
```
my-api-tests/
├── collections/
│   ├── auth-tests.postman_collection.json
│   ├── api-tests.postman_collection.json
│   └── integration-tests.postman_collection.json
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

Results automatically appear in `./results`! 🎉

---

## 🔧 Available Commands

```bash
# Create config interactively
postman-parallel --init

# Validate your config
postman-parallel --validate

# Preview collections that will run
postman-parallel --list

# Run collections (default config.json)
postman-parallel

# Run with specific config
postman-parallel --config ./my-config.json

# Verbose logging for debugging
postman-parallel --verbose

# System diagnostics
postman-parallel --doctor

# Show help
postman-parallel --help

# Show version
postman-parallel --version
```

---

## 🌍 Use Cases

**API Testing**
- Test multiple API endpoints in parallel
- Run comprehensive test suites efficiently

**Multi-Environment Testing**
- Run the same tests across dev, staging, and production
- Verify behavior is consistent across environments

**Regression Testing**
- Execute large regression test suites
- Control execution speed with concurrency limits

**Smoke Tests**
- Quick health checks after deployment
- Fast feedback on critical functionality

**CI/CD Integration**
- Jenkins, GitHub Actions, Azure DevOps pipelines
- Automated testing as part of deployment

**Performance Testing**
- Load test with multiple concurrent collections
- Generate performance reports

---

## 💻 Platform Support

- ✅ macOS
- ✅ Linux
- ✅ Windows
- ✅ Docker
- ✅ CI/CD Systems (GitHub Actions, Jenkins, Azure DevOps, GitLab CI)

---

## 🚀 Why This Tool?

The Postman CLI alone cannot:
- ❌ Use folder paths (only individual collections)
- ❌ Configure parallel execution via config
- ❌ Auto-discover collections in a folder
- ❌ Manage multiple environments easily

Our tool adds:
- ✅ Folder-based collection discovery
- ✅ Flexible parallel/sequential execution
- ✅ Clean configuration-driven approach
- ✅ Multiple reporter formats
- ✅ Interactive setup wizard
- ✅ Complete documentation

---

## 📖 Getting Help

### Common Questions

**Q: Where do I put my collections?**
A: Create a `collections/` folder and export your Postman collections there. See [Quick Start](./docs/QUICK_START.md).

**Q: How do I test multiple environments?**
A: Use the explicit `collections` array in your config. See [Usage Examples](./docs/USAGE_EXAMPLES.md#example-2-multi-environment-testing).

**Q: Can I use this in CI/CD?**
A: Yes! See [Usage Examples](./docs/USAGE_EXAMPLES.md#example-6-cicd-integration-jenkins) for Jenkins, GitHub Actions, and Azure DevOps.

**Q: I'm stuck. Where do I get help?**
A: Check [Troubleshooting](./docs/TROUBLESHOOTING.md) or ask on [GitHub Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions).

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🔗 Links

- 📖 [Documentation](./docs/)
- 🐛 [Report an Issue](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)
- 💬 [Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
- ⭐ [Star the Repository](https://github.com/Suban5/PostmanParallelCollectionRunner)

---

## 📊 Project Status

- ✅ Version 1.0.1 - Foundation released
- 📋 Phase 1 - npm distribution & core functionality complete
- 🚀 Phase 2 - Documentation & user experience in progress
- 🔜 Phase 3 - Advanced features and integrations planned

---

## 📦 Release & Publish

Use these steps to prepare and publish to npm:

```bash
# 1) Run tests
npm test

# 2) Update package version (required)
npm version 1.0.1 --no-git-tag-version

# 3) Commit release changes
git add .
git commit -m "release: v1.0.1"

# 4) Tag release
git tag v1.0.1

# 5) Publish to npm
npm publish
```

For automatic patch bumps:

```bash
npm run version:patch
```

---

## 🙏 Acknowledgments

Built with ❤️ for the API testing community.

---

**Ready to get started?** → [Quick Start Guide](./docs/QUICK_START.md)
    },
    {
      "collection": "3186668-cloud-id",
      "environment": "3186668-env-id"
    }
  ],
  "environment": "./environments/testEnv.json",
  "parallel": true,
  "maxConcurrency": 3,
  "reporters": "cli,json,html",
  "exportResultsFolder": "./results"
}
```

### Configuration Options

- **`collectionsFolder`**: Directory containing collection JSON files.
- **`collections`**: Array of jobs. Each element can be:
  - A string (local path or cloud ID, uses global environment if defined)
  - An object `{ collection, environment, output }`
- **`environment`**: Global environment path or cloud ID (optional).
- **`parallel`**: `true` for concurrent runs, `false` for sequential.
- **`maxConcurrency`**: Non-negative integer. Limits concurrent runs when `parallel` is `true`. `0` or omitted = no cap.
- **`reporters`**: Comma-separated reporter names (`cli`, `json`, `html`). JSON/HTML/JUnit files are saved to `exportResultsFolder`.
- **`exportResultsFolder`**: Base directory where report files are written.

**Note:** If both `collections` and `collectionsFolder` are set, `collections` takes precedence.

---

## Running the Runner

```sh
node run.js                       # uses ./config.json
node run.js --config config1.json # specify alternate config file
node run.js --verbose             # enable debug logs
```

Sequential execution can be enforced:

```json
{"parallel": false}
```

The `--verbose` flag outputs detailed logs for each child process.

---

## Using Postman Cloud IDs

Cloud IDs allow you to run collections/environments without exporting them locally.

### Find a Cloud ID

**Postman App:**

- Open the collection/environment
- Click the three-dot menu next to its name and choose **View Details**
- Copy the ID

**Postman API:**

```sh
curl -H "X-API-Key: <your_key>" https://api.getpostman.com/collections
```

Parse the `uid` field from the JSON response.

**Postman CLI:**

```sh
postman api get collections --environment <your_key>
```

### Sample Config with Cloud IDs

```json
{
  "collections": [
    "3186668-f695cab7-6878-eb55-7943-ad88e1ccfd65",
    "3186668-18e4a184-d0f9-4f15-a0ae-fd430e544ff0"
  ],
  "environment": "3186668-c348c8ad-0003-482b-a965-dee211b75b2a",
  "parallel": true,
  "reporters": "cli",
  "exportResultsFolder": "./results"
}
```

---

## Tips

- The code is modularized (`lib/config.js`, `lib/parser.js`, `lib/logger.js`, `lib/runner.js`) and easy to extend.
- CLI options available via `postman collection run` can be used in the script.
- Extend the configuration object with additional CLI flags or environment variables as needed.
- For CI pipelines, the runner exits with a non-zero code if a collection fails.

---

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Open issues or submit pull requests. Modules can be swapped or tested individually.
