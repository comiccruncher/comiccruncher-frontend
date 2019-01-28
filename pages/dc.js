import React from 'react';
import Head from 'next/head';
import { Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Layout from '../components/Layout/Layout';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { MainPageFlex, CenterWrap, WithFooter } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';
import Error from './_error';
import { getDCProps } from './_utils';

const DC = (props) => {
  const { meta, data } = props;
  return (
    <React.Fragment>
      {meta && meta.error ? (
        <Error status_code={meta.status_code} />
      ) : (
        <Layout>
          <Head>
            <title>{`DC Comics | Popular Characters | Comic Cruncher`}</title>
          </Head>
          <MainHeader background={Brands.DC}>
            <CenterWrap>
              <Title.Large>
                <h1>DC Comics</h1>
              </Title.Large>
            </CenterWrap>
          </MainHeader>
          <WithFooter>
            <MainPageFlex>
              <Box width={[1]}>
                <Section.Title>
                  <h1>Popular DC Characters</h1>
                </Section.Title>
                <Text.Default>
                  This page shows most popular DC characters by <strong>main</strong> appearances only (no alternate
                  alternate realities)!
                </Text.Default>
              </Box>
            </MainPageFlex>
            {data && <CharactersList characters={props} referer="/dc" />}
          </WithFooter>
        </Layout>
      )}
    </React.Fragment>
  );
};

DC.getInitialProps = async ({ req, res }) => {
  return await getDCProps(req, res);
};

DC.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: PropTypes.arrayOf(RankedCharacterProps),
};

export default DC;
