import React from 'react';
import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { Section, Text } from '../shared/styles/type';
import AppearanceChart from './AppearanceChart';
import { LoadingDC, LoadingMarvel } from '../shared/components/Icons';

const ChartDiv = styled.div({
  marginLeft: '-60px',
  marginRight: '-25px',
});

const aggregateCountMap = (aggregate) => aggregate.count;
const prevNextReduce = (prev, next) => prev + next;

export class AppearancesSection extends React.Component {
  state = {
    isLoading: true,
    mainCounts: 0,
    altCounts: 0,
    newIssues: 0,
  };

  componentDidMount() {
    const c = this.props;
    const appearances = c.appearances;
    const mainCounts =
      appearances && appearances[0] ? appearances[0].aggregates.map(aggregateCountMap).reduce(prevNextReduce) : 0;
    const altCounts =
      appearances && appearances[1] ? appearances[1].aggregates.map(aggregateCountMap).reduce(prevNextReduce) : 0;
    const lastSyncs = c.last_syncs ? c.last_syncs.slice(0, 2) : [];
    const newIssues = lastSyncs.length == 2 ? lastSyncs[0].num_issues - lastSyncs[1].num_issues : 0;
    setTimeout(
      () =>
        this.setState({
          isLoading: false,
          mainCounts: mainCounts,
          altCounts: altCounts,
          newIssues: newIssues,
          totalIssues: mainCounts + altCounts,
        }),
      300
    );
  }

  render() {
    const c = this.props;
    const lastSyncs = c.last_syncs ? c.last_syncs.slice(0, 2) : [];
    if (this.state.isLoading) {
      return (
        <Flex flexWrap="wrap" alignItems="center" alignContent="center">
          <Box width={1}>{c.publisher.slug === 'marvel' ? <LoadingMarvel /> : <LoadingDC />}</Box>
        </Flex>
      );
    }
    return (
      <React.Fragment>
        {c.appearances &&
          c.appearances.length > 0 && (
            <React.Fragment>
              <Section.Title>
                <h3>Appearances per year</h3>
              </Section.Title>
              <Section.Byline>
                <Text.Default>
                  <p>
                    <strong>{this.state.totalIssues}</strong> total appearances
                  </p>
                  <p>
                    <strong>{this.state.mainCounts}</strong> main appearances
                  </p>
                  <p>
                    <strong>{this.state.altCounts}</strong> alternate appearances
                  </p>
                  {lastSyncs && (
                    <p>
                      Last synced at {new Date(lastSyncs[0].synced_at).toLocaleDateString('en-us')}{' '}
                      {`with ${this.state.newIssues} new issues`}
                    </p>
                  )}
                </Text.Default>
              </Section.Byline>
              <ChartDiv>
                <AppearanceChart character={c} />
              </ChartDiv>
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}
