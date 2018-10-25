import React from 'react';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Spacing from '../shared/styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../shared/styles/type';
import { constants } from 'zlib';

const mainNav = {
  /*position: 'absolute',
  top: Spacing.Large,
  left: Spacing.Large,*/
  'margin-left': Spacing.Large,
  'margin-top': Spacing.Large,
};

const linkStyle = {
  color: UI.Text.Dark,
  textDecoration: 'none',
  fontFamily: UIFontStack,
  fontWeight: Type.Weight.Bold,
  padding: Spacing.Small,
  display: 'inline-block',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: UI.Border.Dark,
  backgroundColor: UI.Background.Yellow,
};

const Header = (props) => <Flex bg={props.bg || UI.Background.Red}>{props.children}</Flex>;

export default Header;
