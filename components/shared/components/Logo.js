import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../styles/type';

const Logo = styled('div')(
  {
    color: UI.Text.Yellow,
    fontFamily: BangersFontStack,
    fontSize: Type.Size.XXLarge,
    letterSpacing: 12,
    fontWeight: Type.Weight.Normal,
    marginBottom: Spacing.Large,
    textShadow: `${Type.TextOutline}`,
    transform: 'rotate(-3deg)',
    position: 'relative',
    zIndex: '1',
    '&::before': {
      position: 'absolute',
      color: UI.Text.Blue,
      fontFamily: BangersFontStack,
      fontSize: Type.Size.XXLarge,
      letterSpacing: 12,
      fontWeight: Type.Weight.Normal,
      marginBottom: Spacing.Large,
      textShadow: `${Type.TextOutline}`,
      top: '6px',
      left: '-7px',
      zIndex: '-1',
    },
  },
  (props) => props.content && {
    '&::before': {
      content: `'${props.content}'`
    }
  }
);

export default Logo;
