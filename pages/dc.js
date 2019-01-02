import React from 'react';
import axios from 'axios';
import getConfig from 'next/config';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Layout from '../components/Layout/Layout';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { MainContent } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';
import Error from './_error';

const dcURL = getConfig().publicRuntimeConfig.API.publishersURL + '/dc';

const DC = ({ characters, error, url }) => (
  <React.Fragment>
    {error ? (
      <Error status_code={error.status_code} url={url} />
    ) : (
      <Layout canonical={url}>
        <Head>
          <title>{`DC Comics | Popular Characters | Comic Cruncher`}</title>
        </Head>
        <MainHeader background={Brands.DC}>
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
                <h1>DC Comics</h1>
              </Title.Large>
            </Box>
          </Flex>
        </MainHeader>
        <MainContent>
          <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
            <Box width={[1]}>
              <Section.Title>
                <h1>Popular DC Characters</h1>
              </Section.Title>
              <Text.Default>
                <p>
                  This page shows most popular DC characters by <strong>main</strong> appearances only (no alternate
                  alternate realities)!
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

DC.getInitialProps = async ({ req }) => {
  const url = `/dc`;
  const res = await axios.get(`${dcURL}?key=batmansmellsbadly`).catch((error) => {
    const statusCode = error && error.response ? error.response.status : 500;
    return { error: { status_code: statusCode }, url: url };
  });
  return {
    characters: res.hasOwnProperty('data') ? res.data : null,
    url: url,
  };
};

DC.propTypes = {
  error: PropTypes.shape({
    status_code: PropTypes.number.isRequired,
  }),
  characters: PropTypes.shape({
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
  url: PropTypes.string.isRequired,
};

export default withRouter(DC);
