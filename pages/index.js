import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import getConfig from 'next/config';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import Error from './_error';
import { Title, Section, Text } from '../components/shared/styles/type';
import Spacing from '../components/shared/styles/spacing';
import PropTypes from 'prop-types';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { Stats } from '../components/Stats/Stats';
import { MainHeader } from '../components/Layout/Header';
import { MainContent } from '../components/Layout/Content';
import Layout from '../components/Layout/Layout';
import { withCache } from '../components/emotion/cache';

const { charactersURL, statsURL } = getConfig().publicRuntimeConfig.API;

const Home = ({ characters, stats, error, url = '/' }) => (
  <React.Fragment>
    {error ? (
      <Error status_code={error.status_code} url={url} />
    ) : (
      <Layout canonical={url}>
        <Head>
          <title>Home | All-Time Popular Characters | Comic Cruncher</title>
        </Head>
        <MainHeader>
          <Flex flexWrap="wrap" alignItems="center" alignContent="center" justifyContent="center">
            <Box
              alignSelf="center"
              style={{ width: '100%', height: '100%', paddingBottom: Spacing.xxLarge, paddingTop: Spacing.xxLarge }}
            >
              <Title.Large>Comic Book Appearances</Title.Large>
              <Title.Byline>See popular character appearances</Title.Byline>
              {stats && <Stats {...stats.data} />}
            </Box>
          </Flex>
        </MainHeader>
        <MainContent>
          <Flex flexWrap={'wrap'} m={'30px auto'} pl={3}>
            <Box width={[1]}>
              <Section.Title>
                <h1>Popular Characters</h1>
              </Section.Title>
            </Box>
          </Flex>
          {characters && <CharactersList characters={characters} referer="/" />}
        </MainContent>
      </Layout>
    )}
  </React.Fragment>
);

Home.getInitialProps = async ({ req }) => {
  const params = { params: { key: 'batmansmellsbadly' } };
  const res = await Promise.all([axios.get(statsURL, params), axios.get(charactersURL, params)])
    .then(
      axios.spread((stats, characters) => {
        return [stats ? stats.data : [], characters ? characters.data : []];
      })
    )
    .catch((error) => {
      const statusCode = error && error.response ? error.response.status : 500;
      return { error: { status_code: statusCode } };
    });
  return {
    stats: res ? res[0] : {},
    characters: res ? res[1] : {},
  };
};

Home.propTypes = {
  error: PropTypes.shape({
    status_code: PropTypes.number.isRequired,
  }),
  url: PropTypes.string.isRequired,
  stats: PropTypes.shape({
    data: PropTypes.shape({
      total_characters: PropTypes.number,
      total_appearances: PropTypes.number,
      min_year: PropTypes.number,
      max_year: PropTypes.number,
      total_issues: PropTypes.number,
    }),
  }),
  characters: PropTypes.shape({
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Home);
