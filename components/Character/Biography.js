import React from 'react';
import PropTypes from 'prop-types';
import { Section, Text } from '../shared/styles/type';

export const Biography = ({ title, description, vendor_description }) => {
  return (
    <React.Fragment>
      <Section.Title>
        <h3>{title}</h3>
      </Section.Title>
      <Text.Default>
        <p>{vendor_description || description}</p>
      </Text.Default>
    </React.Fragment>
  );
};

Biography.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  vendor_description: PropTypes.string,
};
