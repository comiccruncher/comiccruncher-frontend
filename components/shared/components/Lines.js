import React from 'react';
import { css } from 'react-emotion';

const linesSvg = 'https://flash.comiccruncher.com/static/assets/movement-lines.svg';

const bl = css({
  position: 'absolute',
  bottom: '-58px',
  left: '15px',
  background: `url(${linesSvg}) no-repeat`,
  height: '196px',
  width: '44px',
  transform: 'rotate(-118deg)',
  opacity: '.3',
});

const br = css({
  position: 'absolute',
  bottom: '-59px',
  right: '31px',
  background: `url(${linesSvg}) no-repeat`,
  height: '196px',
  width: '44px',
  '-ms-transform': 'rotate(-50deg)',
  '-webkit-transform': 'rotate(-50deg)',
  transform: 'rotate(108deg)',
  opacity: '.3',
});

const tl = css({
  position: 'absolute',
  top: '-38px',
  left: '35px',
  background: `url(${linesSvg}) no-repeat`,
  height: '196px',
  width: '44px',
  '-ms-transform': 'rotate(-50deg)',
  '-webkit-transform': 'rotate(-50deg)',
  transform: 'rotate(-50deg)',
  opacity: '.3',
});

const tr = css({
  position: 'absolute',
  top: '-30px',
  right: '50px',
  background: `url(${linesSvg}) no-repeat`,
  height: '196px',
  width: '44px',
  '-ms-transform': 'rotate(50deg)',
  '-webkit-transform': 'rotate(50deg)',
  transform: 'rotate(50deg)',
  opacity: '.3',
});

const Lines = (props) => (
  <React.Fragment>
    <div css={tr} />
    <div css={tl} />
    <div css={bl} />
    <div css={br} />
  </React.Fragment>
);

export default Lines;
