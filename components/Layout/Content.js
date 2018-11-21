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

// A generic content block with flex and box.
export const ContentBlock = (props) =>
  withCache(
    <Flex bg={props.bg || 'transparent'} p={0}>
      <Box
        pr={props.pr !== null ? props.pr : 10}
        pl={props.pl !== null ? props.pl : 10}
        pt={props.pt !== null ? props.pt : 10}
        pb={props.bt !== null ? props.bt : 10}
        m={props.margin || 'auto'}
      >
        {props.children}
      </Box>
    </Flex>
  );

// A content block for <main> content with a <footer> at the end.
export const MainContent = (props) =>
  withCache(
    <div css={props.style || bgCSS}>
      {props.children}
      <Footer />
    </div>
  );
