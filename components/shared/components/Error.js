import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { Text } from '../styles/type';
import { TrackErrorWithEvent } from '../../ga/Tracker';

class ErrorDisplayTracker extends React.Component {
  static propTypes = {
    status_code: PropTypes.number,
    error: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { router, status_code, error } = this.props;
    TrackErrorWithEvent(status_code, router.pathname, error);
  }

  render() {
    return (
      <Text.Default>
        <p>{this.props.error}</p>
      </Text.Default>
    );
  }
}

export default withRouter(ErrorDisplayTracker);
