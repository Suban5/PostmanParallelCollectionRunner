# 🚀 Postman Parallel Collection Runner

Run multiple Postman API collections in parallel from a single configuration file.

<p align="center">
  <strong>Easy • Fast • Reliable</strong>
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
  "reporters": "cli,json,html",
  "outputDir": "./results"
}
```

**Run:**
```bash
postman-parallel
```

This checks your Node.js version, Postman CLI availability, and config health (`config*.json` auto-detection in current directory).

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

Contributions are welcome! Open issues or submit pull requests. Modules can be swapped or tested individually.
- 🐛 [Report an Issue](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)
- 💬 [Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)
- ⭐ [Star the Repository](https://github.com/Suban5/PostmanParallelCollectionRunner)

---

## 📊 Project Status

- ✅ Version 1.0.2 - Diagnostics and config UX improvements
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
npm version 1.0.2 --no-git-tag-version

# 3) Commit release changes
git add .
git commit -m "release: v1.0.2"

# 4) Tag release
git tag v1.0.2

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
