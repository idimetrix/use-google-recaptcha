# use-google-recaptcha
React Google Recaptcha V3

## Installation

To install the package, use npm:

```bash
pnpm add use-google-recaptcha

yarn install use-google-recaptcha

npm install use-google-recaptcha
```

## Usage

```typescript
import { useGoogleReCaptcha } from 'use-google-recaptcha';

const {
    execute,
    executing,
} = useGoogleReCaptcha({ 
    key: 'Google Recaptcha V3 key'
});

console.log('[Google Recaptcha V3]:Executing', executing ? `YES` : 'NO');

const token = await execute();

console.log('[Google Recaptcha V3]:Token', token);
```

## tsup
Bundle your TypeScript library with no config, powered by esbuild.

https://tsup.egoist.dev/

## How to use this
1. install dependencies
```
# pnpm
$ pnpm install

# yarn
$ yarn install

# npm
$ npm install
```
2. Add your code to `src`
3. Add export statement to `src/index.ts`
4. Test build command to build `src`.
Once the command works properly, you will see `dist` folder.

```zsh
# pnpm
$ pnpm run build

# yarn
$ yarn run build

# npm
$ npm run build
```
5. Publish your package

```zsh
$ npm publish
```


## test package
https://www.npmjs.com/package/use-google-recaptcha
