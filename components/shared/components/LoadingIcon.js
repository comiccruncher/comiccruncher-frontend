import React from 'react';
import { css } from 'react-emotion';

const linesSvg = 'static/assets/loading.svg';

const loadingCSS = css({
  height: '110px',
  width: '110px',
  background: `url(${linesSvg}) no-repeat center`,
});

export const LoadingIcon = (props) => (
  <React.Fragment>
    <div css={loadingCSS} />
  </React.Fragment>
);
