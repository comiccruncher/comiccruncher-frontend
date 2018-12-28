import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import getConfig from 'next/config';
import { injectGlobal } from 'emotion';
import ReactGA from 'react-ga';
import Responsive from '../shared/styles/responsive';
import { UI, Palette } from '../shared/styles/colors';
import { UIFontStack } from '../shared/styles/type';
import Spacing from '../shared/styles/spacing';
import Navigation from './Navigation';
import { withCache } from '../emotion/cache';

const { cdnURL, gaID, isProd } = getConfig().publicRuntimeConfig;

ReactGA.initialize(gaID, {
  debug: !isProd,
  titleCase: false,
});
if (!isProd) {
  ReactGA.set({ sendHitTask: null });
}
if (!isProd) {
  ReactGA.set({ sendHitTask: null });
}

injectGlobal`
  * {
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: inherit;
    font-size: inherit;
  }

  .app {
    width: 100%;
    max-width: 1152px;
    margin: 0 auto ${Spacing.xLarge}px;
    border-top: 4px solid ${UI.Background.Dark};
    border-bottom: 4px solid ${UI.Background.Dark};
    border-right: 4px solid ${UI.Background.Dark};
    border-left: 3px solid ${UI.Background.Dark};
    box-shadow: 15px 10px ${UI.Background.Dark};
  }

  .react-autosuggest__container {
    position: relative;
    font-family: ${UIFontStack};
    font-weight: 300;
    font-size: 14px;
  }

  .react-autosuggest__input {
    width: 240px;
    height: 30px;
    padding: 10px 20px;
    border: 1px solid ${UI.Border.Dark};
    border-radius: 0;
  }

  .react-autosuggest__input:focus {
    outline: none;
  }

  .react-autosuggest__container--open .react-autosuggest__input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__container--open .react-autosuggest__suggestions-container {
    display: block;
    position: absolute;
    width: 100%;
    border: 2px solid ${UI.Border.Dark};
    border-radius: 0;
    background-color: ${UI.Background.White};
    z-index: 15;
    top: 100%;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 16px;
  }

  .react-autosuggest__suggestion:not(:first-child) {
    border-top: 1px solid ${UI.Border.Light};
  }

  .react-autosuggest__suggestion--highlighted {
    background: ${UI.Background.PaleGray};
    outline: normal;
  }

  .react-autosuggest__suggestion--focused {
    background-color: ${UI.Background.PaleGray};
    color: ${UI.Text.White};
  }

  .suggestion-content {
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
  }

  .suggestion-content p {
    font-size: 14px;
    line-height: 1.4;
  }

  .name {
    margin-left: 0;
    line-height: 45px;
  }

  .highlight {
    color: #ee0000;
    font-weight: bold;
  }

  .react-autosuggest__suggestion--focused .highlight {
    color: #120000;
  }

  .Modal {
    position:relative;
    height: auto;
    border:0;
    outline:0;
    margin: 0 auto;
    width:100%;
    max-width: 1152px;
    border: 4px solid #000;
    box-shadow: 10px 10px #1f1f1f;
    margin: 0 auto;
  }

  .Overlay {
    -webkit-overflow-scrolling: touch;
    position: fixed;
    background: rgba(0,0,0,.6);
    bottom: 0;
    left: 0;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 100;
    padding: ${Spacing.Small}px;
  }

  ${Responsive.Mobile} {
    .Overlay {
      padding: 0;
    }
  }

  @keyframes blowUpModal {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes blowUpModalTwo {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  .ReactModal__Body--open {
    overflow: hidden!important;
    width: 100%;
  }

  .ReactModal__Overlay {
    background: rgba(0,0,0,.7);
  }

  .ReactModal__Content--after-open{
    animation: blowUpModal 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    opacity: 1;

  }
  .ReactModal__Content--before-close{
    opacity: 0;
  }

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: ${Palette.Yellow.Default};
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}

/* Fancy blur effect */
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px ${Palette.Yellow.Default}, 0 0 5px ${Palette.Yellow.Default};
  opacity: 1.0;
  -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
          transform: rotate(3deg) translate(0px, -4px);
}

/* Remove these to get rid of the spinner */
#nprogress .spinner {
  display: block;
  position: fixed;
  z-index: 1031;
  top: 15px;
  right: 15px;
}

#nprogress .spinner-icon {
  width: 18px;
  height: 18px;
  box-sizing: border-box;

  border: solid 2px transparent;
  border-top-color: ${Palette.Yellow.Default};
  border-left-color: ${Palette.Yellow.Default};
  border-radius: 50%;

  -webkit-animation: nprogress-spinner 400ms linear infinite;
          animation: nprogress-spinner 400ms linear infinite;
}

.nprogress-custom-parent {
  overflow: hidden;
  position: relative;
}

.nprogress-custom-parent #nprogress .spinner,
.nprogress-custom-parent #nprogress .bar {
  position: absolute;
}

@-webkit-keyframes nprogress-spinner {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes nprogress-spinner {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

`;

const Layout = ({ canonical, children, title, navBackground }) => (
  <React.Fragment>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet" />
      <link href="https://rsms.me/inter/inter-ui.css" rel="stylesheet" />
      <link rel="apple-touch-icon-precomposed" sizes="57x57" href={`${cdnURL}/apple-touch-icon-57x57.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="114x114" href={`${cdnURL}/apple-touch-icon-114x114.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href={`${cdnURL}/apple-touch-icon-72x72.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href={`${cdnURL}/apple-touch-icon-144x144.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="60x60" href={`${cdnURL}/apple-touch-icon-60x60.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="120x120" href={`${cdnURL}/apple-touch-icon-120x120.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="76x76" href={`${cdnURL}/apple-touch-icon-76x76.png`} />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href={`${cdnURL}/apple-touch-icon-152x152.png`} />
      <link rel="icon" type="image/png" href={`${cdnURL}/favicon-196x196.png`} sizes="196x196" />
      <link rel="icon" type="image/png" href={`${cdnURL}/favicon-96x96.png`} sizes="96x96" />
      <link rel="icon" type="image/png" href={`${cdnURL}/favicon-32x32.png`} sizes="32x32" />
      <link rel="icon" type="image/png" href={`${cdnURL}/favicon-16x16.png`} sizes="16x16" />
      <link rel="icon" type="image/png" href={`${cdnURL}/favicon-128.png`} sizes="128x128" />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-TileImage" content={`${cdnURL}/mstile-144x144.png`} />
      <meta name="msapplication-square70x70logo" content={`${cdnURL}/mstile-70x70.png`} />
      <meta name="msapplication-square150x150logo" content={`${cdnURL}/mstile-150x150.png`} />
      <meta name="msapplication-wide310x150logo" content={`${cdnURL}/mstile-310x150.png`} />
      <meta name="msapplication-square310x310logo" content={`${cdnURL}/mstile-310x310.png`} />
      <link rel="canonical" href={canonical} />
      <title>{title}</title>
    </Head>
    <div className="app">
      <Navigation background={navBackground} activeHref={canonical} />
      {children}
    </div>
  </React.Fragment>
);

Layout.propTypes = {
  canonical: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  navBackground: PropTypes.string,
  children: PropTypes.node,
};

export default Layout;
