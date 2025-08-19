# call-action

## Overview

**call-action** is a GitHub Action for triggering workflows in other
repositories via the GitHub REST API. Written in TypeScript and bundled to
JavaScript, it is designed for robust automation and integration scenarios.

## Features

- Trigger workflows in any repository using the REST API
- Pass custom inputs and payloads to the workflow
- Supports GitHub Enterprise via configurable URL
- Comprehensive error handling and logging
- Fully tested with Jest

## Usage

Add the following to your workflow YAML:

```yaml
jobs:
  call-workflow:
    runs-on: ubuntu-latest
    steps:
      - name: Call Workflow Action
        uses: mdefenders/call-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          workflows-to-call:
            '{"owner/repo": {"yaml": "workflow.yaml", "ref": "main", "data":
            {"foo": "bar"}}}'
```

### Inputs

| Name                | Description                                   | Required | Default              |
| ------------------- | --------------------------------------------- | -------- | -------------------- |
| `github-url`        | GitHub Instance URL                           | No       | `https://github.com` |
| `github-token`      | GitHub Token (with repo/workflow permissions) | Yes      |                      |
| `workflows-to-call` | JSON with workflows and payloads to call      | Yes      |                      |

#### Example `workflows-to-call` Value

```json
{
  "owner/repo": {
    "yaml": "workflow.yaml",
    "ref": "main",
    "data": {
      "foo": "bar"
    }
  }
}
```

## Development

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm run test
```

### Bundle TypeScript

```bash
npm run bundle
```

## Project Structure

| Path                 | Description              |
| -------------------- | ------------------------ |
| `src/`               | TypeScript source code   |
| `dist/`              | Bundled JavaScript code  |
| `__tests__/`         | Jest unit tests          |
| `__fixtures__/`      | Test fixtures            |
| `.github/workflows/` | GitHub Actions workflows |
| `action.yml`         | Action metadata          |

## Contributing

Contributions are welcome! Please follow the guidelines in
`.github/copilot-instructions.md` and ensure all tests pass before submitting a
pull request.

## License

This project is licensed under the MIT License.
