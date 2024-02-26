# `compat-flags`

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/compat-flags)](https://npmjs.com/package/compat-flags)
[![npm downloads](https://img.shields.io/npm/dm/compat-flags)](https://npmjs.com/package/compat-flags)

<!-- /automd -->

🌴 Gradual feature flags.

> [!NOTE]
> This is a reference implementation for Compatibility Date Flaga.
>
> See [RFC](./README.md) for the RFC details.

## Usage

Install package:

```sh
# npm
npm install compat-flags

# yarn
yarn add compat-flags

# pnpm
pnpm install compat-flags

# bun
bun install compat-flags
```

## Defining compatibility flags

```js
import {
  defineCompatibilityFlag,
  defineCompatibilityFlags,
} from "compat-flags";

const compatFlags = defineCompatibilityFlags({
  build_cache: defineCompatibilityFlag({
    name: "Enable build caching support",
    from: "2024/03/14",
  }),
  node_fix: defineCompatibilityFlag({
    name: "Enable hotfix for Node.js suppor",
    from: "2024/01/01",
    to: "2024/01/15",
  }),
});
```

## Checking compatibility flags

### `isCompatFlagEnabled`

`isCompatFlagEnabled` checks if a flag is enabled within the range `[from, to]` in compatibility flag.

If enabled, returns `true`, if disabled, returns `false` and if not specified, returns `undefined`.

```js
import { isCompatFlagEnabled } from "compat-flags";

// Loaded from user or integration config
const compatSpec = { date: "2020/1/1", flags: ["build_cache"] };

const buildCache = isCompatFlagEnabled("build_cache", compatFlags, userSpec);
```

## Date

### `formatDate`

`formatDate` makes sure input date is formatted as `YY/MM/DD`

```js
import type { formatDate } from 'compat-flags'
```

## Types

```js
// Typescript types
import type {
  CompatibilityFlags,
  CompatibilityFlag,
} from "./types";

// Type helpers
import {
  defineCompatibilityFlag,
  defineCompatibilityFlags,
} from "compat-flags";
```

`CompatibilityFlags` defines an object map from flag keys to their defenition.

`CompatibilityFlag` defines a specific compatibility flag with `from` date (required), and `name` (human friendly name) and `to` which are optional.

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).
