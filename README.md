# Playwright MCP Demo

A TypeScript end-to-end automation framework for the [TodoMVC demo](https://demo.playwright.dev/todomvc/), built with Playwright Test, Page Objects, reusable fixtures, and the HTML reporter.

## Requirements

- Node.js 18 or newer
- npm

## Installation

```bash
npm install
npx playwright install
```

## Run the tests

```bash
npm test
```

Run with a visible browser or use Playwright's interactive UI:

```bash
npm run test:headed
npm run test:ui
```

The tests cover adding, editing, deleting, and completing todos, plus the All, Active, and Completed filters. TodoMVC does not provide pagination.

## HTML report

The HTML reporter is generated after each test run in `playwright-report/`. Open the latest report with:

```bash
npm run report
```

Failure screenshots and retry traces are stored in `test-results/`. These generated artifacts and installed dependencies are excluded from version control.

## Project structure

```text
.
├── fixtures/
│   └── test.ts
├── pages/
│   └── todo-page.ts
├── tests/
│   └── todo.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts
└── tsconfig.json
```
