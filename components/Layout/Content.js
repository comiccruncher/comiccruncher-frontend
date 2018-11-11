import React from 'react';
import { Flex, Box } from 'rebass/emotion';
import { css } from 'react-emotion';
import Footer from './Footer';

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
export const ContentBlock = (props) => (
  <Flex>
    <Box width={props.width || 1152} p={props.padding || 3} m={props.margin || 'auto'}>
      {props.children}
    </Box>
  </Flex>
);

// A content block for <main> content with a <footer> at the end.
export const MainContent = (props) => (
  <div css={props.css || bgCSS}>
    <ContentBlock>
      <main>{props.children}</main>
    </ContentBlock>
    <ContentBlock>
      <Footer />
    </ContentBlock>
  </div>
);
