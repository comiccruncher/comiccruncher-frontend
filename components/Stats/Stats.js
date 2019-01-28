import React from 'react';
import CountUp from 'react-countup';
import { Flex, Box } from 'rebass/emotion';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Title, Text } from '../shared/styles/type';
import Spacing from '../shared/styles/spacing';

const Bang = 'https://flash.comiccruncher.com/static/assets/bang.svg';

export const StatBox = styled(Box)({
  backgroundImage: `url(${Bang})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  textAlign: 'center',
  paddingTop: Spacing.xxLarge,
  paddingBottom: Spacing.xxLarge,
  transform: 'rotate(6deg)',
});

export const Stats = (props) => (
  <Flex flexWrap="wrap">
    <StatBox width={[1, 1 / 4, 1 / 4, 1 / 4]}>
      <Title.Red>
        <CountUp end={props.total_characters} />
      </Title.Red>
      <Text.Default bold>characters</Text.Default>
    </StatBox>
    <StatBox width={[1, 1 / 4, 1 / 4, 1 / 4]}>
      <Title.Red>
        <CountUp end={props.total_appearances} />
      </Title.Red>
      <Text.Default bold>appearances</Text.Default>
    </StatBox>
    <StatBox width={[1, 1 / 4, 1 / 4, 1 / 4]}>
      <Title.Red>
        <CountUp end={props.total_issues} />
      </Title.Red>
      <Text.Default bold>issues</Text.Default>
    </StatBox>
    <StatBox width={[1, 1 / 4, 1 / 4, 1 / 4]}>
      <Text.Default bold>dating from</Text.Default>
      <Title.Red>
        <CountUp end={props.min_year} />
      </Title.Red>
    </StatBox>
  </Flex>
);

Stats.propTypes = {
  total_characters: PropTypes.number,
  total_appearances: PropTypes.number,
  total_issues: PropTypes.number,
  min_year: PropTypes.number,
};
