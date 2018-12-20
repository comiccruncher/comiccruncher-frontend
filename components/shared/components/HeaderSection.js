import styled from 'react-emotion';
import { UI } from '../styles/colors';
import Spacing from '../styles/spacing';
import Responsive from '../styles/responsive';

const HeaderSection = styled('div')({
  background: UI.Background.DarkGradient,
  minHeight: '420px',
  textAlign: 'center',
  padding: Spacing.xxLarge,
  [Responsive.Mobile]: {
    padding: Spacing.Large,
  },
});

export default HeaderSection;
