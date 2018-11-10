import React from 'react';
import styled from 'react-emotion';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Spacing from '../shared/styles/spacing';
import Responsive from '../shared/styles/responsive';
import Type, { UIFontStack, BangersFontStack } from '../shared/styles/type';
import { constants } from 'zlib';
import Logo from '../shared/components/Logo';

const MainNav = styled(Flex)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 999,
  [Responsive.Mobile]: {
    position: 'fixed',
  },
});

const Navigation = (props) => (
  <MainNav
    justifyContent="space-around"
    alignItems="center"
    alignContent="center">
    <Box>
      <Link href="/">
        <Logo content="Comic Cruncher" style={{ cursor: 'pointer' }}>Comic Cruncher</Logo>
      </Link>
    </Box>
  </MainNav>
);

export default Navigation;
