import React from 'react';
import styled from 'react-emotion';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Size, { UIFontStack, Weight } from '../shared/styles/type';
import Spacing from '../shared/styles/spacing';
import Logo from '../shared/components/Logo';
import Responsive from '../shared/styles/responsive';
import Search from '../Search/Search';
import { withCache } from '../emotion/cache';

const MainNav = styled('nav')({
  marginLeft: '10px',
  position: 'relative',
  '> ul': {
    'list-style-type': 'none',
    ' > li': {
      display: 'inline-block',
      marginRight: '30px',
    },
  },
  [Responsive.Mobile]: {
    padding: '0 ' + Spacing.Small,
    '> ul': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      '> li': {
        marginRight: 0,
        flex: '1 0 auto',
        textAlign: 'center',
        padding: Spacing.Small,
      },
    },
  },
});

const NavLink = styled.a((props) => ({
  fontFamily: UIFontStack,
  color: UI.Text.Dark,
  fontSize: Size.Default,
  fontWeight: Weight.Bold,
  cursor: 'pointer',
  display: 'block',
  '&:hover': {
    color: UI.Text.Light,
    textDecoration: 'underline',
  },
}));

const Container = styled.div((props) => ({
  padding: '0 20px',
  background: props.background || '#fff',
}));

const LogoContainer = styled.div({
  [Responsive.Mobile]: {
    textAlign: 'center',
  },
});

const Navigation = (props) => (
  <Container background={props.background}>
    <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" alignContent="center">
      <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]}>
        <LogoContainer>
          <Link href={'/'} prefetch>
            <Logo>Comic Cruncher</Logo>
          </Link>
        </LogoContainer>
      </Box>
      <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}>
        <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" alignContent="center">
          <Box width={[1, 1 / 3, 1 / 2]}>
            <MainNav>
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
            </MainNav>
          </Box>
          <Box width={[1, 2 / 3, 1 / 2]}>
            <Search id="navsearch" />
          </Box>
        </Flex>
      </Box>
    </Flex>
  </Container>
);

export default Navigation;
