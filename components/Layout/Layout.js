import React from 'react';
import Head from 'next/head';
import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = (props) => (
  <div style={layoutStyle}>
    <Head>
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
