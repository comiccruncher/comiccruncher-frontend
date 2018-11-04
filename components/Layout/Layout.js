import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import { injectGlobal } from 'emotion';
import { UI } from '../shared/styles/colors';

const Halftone = '/static/assets/Halftone.png';

injectGlobal`
  * {
    margin:0;
    padding:0;
    box-sizing:border-box;
  }
  html {
    background-color: ${UI.Background.Gray};
  }
  body {
    max-width: 1024px;
    margin: 0 auto;
    position: relative;
    box-shadow: 0 0 10px rgba(0,0,0,0.08);
    background-color: ${UI.Background.White};
    background-image: url('${Halftone}');
    background-repeat: no-repeat;
    background-size: contain;
    background-position-x: center;
    background-position-y: calc(100% + 400px);

    @media (max-width: 767px) {
      padding-bottom: 60px;
      background-size: 180%;
      background-position-y: calc(100% + 140px);
    }
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
    top: 32px;
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border:0;
    outline:0;
    padding: 50px;
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
  }
`;

const Layout = (props) => (
  <React.Fragment>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet" />
      <link href="https://rsms.me/inter/inter-ui.css" rel="stylesheet" />
    </Head>
    <Navigation />
    {props.children}
  </React.Fragment>
);

export default Layout;
