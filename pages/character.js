import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';
import { Text } from '../components/shared/styles/type';
import { withCache } from '../components/emotion/cache';

const charactersURL = getConfig().publicRuntimeConfig.API.charactersURL;

class Character extends React.Component {
  render() {
    const c = this.props.character ? this.props.character.data : null;
    const error = this.props.error;
    return (
      <Layout
        title={
          error ? `${error} | Comic Cruncher` : `${c.name} ${c.other_name && `(${c.other_name})`} | Comic Cruncher`
        }
        canonical={`/characters/${c.slug}`}
      >
        {!error ? (
          <FullCharacter character={c} showFooterText={true} />
        ) : (
          <Text.Default>
            <p>{error}</p>
          </Text.Default>
        )}
      </Layout>
    );
  }
}

Character.propTypes = {
  error: PropTypes.string,
  character: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: FullCharacterProps,
  }),
};

Character.getInitialProps = async ({ req }) => {
  const params = { params: { key: 'batmansmellsbadly' } };
  const res = await axios.get(`${charactersURL}/${encodeURIComponent(req.params.slug)}`, params).catch((error) => {
    return { error: error.toString() };
  });
  return {
    error: res.hasOwnProperty('error') ? res.error : null,
    character: res.hasOwnProperty('data') ? res.data : null,
  };
};

export default Character;
