# Postman Parallel Collection Runner

This helper demonstrates how to use a configuration file to drive the [Postman CLI](https://www.postman.com/downloads/postman-cli/) and execute multiple collections.

## Prerequisites

Before getting started, ensure you have:

- **Node.js 14+** installed (LTS recommended)
- The **Postman CLI** (`postman`) available on your `PATH`. Install it globally via npm:

```sh
npm install -g postman-cli
```

- An API key or interactive login if you intend to run cloud collections/environments

Verify the CLI is accessible by running:

```sh
which postman
# or
postman --version
```

## Why Use a Custom Script?

The Postman CLI alone does not support:

- Specifying a folder path instead of an individual collection file
- Toggling parallel/serial execution via a configuration file
- Auto-scanning directories for collections

A Node.js wrapper solves these limitations and provides full control.

---

## Setup

1. Install Node.js (14 or later).

2. Install the Postman CLI globally:

    ```sh
    npm install -g postman-cli
    ```

3. Authenticate the CLI if using cloud-based collections or environments.

    ### Authenticate the Postman CLI

        **Option 1: Interactive Login (Browser)**

        ```sh
        postman login
        ```

        If `POSTMAN_API_KEY` is set in your environment, it will be used automatically.

        **Option 2: Login Using an API Key**

        ```sh
        postman login --with-api-key "$POSTMAN_API_KEY"
        ```

        Replace `$POSTMAN_API_KEY` with your actual key.

        ### Generate an API Key

        1. Open Postman.
        2. Click your profile/avatar (top-right).
        3. Go to **Settings → API Keys**.
        4. Click **Generate API Key** and name it (e.g., CLI Key).
        5. Copy the key immediately — it is shown only once.

        ### Save the API Key in Your Environment

        **macOS / Linux (bash / zsh):**

        ```sh
        export POSTMAN_API_KEY="PMAK-xxxxxxxxxxxxx"
        ```

        Or inline without exporting:

        ```sh
        POSTMAN_API_KEY="PMAK-xxxxxxxxxxxxx" postman collection run ...
        ```

        **Windows (PowerShell):**

        Persist for future sessions:

        ```powershell
        setx POSTMAN_API_KEY "PMAK-xxxxxxxxxxxxx"
        ```

        For current session only:

        ```powershell
        $env:POSTMAN_API_KEY="PMAK-xxxxxxxxxxxxx"
        ```

        After setting the variable, you can either run `postman login` or execute any `postman` command directly. Authentication occurs automatically.

4. Clone this repository or copy the files into your project.
   The runner code is modularized under `lib/` (config parser, job parser, logger, runner).

---

## Folder Structure

```text
project/
├── config.json          # Configuration settings
├── run.js               # Runner script
├── collections/         # Place your .json collection exports here
├── environments/        # Environment files
└── results/             # Output from runs (auto-created)
```

---

## Configuration (config.json)

Collections can be specified in three ways:

1. **Folder mode** (default): Set `collectionsFolder`; all `*.json` files in that folder are run.
2. **Explicit list**: Provide an array of file paths and/or cloud IDs in `collections`.
3. **Per-collection environment & output**: Each entry may define its own `environment` and/or `output`.

### Examples

**Folder Mode**

```json
{
  "collections": [
    "./collections/foo.json",
    {
      "collection": "./collections/bar.json",
      "environment": "./environments/uatEnv.json"
    }
  ],
  "parallel": false
}
```

**Full Configuration**

```json
{
  "collectionsFolder": "./collections",
  "collections": [
    "./collections/foo.json",
    {
      "collection": "./collections/bar.json",
      "environment": "./environments/uatEnv.json",
      "output": "bar-results.json"
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
