import React from 'react';
import { UI } from '../shared/styles/colors';

// A generic fluid header with options to customize the CSS.
export const Header = (props) => (
  <React.Fragment>
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
      <header style={{ padding: '10px 10px 50px 10px' }}>{props.children}</header>
    </div>
  </React.Fragment>
);
