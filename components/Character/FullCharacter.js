import React from 'react';
import CountUp from 'react-countup';
import { Box, Flex } from '@rebass/grid/emotion';
import AppearanceChart from './AppearanceChart';
import { UI, Brands } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import { Title, Section, Text } from '../shared/styles/type';
import { FullCharacterProps } from './Types';

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

class FullCharacter extends React.Component {
  state = {
    isEnabled: true,
    totalAppearanceCount: 0,
    years: [],
    datasets: [],
  };

  componentDidMount() {
    const appearances = this.props.appearances;
    if (appearances) {
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
  }

  onClick = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };

  render() {
    const c = this.props;
    const otherName = c.other_name ? `${c.other_name}` : '';
    const title = `${c.name}`;
    const appearanceCount = this.state.totalAppearanceCount;
    // clean markup
    const regex = /(<([^>]+)>)/gi;
    const bio = c.vendor_description.replace(regex, '');
    return (
      <div>
        <Flex flexWrap="wrap" style={{ height: '520px', overflow: 'hidden' }}>
          <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 1 / 3]}>
            <img src={c.vendor_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box
            flex="1 0 auto"
            width={[1, `${Dimensions.GoldenRatio.Large}`, 2 / 3]}
            p={32}
            // Need to figure out how to access props properly
            style={{ backgroundColor: `${props => c.publisher.slug === 'dc' ? Brands.DC : Brands.Marvel}`, textAlign: 'center' }}
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
          <Box flex="1 1 auto" width={1} px={24}>
            <Section.Title>Appearances</Section.Title>
            <Section.Byline>
              <CountUp end={appearanceCount} /> total
              {/* TODO: change appearanceCount when someone clicks on main/alt label */}
            </Section.Byline>
            {appearanceCount && (
              <AppearanceChart title={'Appearances'} years={this.state.years} datasets={this.state.datasets} />
            )}
          </Box>
        </Flex>
        <Flex flexWrap="wrap" py={40}>
          <Box flex="1 1 auto" width={[1, 1 / 2, 2 / 3]} px={24}>
            <Section.Title>Bio</Section.Title>
            <Text.Default>{bio}</Text.Default>
          </Box>
        </Flex>
      </div>
    );
  }
}

FullCharacter.propTypes = FullCharacterProps;

export default FullCharacter;
