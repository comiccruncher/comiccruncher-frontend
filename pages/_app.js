import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import getConfig from 'next/config';
import ReactGA from 'react-ga';
import Cookies from 'universal-cookie';
import TopBarProgress from 'react-topbar-progress-indicator';
import { Palette } from '../components/shared/styles/colors';

TopBarProgress.config({
  barColors: {
    '0': `#f7c443`,
    '0.5': `${Palette.Yellow.Default}`,
    '1.0': `#fef150`,
  },
  shadowBlur: 2,
  barThickness: 5,
});

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.initialTrack = this.initialTrack.bind(this);
  }

  componentDidMount() {
    window.addEventListener('load', this.initialTrack);
    window.onpopstate = (e) => {
      // set loading bar to false if using back button.
      this.setState({ isLoading: false });
    };
    Router.events.on('routeChangeStart', () => {
      if (this.state.isLoading) {
        this.setState({ isLoading: false });
      }
      this.setState({ isLoading: true });
    });
    Router.events.on('routeChangeComplete', (url) => {
      // Track for client-side router events.
      ReactGA.pageview(url);
      this.setState({ isLoading: false });
    });
    Router.events.on('routeChangeError', () => this.setState({ isLoading: false }));
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.initialTrack);
    Router.events.off('routeChangeComplete');
    Router.events.off('routeChangeStart');
    Router.events.off('routeChangeError');
  }

  initialTrack() {
    const { gaID, isProd } = getConfig().publicRuntimeConfig;
    ReactGA.initialize(gaID, {
      debug: !isProd,
      titleCase: false,
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    if (!isProd) {
      ReactGA.set({ sendHitTask: null });
    }
    const cookies = new Cookies();
    const visitorId = cookies.get('cc_visitor_id');
    if (visitorId) {
      ReactGA.set({ userId: visitorId });
      ReactGA.event({ category: 'cookie', action: 'hit userId', label: visitorId });
    } else {
      ReactGA.event({ category: 'cookie', action: 'miss userId' });
    }
    // track initial server-side render pageview.
    ReactGA.pageview(Router.asPath);
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        {this.state.isLoading && <TopBarProgress />}
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;
