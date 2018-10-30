import React from 'react';
import Link from 'next/link';
import styled, { css } from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import Spacing from '../shared/styles/spacing';
import { UI } from '../shared/styles/colors';
import Type, { UIFontStack, Weight } from '../shared/styles/type';

const Halftone = '/static/assets/Halftone.png';

const FooterContainer = styled('div')({
  textAlign: 'center',
  padding: Spacing.xLarge,
  'ul': {
    listStyle: 'none',
  },
  'li': {
    display: 'inline-block',
  },
  'a': {
    color: UI.Text.Dark,
    fontFamily: UIFontStack,
    fontWeight: Weight.Medium,
    padding: Spacing.Small,
    transition: 'all .3s ease-in-out',
    '&:hover': {
      color: UI.Text.Light,
    }
  }
});

class Footer extends React.Component {
  render() {
    return (
      <div>
        <FooterContainer>
          <ul>
            <li>
              <Link href={`/`}>Comic Cruncher</Link>
            </li>
            <li>
              <Link href={`https://twitter.com/aimeelaplant`}>@aimeelaplant</Link>
            </li>
            <li>
              <Link href={`https://twitter.com/ghanbak`}>@ghanbak</Link>
            </li>
          </ul>
        </FooterContainer>
      </div>
    )
  }
};

export default Footer;
