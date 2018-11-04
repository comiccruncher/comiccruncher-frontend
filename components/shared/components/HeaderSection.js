import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../styles/type';

const HeaderSection = styled('div')({
  backgroundColor: UI.Background.Red,
  minHeight: '420px',
  textAlign: 'center',
  padding: Spacing.xxLarge,
});

export default HeaderSection;
