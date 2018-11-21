import React from 'react';
import { Flex, Box } from 'rebass/emotion';
import { css } from 'react-emotion';
import Footer from './Footer';
import { withCache } from '../emotion/cache';

const Halftone = 'https://flash.comiccruncher.com/static/assets/Halftone.png';

const bgCSS = css({
  minHeight: '300px',
  background: `url(${Halftone}) no-repeat`,
  'background-color': '#fff',
  'background-size': 'contain',
  'background-position-x': 'center',
  'background-position-y': 'calc(100% + 400px)',
  '@media (max-width: 1152px)': {
    'background-size': 'inherit !important',
  },
});

// A content block for <main> content with a <footer> at the end.
export const MainContent = (props) =>
  withCache(
    <div css={props.style || bgCSS}>
      {props.children}
      <Footer />
    </div>
  );
