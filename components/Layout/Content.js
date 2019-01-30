import React from 'react';
import styled from 'react-emotion';
import { Flex, Box } from 'rebass/emotion';
import Footer from './Footer';
import Responsive from '../shared/styles/responsive';
import { withCache } from '../emotion/cache';

const Halftone = 'https://flash.comiccruncher.com/static/assets/Halftone.png';

const StyledBG = styled.div({
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

const StyledContent = styled(Flex)({
  minHeight: 300,
});

export const WithFooter = (props) => (
  <StyledBG>
    {props.children}
    <Footer {...props} />
  </StyledBG>
);

export const MainPageFlex = (props) => (
  <Flex flexWrap={'wrap'} m={'30px auto'} pl={3} pr={3}>
    {props.children}
  </Flex>
);

export const CenterWrap = (props) => (
  <StyledContent
    flexWrap="wrap"
    alignItems="center"
    alignContent="center"
    justifyContent="center"
    flexDirection="column"
  >
    <Box alignSelf="center" p={3}>
      {props.children}
    </Box>
  </StyledContent>
);
