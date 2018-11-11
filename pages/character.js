import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';

class Character extends React.Component {
  render() {
    const c = this.props.data;
    return (
      <Layout>
        <Head title={c}>
          <title>
            {c.name} {c.other_name && `(${c.other_name})`} | Comic Cruncher
          </title>
        </Head>
        <FullCharacter {...c} />
      </Layout>
    );
  }
}

Character.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }).isRequired,
  data: FullCharacterProps,
};

Character.getInitialProps = async ({ req }) => {
  const res = await request.get(
    `https://api.comiccruncher.com/characters/${encodeURIComponent(req.params.slug)}?key=batmansmellsbadly`
  );
  return res.body;
};

export default Character;
