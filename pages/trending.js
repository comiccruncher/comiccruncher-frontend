import React, { Fragment } from 'react';
import Head from 'next/head';
import { Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Error from './_error';
import Layout from '../components/Layout/Layout';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { WithFooter, MainPageFlex, CenterWrap } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { getTrendingProps } from './_utils';

const Trending = (props) => {
  const { meta, data } = props;
  return (
    <Fragment>
      {meta && meta.error ? (
        <Error status_code={meta.status_code} />
      ) : (
        <Layout>
          <Head>
            <title>Marvel Comics | Popular Characters | Comic Cruncher</title>
          </Head>
          <MainHeader>
            <CenterWrap>
              <Title.Large>
                <h1>Trending Characters</h1>
              </Title.Large>
              <Title.Byline>Currently popular characters from Marvel and DC</Title.Byline>
            </CenterWrap>
          </MainHeader>
          <WithFooter>
            <MainPageFlex>
              <Box width={[1]}>
                <Section.Title>
                  <h2>Trending Marvel Characters</h2>
                </Section.Title>
                <Text.Default>
                  This page shows trending Marvel characters by <strong>main</strong> appearances only (no alternate
                  realities)!
                </Text.Default>
              </Box>
            </MainPageFlex>
            {data && <CharactersList characters={props} referer="/trending" />}
          </WithFooter>
        </Layout>
      )}
    </Fragment>
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
