import React from 'react';
import request from 'superagent';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import Layout from '../components/Layout/Layout';
import Logo from '../components/shared/components/Logo';
import StatBlock from '../components/shared/components/StatBlock';
import Search from '../components/Search/Search';
import HeaderSection from '../components/shared/components/HeaderSection';
import Head from 'next/head';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import Footer from '../components/Layout/Footer';
import { Title, Text } from '../components/shared/styles/type';
import { UI } from '../components/shared/styles/colors';
import Spacing from '../components/shared/styles/spacing';

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
        <HeaderSection>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            alignContent="center"
            flexWrap="wrap"
            mb={Spacing.Small}
            pt={Spacing.xxLarge * 2}
            pb={Spacing.Large}
            px={Spacing.xxLarge}>
              <Box
                width={[1, 1 / 2, 1 / 3, 1 / 4]}
                className={StatBlock}
                style={{ transform: 'rotate(6deg)' }}
              >
                <Title.Red><CountUp end={s.total_characters} /></Title.Red>
                <Text.Default bold>characters</Text.Default>
              </Box>
              <Box
                width={[1, 1 / 2, 1 / 3, 1 / 4]}
                className={StatBlock}
                style={{ transform: 'rotate(-4deg)' }}
              >
                <Title.Red><CountUp end={s.total_appearances} /></Title.Red>
                <Text.Default bold>appearances</Text.Default>
              </Box>
              <Box
                width={[1, 1 / 2, 1 / 3, 1 / 4]}
                className={StatBlock}
                style={{ transform: 'rotate(3deg)' }}
              >
                <Title.Red><CountUp end={s.total_issues} /></Title.Red>
                <Text.Default bold>issues</Text.Default>
              </Box>
              <Box
                width={[1, 1 / 2, 1 / 3, 1 / 4]}
                className={StatBlock}
                style={{ transform: 'rotate(-6deg)' }}
              >
                <Text.Default bold>dating from</Text.Default>
                <Title.Red><CountUp end={s.min_year} /></Title.Red>
              </Box>
          </Flex>
          <Flex justifyContent="center" alignItems="center" alignContent="center">
            <Box alignSelf="center" style={{ width: '80%' }}>
              <Search />
            </Box>
          </Flex>
        </HeaderSection>
        <CharactersList characters={this.props.characters} referer="/" />
        <Footer />
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
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Home);
