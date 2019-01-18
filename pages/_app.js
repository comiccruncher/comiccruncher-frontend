import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import getConfig from 'next/config';
import Cookies from 'universal-cookie';
import ReactGA from 'react-ga';

/*
This is a cool effect, but Safari and mobile are having trouble w/ it. :(
Fix later.
import NProgress from 'nprogress';
import Router from 'next/router';
Router.events.on('routeChangeStart', (url) => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
*/

const { gaID, isProd } = getConfig().publicRuntimeConfig;

const initialTrack = () => {
  return new Promise((res, rej) => {
    const cookies = new Cookies();
    ReactGA.initialize(gaID, {
      debug: !isProd,
      titleCase: false,
    });
    if (!isProd) {
      ReactGA.set({ sendHitTask: null });
    }
    const visitorId = cookies.get('cc_visitor_id');
    if (visitorId) {
      ReactGA.set({ userId: visitorId });
      ReactGA.event({ category: 'cookie', action: 'hit userId', label: visitorId });
    } else {
      ReactGA.event({ category: 'cookie', action: 'miss userId' });
    }
    res(visitorId);
  });
};

// Track browser router changes.
if (typeof window !== 'undefined') {
  Router.events.on('routeChangeComplete', (url) => {
    ReactGA.pageview(url);
  });
}

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      initialTrack().then(() => {
        // Track initial page view.
        ReactGA.pageview(Router.asPath);
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
