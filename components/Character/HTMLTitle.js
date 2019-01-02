import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const HTMLTitle = ({ name, other_name }) => (
  <Head>
    <title>
      {name} {other_name && `(${other_name})`} | Comic Cruncher
    </title>
  </Head>
);

HTMLTitle.propTypes = {
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
};

export default HTMLTitle;
