import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Error from './_error';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';
import { getCharacterProps } from './_utils';

const Character = ({ meta, data }) => (
  <Fragment>
    {meta && meta.error ? (
      <Error status_code={meta.status_code} />
    ) : (
      <Layout
        canonical={`/characters/${data.slug}`}
        description={`Visualize appearances per year for ${data.name} 💥`}
        socialTitle={`${data.name} | Comic Cruncher`}
        image={data.image || data.vendor_image}
      >
        <FullCharacter character={data} showFooterText={true} />
      </Layout>
    )}
  </Fragment>
);

Character.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: FullCharacterProps,
};

Character.getInitialProps = async ({ req, res, query }) => {
  return getCharacterProps(req, res, query);
};

export default Character;
