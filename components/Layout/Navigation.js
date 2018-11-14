import React from 'react';
import styled from 'react-emotion';
import Link from 'next/link';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Size, { UIFontStack, Weight } from '../shared/styles/type';
import Logo from '../shared/components/Logo';
import { ContentBlock } from './Content';

const MainNav = styled('nav')({
  marginTop: '30px',
  marginLeft: '30px',
  position: 'relative',
  '> ul': {
    'list-style-type': 'none',
    ' > li': {
      display: 'inline-block',
      'margin-right': '30px',
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

const Navigation = (props) => (
  <div style={{ background: props.background || '#fff ' }}>
    <ContentBlock>
      <Flex flexWrap="wrap">
        <Box width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]} pl={20}>
          <Link href={'/'}>
            <Logo>Comic Cruncher</Logo>
          </Link>
        </Box>
        <Box width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}>
          <MainNav>
            <ul>
              <li>
                <Link href={'/trending'}>
                  <NavLink>Trending</NavLink>
                </Link>
              </li>
              <li>
                <Link href={'/marvel'}>
                  <NavLink>Marvel</NavLink>
                </Link>
              </li>
              <li>
                <Link href={'/dc'}>
                  <NavLink>DC</NavLink>
                </Link>
              </li>
              <li>
                <Link href={'/faq'}>
                  <NavLink>FAQ</NavLink>
                </Link>
              </li>
            </ul>
          </MainNav>
        </Box>
      </Flex>
    </ContentBlock>
  </div>
);

export default Navigation;
