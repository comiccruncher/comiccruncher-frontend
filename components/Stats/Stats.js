import React from 'react';
import CountUp from 'react-countup';
import { Flex, Box } from 'rebass/emotion';
import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import { Title, Text } from '../shared/styles/type';
import Spacing from '../shared/styles/spacing';

const Bang = 'https://flash.comiccruncher.com/static/assets/bang.svg';

export const StatBlock = css({
  backgroundImage: `url(${Bang})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  textAlign: 'center',
  paddingTop: Spacing.xxLarge,
  paddingBottom: Spacing.xxLarge,
});

export const Stats = (props) => (
  <React.Fragment>
    <Flex flexWrap="wrap">
      <Box width={[1, 1 / 4, 1 / 4, 1 / 4]} className={StatBlock} style={{ transform: 'rotate(6deg)' }}>
        <Title.Red>
          <CountUp end={props.total_characters} />
        </Title.Red>
        <Text.Default bold>characters</Text.Default>
      </Box>
      <Box width={[1, 1 / 4, 1 / 4, 1 / 4]} className={StatBlock} style={{ transform: 'rotate(-4deg)' }}>
        <Title.Red>
          <CountUp end={props.total_appearances} />
        </Title.Red>
        <Text.Default bold>appearances</Text.Default>
      </Box>
      <Box width={[1, 1 / 4, 1 / 4, 1 / 4]} className={StatBlock} style={{ transform: 'rotate(3deg)' }}>
        <Title.Red>
          <CountUp end={props.total_issues} />
        </Title.Red>
        <Text.Default bold>issues</Text.Default>
      </Box>
      <Box width={[1, 1 / 4, 1 / 4, 1 / 4]} className={StatBlock} style={{ transform: 'rotate(-6deg)' }}>
        <Text.Default bold>dating from</Text.Default>
        <Title.Red>
          <CountUp end={props.min_year} />
        </Title.Red>
      </Box>
    </Flex>
  </React.Fragment>
);

Stats.propTypes = {
  total_characters: PropTypes.number.isRequired,
  total_appearances: PropTypes.number.isRequired,
  total_issues: PropTypes.number.isRequired,
  min_year: PropTypes.number.isRequired,
};
