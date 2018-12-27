import React from 'react';
import { css } from 'react-emotion';
import Footer from './Footer';
import Responsive from '../shared/styles/responsive';
import { withCache } from '../emotion/cache';

const Halftone = 'https://flash.comiccruncher.com/static/assets/Halftone.png';

const HalftoneBG = css({
  minHeight: '300px',
  background: `url(${Halftone}) no-repeat`,
  'background-color': '#fff',
  'background-size': 'contain',
  'background-position-x': 'center',
  'background-position-y': 'calc(100% + 400px)',
  [Responsive.TabletAndBelow]: {
    'background-size': 'initial',
    'background-position-y': 'calc(100% + 600px)',
    'background-position-x': 'center',
  },
});

// A content block for <main> content with a <footer> at the end.
export const MainContent = (props) =>
  withCache(
    <div css={props.style || HalftoneBG}>
      {props.children}
      <Footer {...props} />
    </div>
  );
