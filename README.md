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
import MetFormioComponents from 'met-formio';

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
npm run build     # tsc -> lib/, precompile .ejs templates, sass -> dist/*.css
npm test          # mocha + ts-node + jsdom
npm run lint      # eslint over src/**/*.{ts,tsx}
```

`npm run test:coverage` adds an nyc report. CI runs lint, tests and the build on every pull request.

Two dependencies are deliberately held back, both because of the CommonJS test harness
(`test/register.js` runs the specs through ts-node):

| Pinned | Why |
|---|---|
| `mocha` 10 | Mocha 11 loads specs through Node's ESM loader, so the ts-node hook never runs. Moving up needs a real TypeScript ESM loader, because Node's built-in type stripping does not handle the JSX in `*.tsx`. |
| `chai` 4 | Chai 5+ is ESM-only. Same blocker. |

TypeScript is held at 5.x because `typescript-eslint` does not yet support the 7.x compiler.

Runtime dependency ranges stay as wide as they can. `@formio/js` and `lodash` are both
shared with the host application, so a raised floor here forces a transitive upgrade on
the consumer under a bundler's dedupe. Our lockfile pins current versions for
development; consumers pick their own. Note that this means `lodash` 4.17.x, which
carries the `_.template` advisory, is still permitted - hosts should raise their own
floor to 4.18.

### Build output

| Path | Contents |
|---|---|
| `lib/` | Compiled ES modules and type declarations - the package entry point, and what consumers import. |
| `dist/` | The compiled stylesheet. |

Neither directory is committed. `prepack` runs `clean` then `build`, so `npm publish` and `npm pack` always ship a fresh build from the current source.

### Releasing

Publishing happens from the command line, not from CI. Use `npm version` rather than editing the version by hand, so the release is tagged in git:

```bash
npm version 3.0.0-rc2      # bumps package.json, commits, creates tag v3.0.0-rc2
npm publish --tag rc       # prepack rebuilds from scratch first
git push origin main --follow-tags
```

Drop `--tag rc` for a stable release so it takes the `latest` dist-tag.

Pass the version explicitly. `npm version prerelease` turns `3.0.0-rc1` into
`3.0.0-rc1.0`, not `3.0.0-rc2`, because this project writes the prerelease as a single
`rc1` identifier rather than `rc.1`.

### Bundler-only

This package must be consumed through a bundler; `require()` and Node's ESM loader
cannot load it. `lib/` is ESM, but the compiled templates are imported extensionless
(`import form from './form.ejs'`, resolving to `form.ejs.js`) and are themselves
CommonJS, so resolution depends on a bundler appending `.js`. That is why there is no
`"type": "module"` field - adding one would break the templates.

Making the package Node-loadable means emitting explicit `./form.ejs.js` specifiers and
generating the templates as ESM. Nothing needs it today: the only consumer is Vite.

## License

Apache-2.0
