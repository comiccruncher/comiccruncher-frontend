import React from 'react';
import PropTypes from 'prop-types';

export default class OuterClick extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onOuterClick: PropTypes.func.isRequired
  };

  rootRef = React.createRef();

  componentDidMount () {
    document.addEventListener('click', this.onClick, false);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onClick, false);
  }

  onClick = (event) => {
    // Race condition workaround for conditionally rendered components that may not exist in DOM anymore.
    if (!document.contains(event.target)) {
      return;
    }

    if (this.rootRef.current !== event.target && !this.rootRef.current.contains(event.target)) {
      this.props.onOuterClick();
    }
  };

  render () {
    const child = React.Children.only(this.props.children);

    if (React.isValidElement(child)) {
      return React.cloneElement(child, {ref: this.rootRef});
    }

    /* eslint-disable no-console */
    console.warn('Child to OuterClick must be a valid React element');
    /* eslint-enable no-console */

    return child;
  }
}

/* eslint-disable react/display-name */
export const withOuterClick = Component => ({onOuterClick, ...props}) => (
  <OuterClick onOuterClick={onOuterClick}>
    <div>
      <Component {...props} />
    </div>
  </OuterClick>
);
