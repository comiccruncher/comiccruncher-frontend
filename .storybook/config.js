import { configure } from '@storybook/react';
import './storybook.css';

// automatically include any files ending in *.stories.js
const req = require.context('../src/stories', true, /.(js|css)$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
