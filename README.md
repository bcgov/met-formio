# met-formio

[![npm version](https://badge.fury.io/js/met-formio.svg)](https://badge.fury.io/js/met-formio)
[![npm:size:gzip](https://img.shields.io/bundlephobia/minzip/met-formio.svg?label=npm:size:gzip)](https://bundlephobia.com/result?p=met-formio)

Custom [Form.io](https://form.io) components for the BC Government **Modern Engagement Tool** (MET / EPIC Engage). It provides the plain-language survey components used by the engagement form builder, along with a visual builder for conditional logic.

Consumed by [`bcgov/epic-engage`](https://github.com/bcgov/epic-engage) (`met-web`).

## Install

```bash
npm install met-formio
```

React is a peer dependency. The components render through the host application's React instance:

| Peer | Range |
|---|---|
| `react` | `>=18` |
| `react-dom` | `>=18` |

## Usage

Register the component set with Form.io before rendering any form, and import the stylesheet:

```ts
import { Formio } from '@formio/js';
import MetFormioComponents from 'met-formio/lib/index.js';

Formio.use(MetFormioComponents);
```

```scss
@import 'met-formio/dist/met-formio-components.css';
```

## Components

All appear in the builder's **simple** palette group unless noted.

| Type | Palette name |
|---|---|
| `simpletextfield` | Single Line Answer |
| `simpletextarea` | Multiple Lines Answer |
| `simpleradios` | Radio Button |
| `simplecheckboxes` | Checkbox |
| `simpleselect` | Drop-down |
| `simplesurvey` | Likert |
| `simpleranking` | Ranking |
| `simplepostalcode` | Postal Code |
| `simpletime` | Time |
| `header` | Header |
| `paragraph` | Paragraph |
| `simplecontent` | Content |
| `simplehtmlelement` | HTML Element *(layout group)* |
| `categorycheckboxes` | Category Checkbox |
| `categorytextarea` | Category Component Comment |
| `categorycommentcontainer` | Category Comment |

`conditionbuilder` is also registered. It is not in the palette as it backs the Visual Builder panel below.

## Conditional logic

Each component's **Conditions** tab offers a **Visual Builder** that writes standard JSONLogic to `conditional.json`. It understands Likert questions and Ranking statements, which are otherwise hard to express by hand.

Two constraints are worth knowing when authoring:

- Form.io evaluates `conditional.json` against `{ data, row, form, _ }`, so every field reference is rooted at `data.` e.g. `{"var": "data.myField"}`.
- JSONLogic's `var` splits its path on `.`, so any value that becomes part of a data path cannot contain a period. Survey question values and checkbox option values are validated against this at authoring time. Answer values, radio/select options and ranking statement IDs are compared rather than traversed, so periods are fine there.

Form.io checks `customConditional` first, then the Simple conditional, and only then `conditional.json`. The Visual Builder warns when one of the other two would take precedence.

## Development

```bash
npm install
npm run build     # tsc -> lib/, gulp templates, webpack -> dist/, sass -> dist/*.css
npm test          # mocha + ts-node + jsdom
npm run lint      # eslint over src/**/*.{ts,tsx}
```

`npm run test:coverage` adds an nyc report. CI runs lint, tests and the build on every pull request.

### Build output

| Path | Contents |
|---|---|
| `lib/` | Compiled ES modules and type declarations - the package entry point, and what bundler-based consumers should import. |
| `dist/` | Self-contained UMD bundles (global `METFormioComponents`) plus the compiled stylesheet. React is bundled here, so do not load it alongside an application that provides its own React. |

Both directories are committed, so run `npm run build` and include the result in any change to `src/`.

### Known quirk

`package.json` carries a non-standard `"module": "node"` field. Some bundlers need it worked around (Vite, for example, requires an explicit alias to the package root).

## License

Apache-2.0
