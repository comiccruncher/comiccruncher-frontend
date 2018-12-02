import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';
import { withCache } from '../components/emotion/cache';
import { Text } from '../components/shared/styles/type';

class Character extends React.Component {
  render() {
    const c = this.props.character ? this.props.character.data : null;
    return (
      <Layout
        title={
          this.props.error
            ? `${this.props.error} | Comic Cruncher`
            : `${c.name} ${c.other_name && `(${c.other_name})`} | Comic Cruncher`
        }
        canonical={`/characters/${c.slug}`}
      >
        {!this.props.error ? (
          <FullCharacter {...c} />
        ) : (
          <Text.Default>
            <p>{this.props.error}</p>
          </Text.Default>
        )}
      </Layout>
    );
  }
}

Character.propTypes = {
  error: FullCharacterProps.string,
  character: {
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: FullCharacterProps,
  },
};

Character.getInitialProps = async ({ req }) => {
  const res = await axios
    .get(`https://api.comiccruncher.com/characters/${encodeURIComponent(req.params.slug)}?key=batmansmellsbadly`)
    .catch((error) => {
      return { error: error.toString() };
    });
  return {
    error: res.hasOwnProperty('error') ? res.error : null,
    character: res.hasOwnProperty('data') ? res.data : null,
  };
};

export default Character;
