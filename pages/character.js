import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import Head from 'next/head';
import CountUp from 'react-countup';
import { Box, Flex } from '@rebass/grid/emotion';
import AppearanceChart from '../components/Character/AppearanceChart';
import Layout from '../components/Layout/Layout';
import { UI } from '../components/shared/styles/colors';
import Dimensions from '../components/shared/styles/dimensions';
import Type, { Title, Section, Text } from '../components/shared/styles/type';
import Button from '../components/shared/components/Button';

const aggregateCountMap = (aggregate) => aggregate.count;
const prevNextReduce = (prev, next) => prev + next;
const getDataSets = (appearances) => {
  return appearances.map((appearance) => {
    return {
      label: appearance.category,
      data: appearance.aggregates.map(aggregateCountMap),
      backgroundColor: appearance.category === 'main' ? 'rgb(54, 162, 235)' : 'rgb(255, 159, 64)',
    };
  });
};

class Character extends React.Component {
  state = {
    isEnabled: true,
    totalAppearanceCount: 0,
    years: [],
    datasets: [],
  };

  componentDidMount() {
    const appearances = this.props.data.appearances;
    const mainCounts = appearances[0] ? appearances[0].aggregates.map(aggregateCountMap).reduce(prevNextReduce) : 0;
    const altCounts = appearances[1] ? appearances[1].aggregates.map(aggregateCountMap).reduce(prevNextReduce) : 0;
    const years = appearances[0] ? [appearances[0].aggregates.map((aggregate) => aggregate.year)][0] : [];
    const datasets = getDataSets(appearances);
    this.setState({
      years: years,
      datasets: datasets,
      totalAppearanceCount: mainCounts + altCounts,
    });
  }

  onClick = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };

  render() {
    const c = this.props.data;
    const otherName = c.other_name ? `(${c.other_name})` : '';
    const title = `${c.name}`;
    const appearanceCount = this.state.totalAppearanceCount;
    // clean markup
    const regex = /(<([^>]+)>)/gi;
    const bio = c.vendor_description.replace(regex, '');
    return (
      <Layout>
        <Head>
          <title>{c.name}</title>
        </Head>
        <Flex flexWrap="wrap" style={{ height: '520px', overflow: 'hidden' }}>
          <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 1 / 3]}>
            <img src={c.vendor_image} style={{ minWidth: '100%', minHeight: '100%' }} />
          </Box>
          <Box
            flex="1 0 auto"
            width={[1, `${Dimensions.GoldenRatio.Large}`, 2 / 3]}
            p={32}
            style={{ backgroundColor: UI.Background.Red, textAlign: 'center' }}
          >
            <Flex justifyContent="center" alignItems="center" alignContent="center" style={{ height: '100%' }}>
              <Box alignSelf="center">
                <Title.Large>{title}</Title.Large>
                <Title.Byline>{otherName}</Title.Byline>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Flex flexWrap="wrap" py={40}>
          <Box flex="1 1 auto" width={[1, 1 / 2, 2 / 3]} px={10}>
            <Section.Title>Bio</Section.Title>
            <Text.Default>{bio}</Text.Default>
          </Box>
          <Box flex="1 1 auto" width={[1, 1 / 2, 1 / 3]} px={10}>
            <Text.Default>{this.state.isEnabled ? 'true' : 'false'}</Text.Default>
            <Button onClick={this.onClick} type="primary">
              Click Me and watch the above text change
            </Button>
          </Box>
        </Flex>
        <Flex flexWrap="wrap" py={40}>
          <Box flex="1 1 auto" width={1} px={10}>
            <Section.Title>Appearances</Section.Title>
            <Section.Byline>
              <CountUp end={appearanceCount} /> total
            </Section.Byline>

            <AppearanceChart title={'Appearances'} years={this.state.years} datasets={this.state.datasets} />
          </Box>
        </Flex>
      </Layout>
    );
  }
}

Character.propTypes = {
  meta: PropTypes.shape({
    status_code: PropTypes.number,
    error: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    publisher: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    other_name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string.isRequired,
    vendor_image: PropTypes.string,
    vendor_url: PropTypes.string,
    vendor_description: PropTypes.string,
    appearances: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        aggregates: PropTypes.arrayOf(
          PropTypes.shape({
            year: PropTypes.number.isRequired,
            count: PropTypes.number.isRequired,
          })
        ),
      })
    ),
  }).isRequired,
};

Character.getInitialProps = async ({ req }) => {
  const res = await request.get(
    `https://api.comiccruncher.com/characters/${encodeURIComponent(req.params.slug)}?key=batmansmellsbadly`
  );
  return res.body;
};

export default Character;
