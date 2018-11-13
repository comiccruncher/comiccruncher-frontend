import React from 'react';
import styled, { css } from 'react-emotion';
import CountUp from 'react-countup';
import { Box, Flex } from 'rebass/emotion';
import AppearanceChart from './AppearanceChart';
import { UI, Brands } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Responsive from '../shared/styles/responsive';
import { Title, Section, Text, TextDefault } from '../shared/styles/type';
import { FullCharacterProps } from './Types';
import { MainContent, ContentBlock } from '../Layout/Content';
import { Header } from '../Layout/Header';
import { StatBlock } from '../Stats/Stats';

const AngledBox = css({
  zIndex: 10,
  position: 'relative',
  '&::after': {
    content: `' '`,
    width: '100%',
    height: '100%',
    zIndex: -1,
    transform: 'skew(-6deg)',
    backgroundColor: 'inherit',
    position: 'absolute',
    top: 0,
    left: '-40px',
    borderLeft: '20px solid ' + UI.Background.White,
    [Responsive.Mobile]: {
      borderLeft: 'none',
      borderTop: '20px solid ' + UI.Background.White,
      left: 0,
      top: '-40px',
      transform: 'skewY(-6deg)',
    },
  },
});

const characterImg = (publisher) =>
  css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: publisher.slug === 'marvel' ? 'center' : 'top',
  });

const aggregateCountMap = (aggregate) => aggregate.count;
const prevNextReduce = (prev, next) => prev + next;
const getDataSets = (appearances) => {
  // TODO: Change to red/blue for marvel/dc characters??
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
        <Header bg={c.publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC}>
          <ContentBlock>
            <div css={{ 'margin-bottom': '0' }}>
              <Flex flexWrap="wrap" style={{ overflow: 'hidden' }} p={0}>
                <Box
                  flex="1 0 auto"
                  width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]}
                  style={{ zIndex: '0', maxHeight: '400px' }}
                  p={0}
                >
                  <div
                    style={{
                      width: '100%',
                      /*
                      'border-top': '20px solid #fff',
                      'border-left': '20px solid #fff',
                      'border-bottom': '20px solid #fff',
                      */
                      height: '100%',
                    }}
                  >
                    <img src={c.vendor_image} css={characterImg(c.publisher)} />
                  </div>
                </Box>
                <Box
                  flex="1 0 auto"
                  width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}
                  p={0}
                  style={{ textAlign: 'center' }}
                  className={AngledBox}
                  bg={c.publisher.slug == 'marvel' ? Brands.Marvel : Brands.DC}
                >
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    alignContent="center"
                    style={{ height: '100%', position: 'relative' }}
                    p={0}
                  >
                    <Box alignSelf="center">
                      <Title.Large>
                        <h1>{title}</h1>
                      </Title.Large>
                      <Title.Byline>
                        <h2>{otherName}</h2>
                      </Title.Byline>
                      <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                        <Title.Red>
                          #<CountUp end={1} />
                        </Title.Red>
                        <Text.Default bold>All Time</Text.Default>
                      </div>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </div>
          </ContentBlock>
        </Header>
        <MainContent>
          <ContentBlock>
            <Flex flexWrap={'wrap'}>
              <Box p={30} width={[1, 1, 3 / 4]}>
                {appearanceCount && (
                  <React.Fragment>
                    <Section.Title>
                      <h3>Appearances per year</h3>
                    </Section.Title>
                    <Section.Byline>
                      <Text.Default>
                        <CountUp end={appearanceCount} /> lifetime total
                      </Text.Default>
                      {/* TODO: change appearanceCount when someone clicks on main/alt label */}
                      <AppearanceChart title={'Appearances'} years={this.state.years} datasets={this.state.datasets} />
                    </Section.Byline>
                  </React.Fragment>
                )}
                {bio && (
                  <React.Fragment>
                    <Section.Title>
                      <h3>Bio</h3>
                    </Section.Title>
                    <Text.Default>
                      <p>{bio}</p>
                    </Text.Default>
                  </React.Fragment>
                )}
              </Box>
              <Box p={3} width={[1, 1, 1 / 4]}>
                <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                  <Title.Red>
                    #<CountUp end={1} />
                  </Title.Red>
                  <Text.Default bold>All Time</Text.Default>
                </div>
                <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                  <Title.Red>
                    #<CountUp end={1} />
                  </Title.Red>
                  <Text.Default bold>Marvel</Text.Default>
                </div>
                <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                  <Title.Red>
                    <CountUp end={30} />
                  </Title.Red>
                  <Text.Default bold>avg issues/year</Text.Default>
                </div>
              </Box>
            </Flex>
          </ContentBlock>
        </MainContent>
      </React.Fragment>
    );
  }
}

FullCharacter.propTypes = FullCharacterProps;

export default FullCharacter;
