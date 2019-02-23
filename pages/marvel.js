import React, { Fragment } from 'react';
import Head from 'next/head';
import { Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Error from './_error';
import Layout from '../components/Layout/Layout';
import ListFilter from '../components/Character/CharacterListFilter';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { WithFooter, MainPageFlex, CenterWrap } from '../components/Layout/Content';
import { Title, Section, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';
import { getMarvelProps } from './_utils';

const Marvel = (props) => {
  const { meta, data } = props;
  return (
    <Fragment>
      {meta && meta.error ? (
        <Error status_code={meta.status_code} />
      ) : (
        <Layout
          canonical="/marvel"
          description="Ranked and trending appearances per year for Marvel comic book characters 💥"
          image="https://flash.comiccruncher.com/static/assets/marvel-preview-fb.jpg"
          socialTitle="Marvel Comics | Trending Character Appearances | Comic Cruncher"
        >
          <Head>
            <title>Marvel Comics | Popular Characters | Comic Cruncher</title>
          </Head>
          <MainHeader background={Brands.Marvel}>
            <CenterWrap>
              <Title.Large>
                <h1>Marvel Comics</h1>
              </Title.Large>
            </CenterWrap>
          </MainHeader>
          <WithFooter>
            <MainPageFlex>
              <Box width={[1]}>
                <Section.Title>
                  <h1>Marvel Characters Ranked By Appearances</h1>
                </Section.Title>
                <Text.Default>
                  This page shows Marvel characters ranked by number of <strong>main</strong> reality appearances (no
                  alternate realities).
                </Text.Default>
              </Box>
            </MainPageFlex>
            {data && <ListFilter publisher="marvel" characters={props} />}
          </WithFooter>
        </Layout>
      )}
    </Fragment>
  );
};

Marvel.getInitialProps = async ({ req, res }) => {
  return await getMarvelProps(req, res);
};

Marvel.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: PropTypes.arrayOf(RankedCharacterProps),
};

export default Marvel;
