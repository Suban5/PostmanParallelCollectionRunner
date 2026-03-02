# Postman Parallel Collection Runner

Run multiple Postman API collections in parallel from one configuration file.

## Installation

### Prerequisites

- Node.js 14 or later
- Postman CLI

Install Postman CLI:

```bash
npm install -g postman-cli
```

Install this tool:

```bash
npm install -g @suban5/postman-parallel-runner@latest
```

## Quick Start

### 1) Create a configuration (minimal working config)

```bash
postman-parallel --init
```

You can also copy any template from the examples below and modify it based on your requirements.

### 2) Validate configuration

```bash
postman-parallel --validate
```

### 3) Run collections

```bash
postman-parallel
```

Reports are written to `./results` by default.

## Usage

### Basic commands

```bash
postman-parallel --init      # Create config interactively
postman-parallel --validate  # Validate config file structure and values
postman-parallel --list      # Preview collections that will run
postman-parallel --doctor    # Check runtime setup and dependencies
postman-parallel --help      # Show usage and available options
postman-parallel --version   # Show installed CLI version
```

### Run with a specific configuration

```bash
postman-parallel --config ./config.json
```

`pathToConfig` can be either a relative path (for example `./config_simple.json`) or an absolute path (for example `C:/work/config_simple.json` on Windows).

### Continue running all collections after failures

```bash
postman-parallel --config ./config.json --continue-on-error
```

## Config Templates

Use these examples as starter files. Copy a template and adjust values such as `pathToCollection`, `pathToEnvironment`, `pathToResultsFolder`, and `filename`.

### config_simple.json (folder-based collections)

```json
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": "cli,json,html",
  "exportResultsFolder": "./results"
}
```

### config_diff_collection_environment.json (different environment per collection)

```json
{
  "collections": [
    {
      "collection": "./collections/collectionA.postman_collection.json",
      "environment": "./environments/envA.postman_environment.json",
      "output": "filenameA"
    },
    {
      "collection": "./collections/collectionB.postman_collection.json",
      "environment": "./environments/envB.postman_environment.json",
      "output": "filenameB"
    }
  ],
  "parallel": true,
  "maxConcurrency": 2,
  "reporters": "cli,json,html",
  "exportResultsFolder": "./results/multiEnv"
}
```

### config_cloud_ids.json (Postman cloud collection/environment IDs)

```json
{
  "collections": [
    {
      "collection": "collectionId1",
      "environment": "environmentId1",
      "output": "filename1"
    },
    {
      "collection": "collectionId2",
      "environment": "environmentId2",
      "output": "filename2"
    }
  ],
  "parallel": true,
  "maxConcurrency": 2,
  "reporters": "cli,json,html",
  "exportResultsFolder": "./results/cloudIdResults"
}
```

### config_custom_output_paths.json (custom subfolder output names)

```json
{
  "collections": [
    {
      "collection": "./collections/collectionA.postman_collection.json",
      "environment": "./environments/test.postman_environment.json",
      "output": "folderA/filenameA"
    },
    {
      "collection": "./collections/collectionB.postman_collection.json",
      "environment": "./environments/uat.postman_environment.json",
      "output": "folderB/filenameB"
    }
  ],
  "parallel": true,
  "maxConcurrency": 2,
  "reporters": "cli,json,html",
  "exportResultsFolder": "./results/customFolders"
}
```

### Run with any config template

```bash
postman-parallel --config pathToConfig
```

Examples:

```bash
postman-parallel --config ./config_simple.json
postman-parallel --config ./config_diff_collection_environment.json
postman-parallel --config C:/work/config_cloud_ids.json
```

## Optional Fields

You can add or remove optional fields based on your use case.

- `environment` (global): default `pathToEnvironment` for all collections
- `maxConcurrency`: limit parallel runs
- `output`: custom `filename` (or `folder/filename`) per collection
- `exportResultsFolder`: custom `pathToResultsFolder`
- `parallel`: set `false` for sequential execution

## Documentation

- [Quick Start Guide](./docs/QUICK_START.md)
- [Configuration Reference](./docs/CONFIGURATION.md)
- [Usage Examples](./docs/USAGE_EXAMPLES.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## Support

- [Report an Issue](https://github.com/Suban5/PostmanParallelCollectionRunner/issues)
- [Discussions](https://github.com/Suban5/PostmanParallelCollectionRunner/discussions)

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-change`
3. Commit your changes
4. Push your branch
5. Open a pull request

## License

This project is licensed under the [MIT License](LICENSE).
