import React from 'react';
import styled from 'react-emotion';
import { UI } from '../shared/styles/colors';
import Responsive from '../shared/styles/responsive';
import Spacing from '../shared/styles/spacing';
import Lines from '../shared/components/Lines';

const HeaderSection = styled('div')((props) => ({
  overflow: 'hidden',
  position: 'relative',
  background: props.background || UI.Background.RedGradient,
  minHeight: '420px',
  textAlign: props.textAlign || 'center',
  padding: Spacing.xxxLarge,
  [Responsive.Mobile]: {
    padding: Spacing.Large,
  },
}));

const GenericHeader = styled('div')((props) => ({
  background: props.background,
  position: 'relative',
  overflow: 'hidden',
  padding: props.padding || 0,
  textAlign: props.textAlign || 'center',
}));

// A generic fluid header with options to customize the CSS.
export const Header = (props) => (
  <React.Fragment>
    <GenericHeader {...props}>
      <header>{props.children}</header>
    </GenericHeader>
  </React.Fragment>
);

// The main header for the frontpage.
export const MainHeader = (props) => (
  <React.Fragment>
    <HeaderSection background={props.background} textAlign={props.textAlign}>
      <header>{props.children}</header>
    </HeaderSection>
  </React.Fragment>
);
