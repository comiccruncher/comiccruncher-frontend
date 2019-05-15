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

## Styling
We're using the most millennial styling library for react.
**[Emotion](https://emotion.sh/)**

Make sure to add `import styled, { css } from 'react-emotion'` at the top of each component or view file.

## Deployment

The production application is deployed to GCP's App Engine via a CircleCI configuration. 
