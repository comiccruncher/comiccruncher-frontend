import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class ScrollToTop extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  componentDidMount() {
    if (window.innerWidth <= 767) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

/* eslint-disable react/display-name */
export const withScrollToTop = (Component) => ({ ...props }) => (
  <ScrollToTop>
    <Component {...props} />
  </ScrollToTop>
);
