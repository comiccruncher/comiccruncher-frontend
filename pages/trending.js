import React from 'react';
import Head from 'next/head';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Error from './_error';
import Layout from '../components/Layout/Layout';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { MainContent } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { getTrendingProps } from './_utils';

const Trending = (props) => {
  const { meta, data } = props;
  return (
    <React.Fragment>
      {meta && meta.error ? (
        <Error status_code={meta.status_code} />
      ) : (
        <Layout>
          <Head>
            <title>Marvel Comics | Popular Characters | Comic Cruncher</title>
          </Head>
          <MainHeader>
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
                  <h1>Trending Characters</h1>
                </Title.Large>
                <Title.Byline>Currently popular characters from Marvel and DC</Title.Byline>
              </Box>
            </Flex>
          </MainHeader>
          <MainContent>
            <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
              <Box width={[1]}>
                <Section.Title>
                  <h2>Trending Marvel Characters</h2>
                </Section.Title>
                <Text.Default>
                  This page shows trending Marvel characters by <strong>main</strong> appearances only (no alternate
                  realities)!
                </Text.Default>
              </Box>
            </Flex>
            {data && <CharactersList characters={props} referer="/trending" />}
          </MainContent>
        </Layout>
      )}
    </React.Fragment>
  );
};

Trending.getInitialProps = async ({ req, res }) => {
  return await getTrendingProps(req, res);
};

Trending.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: PropTypes.arrayOf(RankedCharacterProps),
};

export default Trending;
