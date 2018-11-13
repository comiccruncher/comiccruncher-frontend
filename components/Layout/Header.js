import React from 'react';
import Link from 'next/link';
import { Flex, Box } from 'rebass/emotion';
import Logo from '../shared/components/Logo';
import { ContentBlock } from './Content';
import Lines from '../shared/components/Lines';
import { UI } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import styled from 'react-emotion';
import { NavLink } from '../shared/styles/type';

const Nav = styled('nav')({
  marginTop: '30px',
  marginLeft: '30px',
  position: 'relative',
  '> ul': {
    'list-style-type': 'none',
    ' > li': {
      display: 'inline-block',
      'margin-right': '30px',
      ' > a': {
        height: '50px',
        display: 'block',
        ':hover': {
          color: 'red',
        },
      },
    },
  },
});

const NavHeader = (props) => (
  <div style={{ background: props.background || '#fff ' }}>
    <ContentBlock>
      <Flex flexWrap="wrap">
        <Box width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]} pl={20}>
          <Logo> Comic Cruncher</Logo>
        </Box>
        <Box width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}>
          <Nav>
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
          </Nav>
        </Box>
      </Flex>
    </ContentBlock>
  </div>
);

// A generic fluid header with options to customize the CSS.
export const Header = (props) => (
  <React.Fragment>
    <NavHeader />
    <div style={{ background: `${props.bg}`, position: 'relative', overflow: 'hidden', padding: props.padding || 0 }}>
      <header style={{ padding: '0' }}>{props.children}</header>
    </div>
  </React.Fragment>
);

// The main header for the frontpage.
export const MainHeader = (props) => (
  <React.Fragment>
    <div
      css={
        props.style || {
          background: UI.Background.RedGradient,
          position: 'relative',
          minHeight: '500px',
          overflow: 'hidden',
        }
      }
    >
      <NavHeader background={'transparent'} />
      <header style={{ padding: '10px 10px 50px 10px' }}>
        {props.children}
      </header>
    </div>
  </React.Fragment>

);
