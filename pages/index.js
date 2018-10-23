import React from 'react';
import { Box, Flex } from '@rebass/grid/emotion';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import Layout from '../components/Layout/Layout';
import Logo from '../components/shared/components/Logo';
import Search from '../components/Search/Search';
import HeaderSection from '../components/shared/components/HeaderSection';
import Head from 'next/head';
import CharactersList from '../components/Character/CharactersList';
import request from 'superagent';

class Home extends React.Component {
  render() {
    const s = this.props.data;
    return (
      <Layout>
        {/* How to render a title ...
          just import the head and use a title.
          You won't overwrite anything else set. */}
        <Head>
          <title>Comic Cruncher!!!</title>
        </Head>
        <HeaderSection>
          <Flex flexDirection="column" justifyContent="center" alignItems="center" alignContent="center" style={{ height: '100%' }}>
            <Box alignSelf="center">
              <Logo content="Comic Cruncher">Comic Cruncher</Logo>
              <Search />
            </Box>
          </Flex>
        </HeaderSection>
        <p>
          Total Characters: <CountUp end={s.total_characters} />
        </p>
        <p>
          Total Appearances: <CountUp end={s.total_appearances} />
        </p>
        <p>
          Total Issues: <CountUp end={s.total_issues} />
        </p>
        <p>
          From {s.min_year} to {s.max_year}
        </p>
        <CharactersList />
      </Layout>
    );
  }
}

Home.getInitialProps = async ({ req }) => {
  const res = await request.get('https://api.comiccruncher.com/stats?key=batmansmellsbadly');
  return res.body;
};

Home.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }),
  data: PropTypes.shape({
    total_characters: PropTypes.number,
    total_appearances: PropTypes.number,
    min_year: PropTypes.number,
    max_year: PropTypes.number,
    total_issues: PropTypes.number,
  }),
};

export default Home;
