import React from 'react';
import CountUp from 'react-countup';
import { Flex, Box } from 'rebass/emotion';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import { Title, Text } from '../shared/styles/type';
import Spacing from '../shared/styles/spacing';
import Responsive from '../shared/styles/responsive';

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

const StatTitle = styled(Title.Red)({
  [Responsive.Mobile]: {
    fontSize: '1.4em',
  },
  [Responsive.Tablet]: {
    fontSize: '1.4em',
  },
});

const StatDesc = styled(Text.Default)({
  [Responsive.Tablet]: {
    fontSize: '1em',
  },
  [Responsive.Mobile]: {
    fontSize: '.8em',
  },
});

export const Stats = (props) => (
  <Flex flexWrap="wrap">
    <StatBox width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
      <StatTitle>
        <CountUp end={props.total_characters} />
      </StatTitle>
      <Text.Default bold>characters</Text.Default>
    </StatBox>
    <StatBox width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
      <StatTitle>
        <CountUp end={props.total_appearances} />
      </StatTitle>
      <StatDesc bold>appearances</StatDesc>
    </StatBox>
    <StatBox width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
      <StatTitle>
        <CountUp end={props.total_issues} />
      </StatTitle>
      <StatDesc bold>issues</StatDesc>
    </StatBox>
    <StatBox width={[1 / 2, 1 / 4, 1 / 4, 1 / 4]}>
      <StatDesc bold>dating from</StatDesc>
      <StatTitle>
        <CountUp end={props.min_year} />
      </StatTitle>
    </StatBox>
  </Flex>
);

Stats.propTypes = {
  total_characters: PropTypes.number,
  total_appearances: PropTypes.number,
  total_issues: PropTypes.number,
  min_year: PropTypes.number,
};
