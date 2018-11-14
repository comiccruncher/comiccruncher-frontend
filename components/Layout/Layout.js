import React from 'react';
import Head from 'next/head';
import { injectGlobal } from 'emotion';
import { UI } from '../shared/styles/colors';
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import { withCache } from '../emotion/cache';

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
    margin: 0 auto;
    border-top: 4px solid #3e3d3d;
    border-bottom: 4px solid #3e3d3d;
    border-right: 4px solid #3e3d3d;
    border-left: 3px solid #3e3d3d;
    box-shadow: 15px 10px #3e3d3d;
  }

  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__input {
    width: 240px;
    height: 30px;
    padding: 10px 20px;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border: 1px solid #aaa;
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
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    z-index: 2;
    top: 100%;
    position: relative; /* Fix for suggestions being hidden whose parent div has overflow:hidden  */
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
    background: ${UI.Background.Gray};
    outline: normal;
  }

  .react-autosuggest__suggestion--focused {
    background-color: ${UI.Background.Gray};
    color: ${UI.Text.White};
  }

  .suggestion-content {
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
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
    max-width: 1024px;
    border: 4px solid #000;
    box-shadow: 10px 10px #1f1f1f;
    margin: 50px auto;
  }

  .Overlay {
    position: fixed;
    background: rgba(0,0,0,.7);
    bottom: 0;
    left: 0;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 100;
    padding: 30px;
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

  .ReactModal__Overlay {
    background: rgba(0,0,0,.7);
    transition: opacity 1ms ease-in-out;
    animation: blowUpModal 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }

  .ReactModal__Overlay--after-open{
    animation: blowUpModal 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    opacity: 1;

  }
  .ReactModal__Overlay--before-close{
    opacity: 0;
    animation: blowUpModalTwo 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; 
  }
`;

const Layout = (props) => (
  <React.Fragment>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet" />
      <link href="https://rsms.me/inter/inter-ui.css" rel="stylesheet" />
      <title>{props.title}</title>
    </Head>
    <div className="app">
      <Navigation background={props.navBackground} />
      {props.children}
    </div>
  </React.Fragment>
);

Layout.propTypes = {
  showNavigation: PropTypes.bool,
};

Layout.defaultProps = {
  showNavigation: true,
};

export default withCache(Layout);
