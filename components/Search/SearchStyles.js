import React from 'react';
import styled, {css} from 'react-emotion';
import PropTypes from 'prop-types';
import { UI, Brands } from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';
import Type, { UIFontStack, BangersFontStack, Size } from '../shared/styles/type';
import Dimensions from '../shared/styles/dimensions';

export const SearchBar = css({
  border: '2px solid ' + UI.Border.Dark,
  backgroundColor: UI.Background.White,
  boxShadow: `-4px 4px 0 ${UI.Text.Dark}`,
  padding: Spacing.Small,
  margin: '-40px auto',
  width: '100%',
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: 1.5,
  fontSize: Size.Default
});
