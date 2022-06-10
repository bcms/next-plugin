# BCMS Next Plugin

This is a NextJS plugin for the BCMS.

[![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/next-plugin-bcms.svg
[npm-url]: https://npmjs.org/package/next-plugin-bcms

## Getting started

Best way would be to create a new project using [BCMS CLI](https://github.com/becomesco/cms-cli) by running `bcms --website create`, but if you want to add the plugin to an existing project, you will need to follow next steps.

- Install the plugin and its dependencies by running: `npm i -D nuxt-plugin-bcms @becomes/cms-cli @becomes/cms-client @becomes/cms-most`,
- Next step is to create the BCMS configuration by making a file called `bcms.config.js` in the root of the project.

> bcms.config.js

```js
const { createBcmsMostConfig } = require('@becomes/cms-most');

module.exports = createBcmsMostConfig({
  cms: {
    origin:
      process.env.BCMS_API_ORIGIN ||
      'https://becomes-starter-projects.yourbcms.com',
    key: {
      id: process.env.BCMS_API_KEY || '629dcd4dbcf5017354af6fe8',
      secret:
        process.env.BCMS_API_SECRET ||
        '7a3c5899f211c2d988770f7561330ed8b0a4b2b5481acc2855bb720729367896',
    },
  },
  media: {
    output: 'public',
    download: false,
  },
  enableClientCache: true,
});
```

- After that we can configure BCMS images handler (this is optional). Open `pages/_app.tsx` and add configuration for API origin and public API key.

> `pages/_app.tsx`

```tsx
// ... Other imports

import { BCMSImageConfig } from 'next-plugin-bcms/components';

BCMSImageConfig.cmsOrigin =
  process.env.NEXT_PUBLIC_BCMS_API_ORIGIN ||
  'https://becomes-starter-projects.yourbcms.com';
BCMSImageConfig.publicApiKeyId =
  process.env.NEXT_PUBLIC_BCMS_API_PUBLIC_KEY_ID || '629dcd4dbcf5017354af6fe8';

// ... Other configuration
```

- Next step is to create instance of the Next plugin at server runtime by calling `createBcmsNextPlugin` inside of the `next.config.js`.

> `next.config.js`

```js
// ... Other imports

const { createBcmsNextPlugin } = require('next-plugin-bcms/main');
createBcmsNextPlugin();

// ... Other configuration
```

- Finally, we will call [BCMS Most](https://github.com/becomesc/cms-most) functions in every script before Next execution.

> `package.json`

```json
"scripts": {
  "dev": "bcms --m all && next dev",
  "build": "bcms --m all && next build",
  "start": "bcms --m all && next start",
  "lint": "next lint"
},
```

- Optionally you can add cache paths to your `.gitignore`.

> `.gitignore`

```text
# BCMS
/bcms
/public/bcms-media
/public/api/bcms-images
```

## Getting the BCMS data

There are 2 main ways in which you can get data in Next page. First is by using [BCMS Client methods](https://github.com/becomesco/cms-client) with `getBcmsClient()` function and the other is by using [BCMS Most](https://github.com/becomesco/cms-most) with `getBcmsMost()` function.

## Getting data using BCMS Client

This approach is very simple and easy to understand. For example, if in the BCMS we have an entry with slug _home_, located in _pages_ template, we can get data for this entry like shown in the code snippet bellow:

```tsx
import type { GetServerSideProps } from 'next';
import { getBcmsClient } from 'next-plugin-bcms';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = getBcmsClient();

  const entry = await client.entry.get({
    template: 'pages',
    entry: 'home',
  });

  return { props: { entry } };
};

// ... Page component
```

You can also enable client caching in `bcms.config.js` to speed up responses.

> bcms.config.js

```js
module.exports = createBcmsMostConfig({
  // ...
  enableClientCache: true,
});
```

## Getting data using BCMS Most

This approach is a little bit more difficult but it will use local copy of the BCMS data provided by the BCMS Most. This means that there is no added latency for fetching data because all required data is already in memory. Example from previous section would look like this:

```tsx
import type { GetServerSideProps } from 'next';
import { getBcmsMost } from 'next-plugin-bcms';

export const getServerSideProps: GetServerSideProps = async () => {
  const most = getBcmsMost();

  const entry = await most.content.entry.find(
    'pages',
    async (pagesItem) => pagesItem.meta.en.slug === 'home',
  );

  return { props: { entry } };
};

// ... Page component
```

## Development

- Install dependencies: `npm i`,
- Bundle the code: `npm run bundle`,
- Link dist: `cd dist && npm i && npm link && cd ..`,
- To update dist code, run: `npm run build:ts`,
