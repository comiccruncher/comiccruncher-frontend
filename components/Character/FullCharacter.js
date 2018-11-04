import React from 'react';
import CountUp from 'react-countup';
import { Box, Flex } from 'rebass/emotion';
import AppearanceChart from './AppearanceChart';
import { UI, Brands } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import { Title, Section, Text, TextDefault } from '../shared/styles/type';
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
      <React.Fragment>
        <Flex flexWrap="wrap" style={{ minHeight: '520px', overflow: 'hidden' }}>
          <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 1 / 3]}>
            <img src={c.vendor_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box
            flex="1 0 auto"
            width={[1, `${Dimensions.GoldenRatio.Large}`, 2 / 3]}
            p={32}
            bg={c.publisher.slug === 'dc' ? Brands.DC : Brands.Marvel}
            style={{ textAlign: 'center' }}
          >
            <Flex justifyContent="center" alignItems="center" alignContent="center" style={{ height: '100%' }}>
              <Box alignSelf="center">
                <Title.Large>
                  <h1>{title}</h1>
                </Title.Large>
                <Title.Byline>
                  <h2>{otherName}</h2>
                </Title.Byline>
              </Box>
            </Flex>
          </Box>
        </Flex>
        {appearanceCount && (
          <Flex flexWrap="wrap" py={40}>
            <Box flex="1 1 auto" width={1} px={24}>
              <Section.Title>
                <h3>Appearances per year</h3>
              </Section.Title>
              <Section.Byline>
                <p>
                  <CountUp end={appearanceCount} /> lifetime total
                </p>
                {/* TODO: change appearanceCount when someone clicks on main/alt label */}
              </Section.Byline>
              <AppearanceChart title={'Appearances'} years={this.state.years} datasets={this.state.datasets} />
            </Box>
          </Flex>
        )}
        {bio && (
          <Flex flexWrap="wrap" py={40}>
            <Box flex="1 1 auto" width={[1, 1 / 2, 2 / 3]} px={24}>
              <Section.Title>
                <h3>Bio</h3>
              </Section.Title>
              <Text.Default>
                <p>{bio}</p>
              </Text.Default>
            </Box>
          </Flex>
        )}
      </React.Fragment>
    );
  }
}

FullCharacter.propTypes = FullCharacterProps;

export default FullCharacter;
