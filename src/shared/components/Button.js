import styled from 'react-emotion';
import Colors from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Type, { UIFontStack, BangersFontStack } from '../styles/type';

const Button = styled.button(
  {
    border: 'none',
    userSelect: 'none',
    borderRadius: Dimensions.BorderRadius.Default,
    fontSize: Type.Size.Default,
    fontFamily: UIFontStack,
    fontWeight: Type.Weight.Medium,
    paddingTop: Spacing.Tiny,
    paddingBottom: Spacing.Tiny,
    paddingLeft: Spacing.Large,
    paddingRight: Spacing.Large,
    cursor: 'pointer',
    transition: 'all .3s ease-in-out'
  },
  (props) =>
    props.type === 'primary' && {
      backgroundColor: Colors.UI.Background.Blue,
      color: Colors.UI.Text.White,
      '&:hover': {
        backgroundColor: Colors.UI.Background.BlueHover
      }
    },
  (props) =>
    props.disabled && {
      opacity: '0.3',
      cursor: 'not-allowed'
    }
);

export default Button;
