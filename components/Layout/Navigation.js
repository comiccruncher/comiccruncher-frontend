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

const MainNav = styled(Flex)({
  position: 'absolute',
  top: Spacing.Small,
  left: Spacing.Small,
  backgroundColor: UI.Background.Yellow,
  borderWidth: 2,
  borderStyle: 'solid',
  zIndex: 999,
  [Responsive.Mobile]: {
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    left: 0,
    width: '100%',
  },
});

const LinkStyle = styled('a')({
  color: UI.Text.Dark,
  textDecoration: 'none',
  fontFamily: UIFontStack,
  fontWeight: Type.Weight.Bold,
  padding: Spacing.Small,
  display: 'inline-block',
  [Responsive.Mobile]: {
    paddingLeft: Spacing.Tiny,
    paddingRight: Spacing.Tiny,
  },
});

const Navigation = (props) => (
  <MainNav
    justifyContent="space-around"
    alignItems="center"
    alignContent="center">
    <Box>
      <Link href="/">
        <LinkStyle>Home</LinkStyle>
      </Link>
      <Link href="/trending">
        <LinkStyle>Trending</LinkStyle>
      </Link>
      <Link href="/publishers/marvel">
        <LinkStyle>Marvel</LinkStyle>
      </Link>
      <Link href="/publishers/dc">
        <LinkStyle>DC</LinkStyle>
      </Link>
    </Box>
  </MainNav>
);

export default Navigation;
