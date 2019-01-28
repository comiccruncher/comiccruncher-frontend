import React from 'react';
import { Flex, Box } from 'rebass/emotion';
import { Section, Text } from '../shared/styles/type';
import { FullCharacterProps } from './Types';
import AppearanceChart from './AppearanceChart';

const prevNextReduce = (prev, next) => prev + next;

export const AppearancesSection = ({ character }) => {
  const { appearances, last_syncs } = character;
  const { aggregates } = appearances;
  const doMap = aggregates.length !== 0;
  const mainCounts = doMap ? aggregates.map((item) => item.main).reduce(prevNextReduce) : 0;
  const altCounts = doMap ? aggregates.map((item) => item.alternate).reduce(prevNextReduce) : 0;
  const lastSyncs = last_syncs ? last_syncs.slice(0, 2) : [];
  const newIssues = lastSyncs.length == 2 ? lastSyncs[0].num_issues - lastSyncs[1].num_issues : 0;
  return (
    <React.Fragment>
      {appearances && (
        <React.Fragment>
          <Section.Title>
            <h3>Appearances per year</h3>
          </Section.Title>
          <Flex flexWrap="wrap" alignItems="center" alignContent="center">
            <Box width={[1, 1 / 3, 1 / 3]}>
              <Section.Byline>
                <Text.Default>
                  <strong>{mainCounts + altCounts}</strong> total appearances
                </Text.Default>
              </Section.Byline>
            </Box>
            <Box width={[1, 1 / 3, 1 / 3]}>
              <Section.Byline>
                <Text.Default>
                  <strong>{mainCounts}</strong> main appearances
                </Text.Default>
              </Section.Byline>
            </Box>
            <Box width={[1, 1 / 3, 1 / 3]}>
              <Section.Byline>
                <Text.Default>
                  <strong>{altCounts}</strong> alternate appearances
                </Text.Default>
              </Section.Byline>
            </Box>
          </Flex>
          <AppearanceChart character={character} />
          <Flex flexWrap="wrap" alignItems="center" alignContent="center" py={16}>
            <Box width={[1, 1 / 3, 1 / 3]}>
              {lastSyncs && (
                <Text.Default>
                  Last synced at {new Date(lastSyncs[0].synced_at).toLocaleDateString('en-us')}{' '}
                  {`with ${newIssues} new issues`}
                </Text.Default>
              )}
            </Box>
          </Flex>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

AppearancesSection.propTypes = {
  character: FullCharacterProps.isRequired,
};
