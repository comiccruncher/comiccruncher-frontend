import React from 'react';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Spacing from '../shared/styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../shared/styles/type';
import { constants } from 'zlib';

const mainNav = {
  position: 'absolute',
  top: Spacing.Small,
  left: Spacing.Small,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: UI.Border.Dark,
};

const linkStyle = {
  color: UI.Text.Dark,
  textDecoration: 'none',
  fontFamily: UIFontStack,
  fontWeight: Type.Weight.Bold,
  padding: Spacing.Small,
  display: 'inline-block',
  backgroundColor: UI.Background.Yellow,
};

const Navigation = (props) => (
  <Flex>
    <Box width={[1 / 2, 1 / 2, 1 / 2]}>
      <div style={mainNav}>
        <Link href="/">
          <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
        <Link href="/trending">
          <a style={linkStyle}>Trending</a>
        </Link>
        <Link href="/publishers/marvel">
          <a style={linkStyle}>Marvel</a>
        </Link>
        <Link href="/publishers/dc">
          <a style={linkStyle}>DC</a>
        </Link>
      </div>
    </Box>
  </Flex>
);

export default Navigation;
