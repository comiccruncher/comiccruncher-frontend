import styled from 'react-emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Type, { UIFontStack } from '../styles/type';

const Button = styled.button(
  {
    border: 'none',
    userSelect: 'none',
    borderRadius: Dimensions.BorderRadius.Default,
    fontSize: Type.Size.Default,
    fontFamily: UIFontStack,
    fontWeight: Type.Weight.Normal,
    backgroundColor: UI.Background.Dark,
    color: UI.Text.White,
    paddingTop: Spacing.Tiny,
    paddingBottom: Spacing.Tiny,
    paddingLeft: Spacing.Large,
    paddingRight: Spacing.Large,
    cursor: 'pointer',
    transition: 'all .3s ease-in-out',
    outline: 0,
  },
  (props) =>
    props.type === 'primary' && {
      backgroundColor: UI.Background.Blue,
      '&:hover': {
        backgroundColor: UI.Background.BlueHover,
      },
    },
  (props) =>
    props.type === 'dark' && {
      backgroundColor: UI.Background.Dark,
      '&:hover': {
        backgroundColor: UI.Background.DefaultGray,
      },
    },
  (props) =>
    props.disabled && {
      backgroundColor: UI.Background.LightGray,
      color: UI.Text.Default,
      '&:hover': {
        opacity: '0.8',
        backgroundColor: UI.Background.LightGray,
      },
    },
  (props) =>
    props.isInactive && {
      backgroundColor: UI.Background.LightGray,
      color: UI.Text.Dark,
      '&:hover': {
        opacity: '0.8',
        backgroundColor: UI.Background.LightGray,
      },
    },
);

export default Button;
