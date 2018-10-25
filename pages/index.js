import React from 'react';
import request from 'superagent';
import { withRouter } from 'next/router';
import { Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import Layout from '../components/Layout/Layout';
import Logo from '../components/shared/components/Logo';
import Search from '../components/Search/Search';
import HeaderSection from '../components/shared/components/HeaderSection';
import Head from 'next/head';
import CharactersList from '../components/Character/CharactersList';
import { CharacterProps } from '../components/Character/Types';
import Header from '../components/Layout/Header';

class Home extends React.Component {
  render() {
    const s = this.props.stats.data;
    return (
      <Layout>
        {/* How to render a title ...
          just import the head and use a title.
          You won't overwrite anything else set. */}
        <Head>
          <title>Comic Cruncher!!!</title>
        </Head>
        <Header>
          <Box width={[1]}>
            <HeaderSection>
              <Logo content="Comic Cruncher">Comic Cruncher</Logo>
              <Search />
            </HeaderSection>
          </Box>
        </Header>
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
        <CharactersList characters={this.props.characters} />
      </Layout>
    );
  }
}

Home.getInitialProps = async ({ req }) => {
  const res = await request.get('https://api.comiccruncher.com/stats?key=batmansmellsbadly');
  const res2 = await request.get('https://api.comiccruncher.com/characters?key=batmansmellsbadly');
  return {
    stats: res.body,
    characters: res2.body,
  };
};

Home.propTypes = {
  stats: PropTypes.shape({
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
  }),
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.arrayOf(CharacterProps),
  }),
};

export default withRouter(Home);
