import styled from 'react-emotion';
import { UI } from '../styles/colors';
import Spacing from '../styles/spacing';
import Responsive from '../styles/responsive';
import Type, { BangersFontStack } from '../styles/type';

const Logo = styled('a')(
  {
    color: UI.Text.Dark,
    fontFamily: BangersFontStack,
    fontSize: Type.Size.Large,
    letterSpacing: 3,
    fontWeight: Type.Weight.Normal,
    marginTop: Spacing.Large,
    marginBottom: Spacing.Large,
    //textShadow: `${Type.TextOutline}`,
    transform: 'rotate(-3deg)',
    position: 'relative',
    zIndex: '1',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    '&::before': {
      position: 'absolute',
      color: UI.Text.Blue,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      letterSpacing: 'inherit',
      fontWeight: 'inherit',
      marginBottom: Spacing.Large,
      //textShadow: `${Type.TextOutline}`,
      top: '3px',
      left: '-4px',
      zIndex: '-1',
    },
  },
  (props) =>
    props.content && {
      '&::before': {
        content: `'${props.content}'`,
      },
    }
);

export default Logo;
