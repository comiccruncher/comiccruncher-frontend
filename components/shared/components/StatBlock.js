import { css } from 'react-emotion';
import Spacing from '../styles/spacing';

const Bang = 'https://flash.comiccruncher.com/static/assets/bang.svg';

const StatBlock = css({
  backgroundImage: `url(${Bang})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  textAlign: 'center',
  paddingTop: Spacing.xxLarge,
  paddingBottom: Spacing.xxLarge
});

export default StatBlock;
