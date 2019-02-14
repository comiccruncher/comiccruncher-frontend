import React from 'react';
import { css } from 'react-emotion';
import { UI } from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';
import { UIFontStack, Size } from '../shared/styles/type';

export const SearchBar = css({
  border: '2px solid ' + UI.Border.Dark,
  backgroundColor: UI.Background.White,
  boxShadow: `-4px 4px 0 ${UI.Text.Dark}`,
  padding: Spacing.Small,
  margin: '0 auto',
  width: '100%',
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: 1.5,
  fontSize: Size.Default,
});
