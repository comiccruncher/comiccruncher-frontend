import React from 'react';
import request from 'superagent';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Layout from '../components/Layout/Layout';
import Logo from '../components/shared/components/Logo';
import Search from '../components/Search/Search';
import HeaderSection from '../components/shared/components/HeaderSection';
import Head from 'next/head';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import Footer from '../components/Layout/Footer';

class Marvel extends React.Component {
  render() {
    return (
      <Layout>
        <Head>
          <title>Marvel Characters - Comic Cruncher</title>
        </Head>
        <HeaderSection>
          <Flex justifyContent="center" alignItems="center" alignContent="center" style={{ height: '100%' }}>
            <Box alignSelf="center">
              <Logo content="Marvel">Marvel</Logo>
              <Search />
            </Box>
          </Flex>
        </HeaderSection>
        {/* TODO: Fix modal for marvel and dc route. */}
        <CharactersList characters={this.props.characters} referer="/publishers/marvel" />
        <Footer />
      </Layout>
    );
  }
}

Marvel.getInitialProps = async ({ req }) => {
  const res2 = await request.get('https://api.comiccruncher.com/publishers/marvel?key=batmansmellsbadly');
  return {
    characters: res2.body,
  };
};

Marvel.propTypes = {
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Marvel);
