import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Responsive from '../styles/responsive';
import Type, { UIFontStack, BangersFontStack } from '../styles/type';

const Logo = styled('div')(
  {
    color: UI.Text.Yellow,
    fontFamily: BangersFontStack,
    fontSize: Type.Size.Large,
    letterSpacing: 6,
    fontWeight: Type.Weight.Normal,
    marginTop: Spacing.Large,
    marginBottom: Spacing.Large,
    textShadow: `${Type.TextOutline}`,
    transform: 'rotate(-3deg)',
    position: 'relative',
    zIndex: '1',
    '&::before': {
      position: 'absolute',
      color: UI.Text.Blue,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      letterSpacing: 'inherit',
      fontWeight: 'inherit',
      marginBottom: Spacing.Large,
      textShadow: `${Type.TextOutline}`,
      top: '3px',
      left: '-4px',
      zIndex: '-1',
    },
    [Responsive.Mobile]: {
      fontSize: '60px',
    },
  },
  (props) => props.content && {
    '&::before': {
      content: `'${props.content}'`
    }
  }
);

export default Logo;
