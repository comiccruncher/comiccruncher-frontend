import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'next/router';
import Error from './_error';
import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';
import { withCache } from '../components/emotion/cache';

const charactersURL = getConfig().publicRuntimeConfig.API.charactersURL;

const Character = ({ character, error, url }) => (
  <React.Fragment>
    {error ? (
      <Error status_code={error.status_code} url={url} />
    ) : (
      <Layout canonical={url}>
        <FullCharacter character={character.data} showFooterText={true} />
      </Layout>
    )}
  </React.Fragment>
);

Character.propTypes = {
  error: PropTypes.shape({
    status_code: PropTypes.number.isRequired,
  }),
  character: PropTypes.shape({
    data: FullCharacterProps,
  }),
  url: PropTypes.string.isRequired,
};

Character.getInitialProps = async ({ req }) => {
  const key = { params: { key: 'batmansmellsbadly' } };
  const slug = encodeURIComponent(req.params.slug);
  const url = `/characters/${slug}`;
  const res = await axios.get(`${charactersURL}/${slug}`, key).catch((error) => {
    const statusCode = error && error.response ? error.response.status : 500;
    return { error: { status_code: statusCode }, url: url };
  });
  return {
    error: res.hasOwnProperty('error') ? res.error : null,
    character: res.hasOwnProperty('data') ? res.data : null,
    url: url,
  };
};

export default withRouter(Character);
