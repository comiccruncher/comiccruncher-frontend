import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import getConfig from 'next/config';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Error from './_error';
import Layout from '../components/Layout/Layout';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { MainContent } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';

const marvelURL = getConfig().publicRuntimeConfig.API.publishersURL + '/marvel';

const Marvel = ({ characters, error, url = '/marvel' }) => (
  <React.Fragment>
    {error ? (
      <Error status_code={error.status_code} url={url} />
    ) : (
      <Layout canonical={url}>
        <Head>
          <title>Marvel Comics | Popular Characters | Comic Cruncher</title>
        </Head>
        <MainHeader background={Brands.Marvel}>
          <Flex
            flexWrap="wrap"
            alignItems="center"
            alignContent="center"
            justifyContent="center"
            flexDirection="column"
            style={{ height: '420px' }}
          >
            <Box alignSelf="center" p={3}>
              <Title.Large>
                <h1>Marvel Comics</h1>
              </Title.Large>
            </Box>
          </Flex>
        </MainHeader>
        <MainContent>
          <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
            <Box width={[1]}>
              <Section.Title>
                <h1>Popular Marvel Characters</h1>
              </Section.Title>
              <Text.Default>
                <p>
                  This page shows most popular Marvel characters by <strong>main</strong> appearances only (no alternate
                  realities)!
                </p>
              </Text.Default>
            </Box>
          </Flex>
          {characters && <CharactersList characters={characters} referer={url} />}
        </MainContent>
      </Layout>
    )}
  </React.Fragment>
);

Marvel.getInitialProps = async ({ req }) => {
  const res = await axios.get(`${marvelURL}?key=batmansmellsbadly`).catch((error) => {
    const statusCode = error && error.response ? error.response.status : 500;
    return { error: { status_code: statusCode } };
  });
  return {
    error: res.hasOwnProperty('error') ? res.error : null,
    characters: res.hasOwnProperty('data') ? res.data : [],
  };
};

Marvel.propTypes = {
  url: PropTypes.string.isRequired,
  error: PropTypes.shape({
    status_code: PropTypes.number.isRequired,
  }),
  characters: PropTypes.shape({
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Marvel);
