import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Error from './_error';
import Layout from '../components/Layout/Layout';
import { FullCharacterProps } from '../components/Character/Types';
import FullCharacter from '../components/Character/FullCharacter';
import { getCharacterProps } from './_utils';
import { withCache } from '../components/emotion/cache';

const Character = ({ meta, data }) => (
  <React.Fragment>
    {meta.error ? (
      <Error status_code={meta.status_code} />
    ) : (
      <Layout canonical={`/characters/${data.slug}`}>
        <FullCharacter character={data} showFooterText={true} />
      </Layout>
    )}
  </React.Fragment>
);

Character.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: FullCharacterProps,
};

Character.getInitialProps = async ({ req, res }) => {
  return getCharacterProps(req, res);
};

export default withRouter(Character);
