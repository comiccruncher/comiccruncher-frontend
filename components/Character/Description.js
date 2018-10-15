import React from 'react';
import PropTypes from 'prop-types';

export const Description = (props) => (
  <div>
    <p>{props.text}</p>
  </div>
);

Description.propTypes = {
  text: PropTypes.string,
};
