import React from 'react';
import styled from 'react-emotion';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Size, { UIFontStack, Weight } from '../styles/type';
import Spacing from '../styles/spacing';
import Responsive from '../styles/responsive';

const Nav = styled('nav')({
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 100,
  backgroundColor: UI.Background.White,
  paddingTop: Spacing.Tiny,
  paddingBottom: Spacing.Tiny,
  minWidth: Spacing.xxLarge * 4,
  '> ul': {
    'list-style-type': 'none',
    ' > li': {
      display: 'block',
    },
  },
  [Responsive.Mobile]: {
    width: '100%',
    margin: '0 auto',
  },
});

const NavLink = styled.a((props) => ({
  fontFamily: UIFontStack,
  color: UI.Text.Dark,
  fontSize: Size.Default,
  fontWeight: Weight.Bold,
  cursor: 'pointer',
  display: 'block',
  textAlign: 'center',
  paddingTop: Spacing.Tiny,
  paddingBottom: Spacing.Tiny,
  paddingLeft: Spacing.Small,
  paddingRight: Spacing.Small,
  '&:hover': {
    textDecoration: 'underline',
    backgroundColor: UI.Background.Gray,
  },
}));

const MainNav = (props) => (
  <Nav {...props}>
    <ul>
      <li>
        <Link href={'/trending'} prefetch>
          <NavLink>Trending</NavLink>
        </Link>
      </li>
      <li>
        <Link href={'/marvel'} prefetch>
          <NavLink>Marvel</NavLink>
        </Link>
      </li>
      <li>
        <Link href={'/dc'} prefetch>
          <NavLink>DC</NavLink>
        </Link>
      </li>
      <li>
        <Link href={'/faq'} prefetch>
          <NavLink>FAQ</NavLink>
        </Link>
      </li>
    </ul>
  </Nav>
);

export default MainNav
