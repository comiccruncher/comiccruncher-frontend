import React from 'react';
import Head from 'next/head';
import Header from './Header';
import { injectGlobal } from 'emotion';
import Spacing from '../shared/styles/spacing';
import { UI } from '../shared/styles/colors';

injectGlobal`
  * { margin:0; padding:0; box-sizing:border-box; }
  html { background-color: ${UI.Background.Gray}; }
  body { max-width: 1024px; margin: 0 auto; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.08); background-color: ${UI.Background.White};}
`;

const Layout = (props) => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://fonts.googleapis.com/css?family=Bangers"
        rel="stylesheet"
      />
      <link href="https://rsms.me/inter/inter-ui.css" rel="stylesheet" />
    </Head>
    <Header />
    {props.children}
  </div>
);

export default Layout;
