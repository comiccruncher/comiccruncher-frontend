import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import getConfig from 'next/config';
import ReactGA from 'react-ga';
//import Cookies from 'universal-cookie';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.initialTrack = this.initialTrack.bind(this);
  }

  componentDidMount() {
    window.addEventListener('load', this.initialTrack);
    Router.events.on('routeChangeComplete', (url) => {
      // Track for client-side router events.
      ReactGA.pageview(url);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.initialTrack);
    Router.events.off('routeChangeComplete');
  }

  initialTrack() {
    //const cookies = new Cookies();
    const { gaID, isProd } = getConfig().publicRuntimeConfig;
    ReactGA.initialize(gaID, {
      debug: !isProd,
      titleCase: false,
    });
    if (!isProd) {
      ReactGA.set({ sendHitTask: null });
    }
    /*
    const visitorId = cookies.get('cc_visitor_id');
    if (visitorId) {
      ReactGA.set({ userId: visitorId });
      ReactGA.event({ category: 'cookie', action: 'hit userId', label: visitorId });
    } else {
      ReactGA.event({ category: 'cookie', action: 'miss userId' });
    }
    */
    // track initial server-side render pageview.
    ReactGA.pageview(Router.asPath);
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
