import React from 'react';
import PropTypes from 'prop-types';

export default class Toggle extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  };

  show = () => {
    this.setState({
      isOpen: true
    });
  };

  hide = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    return this.props.children({
      isOpen: this.state.isOpen,
      toggle: this.toggle,
      show: this.show,
      hide: this.hide
    });
  }
}

export const withToggle = Component => props => (
  <Toggle>
    {toggleDelegate => (
      <Component
        {...props}
        toggleDelegate={toggleDelegate}
      />
    )}
  </Toggle>
);

export const TogglePropTypes = PropTypes.shape({
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  show: PropTypes.func,
  hide: PropTypes.func
});
