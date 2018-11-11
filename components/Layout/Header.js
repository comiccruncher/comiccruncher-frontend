import React from 'react';
import Link from 'next/link';
import Logo from '../shared/components/Logo';
import { ContentBlock } from './Content';
import Lines from '../shared/components/Lines';
import { UI } from '../shared/styles/colors';

// A generic fluid header with options to customize the CSS.
export const Header = (props) => (
  <div css={props.css}>
    <header>
      <ContentBlock>
        <Link href="/">
          <Logo content="Comic Cruncher">
            <h1>
              <a>Comic Cruncher</a>
            </h1>
          </Logo>
        </Link>
      </ContentBlock>
      {props.children}
    </header>
  </div>
);

// The main header for the frontpage.
export const MainHeader = (props) => (
  <div
    css={
      props.css || {
        background: UI.Background.RedGradient,
        position: 'relative',
        minHeight: '500px',
        overflow: 'hidden',
      }
    }
  >
    <Lines />
    <header>
      <ContentBlock>
        <Link href="/">
          <Logo content="Comic Cruncher">
            <h1>
              <a>Comic Cruncher</a>
            </h1>
          </Logo>
        </Link>
      </ContentBlock>
      {props.children}
    </header>
  </div>
);
