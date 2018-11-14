import React from 'react';
import styled from 'react-emotion';
import { UI } from '../shared/styles/colors';
import Responsive from '../shared/styles/responsive';
import Spacing from '../shared/styles/spacing';

const HeaderSection = styled('div')({
  background: UI.Background.RedGradient,
  minHeight: '420px',
  textAlign: 'center',
  padding: Spacing.xxLarge,
  [Responsive.Mobile]: {
    padding: Spacing.Large,
  },
});

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
    <HeaderSection>
      <header>{props.children}</header>
    </HeaderSection>
  </React.Fragment>
);
