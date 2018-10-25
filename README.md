# Comic Cruncher Web

Comic Cruncher Web is a NodeJS + React app that serves the frontend for [comiccruncher.com](https://comiccruncher.com). (Check out the Golang backend application at [github.com/aimeelaplant/comiccruncher](https://github.com/aimeelaplant/comiccruncher)).

This repository uses the next.js framework to server-side render the pages.

The `components` folder houses all the React components, and the `pages` folder houses all the HTTP frontend.

Check the `server.js` file to see how the `pages` get server-side rendered.

## Getting Started

#### `yarn install`

Install all the dependencies to get started.

#### `yarn dev`

Starts the dev server with hot module replacement.

#### `yarn start`
Starts the production build.

Creates a new build, optimized for production. Does **not** start a dev server or anything else.

## CSS

To use the grid system `rebass` with emotion, import the module like this: `import { Flex, Box } from 'rebass/emotion'`

## Storybook
[📚 Storybook](https://storybook.js.org/)

Storybook helps us build our visual components and reference them later.
To get started run
```
npm i -g @storybook/cli
```

Once you've installed the cli tool, run storybook.
```
npm run storybook
```
Storybook is available at `localhost:9001`.

I've successfully tested Storybook and it integrates seamlessly and without any issues into this setup. If you want to add Storybook to your project, install the most recent version (which by the time of writing is `4.0.0-alpha.16` and can be done via `npm i -g @storybook/cli@4.0.0-alpha.16`) and run `getstorybook` to have the basic setup created for you. You must then replace all the content in `.storybook/webpack.config.js` with the following line:

```js
module.exports = require('../config/webpack.config.js/storybook');
```

## Styling
We're using the most millennial styling library for react.
**[Emotion](https://emotion.sh/)**

Make sure to add `import styled, { css } from 'react-emotion'` at the top of each component or view file.
