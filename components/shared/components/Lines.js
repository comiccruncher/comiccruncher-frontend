import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';

const linesSvg = 'https://flash.comiccruncher.com/static/assets/movement-lines.svg';

const bl = (bottom = -58, left = 15) =>
  css({
    position: 'absolute',
    bottom: `${bottom}px`,
    left: `${left}px`,
    background: `url(${linesSvg}) no-repeat`,
    height: '196px',
    width: '44px',
    transform: 'rotate(-118deg)',
    opacity: '.3',
    'z-index': 9999,
  });

const br = (bottom = -59, right = 31) =>
  css({
    position: 'absolute',
    bottom: `${bottom}px`,
    right: `${right}px`,
    background: `url(${linesSvg}) no-repeat`,
    height: '196px',
    width: '44px',
    '-ms-transform': 'rotate(-50deg)',
    '-webkit-transform': 'rotate(-50deg)',
    transform: 'rotate(108deg)',
    opacity: '.3',
    'z-index': 9999,
  });

const tl = (top = -38, left = 35) =>
  css({
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    background: `url(${linesSvg}) no-repeat`,
    height: '196px',
    width: '44px',
    '-ms-transform': 'rotate(-50deg)',
    '-webkit-transform': 'rotate(-50deg)',
    transform: 'rotate(-50deg)',
    opacity: '.3',
    'z-index': 9999,
  });

const tr = (top = -30, right = 50) =>
  css({
    position: 'absolute',
    top: `${top}px`,
    right: `${right}px`,
    background: `url(${linesSvg}) no-repeat`,
    height: '196px',
    width: '44px',
    '-ms-transform': 'rotate(50deg)',
    '-webkit-transform': 'rotate(50deg)',
    transform: 'rotate(50deg)',
    opacity: '.3',
    'z-index': 9999,
  });

const Lines = (props) => (
  <React.Fragment>
    <div css={props.tr ? tr(...props.tr) : tr()} />
    <div css={props.tl ? tl(...props.tl) : tl()} />
    <div css={props.bl ? bl(...props.bl) : bl()} />
    <div css={props.br ? br(...props.br) : br()} />
  </React.Fragment>
);

Lines.propTypes = {
  tr: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
  }),
  tl: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  br: PropTypes.shape({
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  bl: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
};

export default Lines;
