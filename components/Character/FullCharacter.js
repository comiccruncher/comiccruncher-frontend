import React from 'react';
import styled, { css } from 'react-emotion';
import CountUp from 'react-countup';
import { Box, Flex } from 'rebass/emotion';
import AppearanceChart from './AppearanceChart';
import { UI, Brands } from '../shared/styles/colors';
import Dimensions from '../shared/styles/dimensions';
import Responsive from '../shared/styles/responsive';
import { Title, Section, Text } from '../shared/styles/type';
import { FullCharacterProps } from './Types';
import { MainContent } from '../Layout/Content';
import { Header } from '../Layout/Header';
import { StatBlock } from '../Stats/Stats';
import { withCache } from '../emotion/cache';

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

const wrapper = css({
  background: '#fff',
});

const HeaderTitle = styled('div')((props) => ({
  marginTop: '120px',
  [Responsive.Tablet]: {
    marginTop: '70px',
  },
  [Responsive.Mobile]: {
    margin: '20px',
  },
}));

const CharacterImg = styled('img')((props) => ({
  width: props.width || '100%',
  height: props.height || '100%',
  objectFit: 'cover',
  objectPosition: props.objectPosition || 'top',
  height: '400px',
  [Responsive.TabletAndBelow]: {
    height: '350px',
  },
}));

const AppearanceDiv = styled.div({
  marginLeft: '-60px',
  marginRight: '-25px',
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
    mainCount: 0,
    altCount: 0,
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
        mainCount: mainCounts,
        altCount: altCounts,
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
    const allTime = c.stats ? c.stats.find((stat) => stat.category === 'all_time') : null;
    const main = c.stats ? c.stats.find((stat) => stat.category === 'main') : null;
    const lastSyncs = c.last_syncs ? c.last_syncs.slice(0, 2) : [];
    const newIssues = lastSyncs.length == 2 ? lastSyncs[0].num_issues - lastSyncs[1].num_issues : 0;
    return (
      <React.Fragment>
        <div className={wrapper}>
          <Header background="#fff" overflow="hidden">
            <Flex flexWrap="wrap">
              <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]}>
                <CharacterImg src={c.image || c.vendor_image} alt={`${c.name} profile image`} />
              </Box>
              <Box
                flex="1 0 auto"
                width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}
                className={AngledBox}
                bg={c.publisher.slug == 'marvel' ? Brands.Marvel : Brands.DC}
              >
                <Flex justifyContent="center" alignItems="center" alignContent="center">
                  <Box p={30}>
                    <HeaderTitle>
                      <Title.Large>
                        <h1>{title}</h1>
                      </Title.Large>
                      {otherName && (
                        <Title.Byline>
                          <h2>{otherName}</h2>
                        </Title.Byline>
                      )}
                    </HeaderTitle>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Header>
          <MainContent>
            {allTime &&
              main && (
                <Flex flexWrap={'wrap'} mt={30} mb={30}>
                  <Box width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
                    <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                      <Title.Red>
                        #<CountUp end={allTime.issue_count_rank} />
                      </Title.Red>
                      <Text.Default bold>All Time</Text.Default>
                    </div>
                  </Box>
                  <Box width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
                    <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                      <Title.Red>
                        #<CountUp end={main.issue_count_rank} />
                      </Title.Red>
                      <Text.Default bold>{c.publisher.name}</Text.Default>
                    </div>
                  </Box>
                  <Box width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
                    <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                      <Title.Red>
                        #<CountUp end={main.average_issues_per_year_rank} />
                      </Title.Red>
                      <Text.Default bold>avg issues/year</Text.Default>
                    </div>
                  </Box>
                  <Box width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
                    <div className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
                      <Title.Red>
                        <CountUp end={main.average_issues_per_year} />
                      </Title.Red>
                      <Text.Default bold>avg issues/year</Text.Default>
                    </div>
                  </Box>
                </Flex>
              )}
            <Flex flexWrap={'wrap'}>
              <Box p={30} width={[1]}>
                {appearanceCount && (
                  <React.Fragment>
                    <Section.Title>
                      <h3>Appearances per year</h3>
                    </Section.Title>
                    <Section.Byline>
                      <Text.Default>
                        <p>
                          <strong>{this.state.totalAppearanceCount}</strong> total appearances
                        </p>
                        <p>
                          <strong>{this.state.mainCount}</strong> main appearances
                        </p>
                        <p>
                          <strong>{this.state.altCount}</strong> alternate appearances
                        </p>
                        {lastSyncs && (
                          <p>
                            Last synced at {new Date(lastSyncs[0].synced_at).toLocaleDateString('en-us')}{' '}
                            {newIssues && `with ${newIssues} new issues`}
                          </p>
                        )}
                      </Text.Default>
                    </Section.Byline>
                    <AppearanceDiv>
                      <AppearanceChart character={this.props} />
                    </AppearanceDiv>
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
            </Flex>
          </MainContent>
        </div>
      </React.Fragment>
    );
  }
}

FullCharacter.propTypes = FullCharacterProps;

export default withCache(FullCharacter);
