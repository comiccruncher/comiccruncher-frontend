import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Flex, Box } from 'rebass/emotion';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brands } from '../shared/styles/colors';
import { AppearancesProps } from './Types';

const BAR_SIZE = 7;
const COLORS = {
  RED: '#FF0000',
  LIGHT_RED: '#fad84a',
  BLUE: Brands.DC,
  LIGHT_BLUE: '#02cfee',
  STROKE: '#f5f5f5',
};

const CHART_HEIGHT = 350;

const WrappedFlex = styled(Flex)({
  overflowY: 'hidden',
  overflowX: 'auto',
  height: CHART_HEIGHT,
});

const StyledBox = styled(Box)({
  minWidth: 768,
});

export const SingularChart = ({ character, showAlternate, width, height }) => {
  const isMarvel = character.publisher.slug === 'marvel';
  return (
    <ResponsiveContainer width={'100%'} height={CHART_HEIGHT} id={character.slug}>
      <ComposedChart data={character.appearances.aggregates}>
        <XAxis dataKey="year" name="Year" />
        <YAxis type="number" domain={[0, 'dataMax + 10']} allowDataOverflow={true} />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" />
        <CartesianGrid stroke={COLORS.STROKE} />
        <Bar barSize={BAR_SIZE} dataKey={'main'} fill={isMarvel ? COLORS.RED : Brands.DC} stackId="a" name="Main" />
        {showAlternate && (
          <Bar
            barSize={BAR_SIZE}
            dataKey={'alternate'}
            fill={isMarvel ? COLORS.LIGHT_RED : COLORS.LIGHT_BLUE}
            stackId="a"
            name="Alternate"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

SingularChart.propTypes = {
  character: PropTypes.shape({
    publisher: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
    appearances: AppearancesProps.isRequired,
  }),
  showAlternate: PropTypes.bool.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

const ComparisonChart = ({ character, comparison, composedData, children }) => {
  const isMarvel = character.publisher.slug === 'marvel';
  return (
    <WrappedFlex flexWrap="nowrap">
      <StyledBox flex="1 0 auto">
        <ComposedChart data={composedData} updateId="1" width={1145} height={CHART_HEIGHT} syncId={character.slug}>
          <XAxis dataKey="year" name="Year" />
          <YAxis type="number" domain={[0, 'dataMax + 10']} />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" margin={[20, 0]} />
          <CartesianGrid stroke={COLORS.STROKE} />
          <Bar
            barSize={4}
            dataKey={'main'}
            fill={isMarvel ? COLORS.RED : Brands.DC}
            stackId="a"
            name={`Main (${character.name})`}
          />
          <Bar
            barSize={4}
            dataKey="comparisonMain"
            fill={isMarvel ? Brands.DC : COLORS.RED}
            stackId="b"
            name={`Main (${comparison.name})`}
          />
          {children}
        </ComposedChart>
      </StyledBox>
    </WrappedFlex>
  );
};

const CharacterProps = PropTypes.shape({
  publisher: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
});

const ComparisonProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

const ComparisonChartProps = PropTypes.shape({
  character: CharacterProps,
  comparison: ComparisonProps,
  composedData: ComposedDataProps,
});

const ComposedDataProps = PropTypes.arrayOf(
  PropTypes.shape({
    year: PropTypes.number.isRequired,
    main: PropTypes.number.isRequired,
    alternate: PropTypes.number.isRequired,
    comparisonMain: PropTypes.number.isRequired,
    comparisonAlternate: PropTypes.number.isRequired,
  })
);

ComparisonChart.propTypes = ComparisonChartProps;

const ComparisonChartAlternate = ({ character, comparison, composedData }) => {
  const isMarvel = character.publisher.slug === 'marvel';
  return (
    <ComparisonChart character={character} comparison={comparison} composedData={composedData}>
      <Bar
        barSize={3}
        dataKey="alternate"
        fill={isMarvel ? COLORS.LIGHT_RED : COLORS.LIGHT_BLUE}
        stackId="a"
        name={`Alternate (${character.name})`}
      />
      <Bar
        barSize={3}
        dataKey="comparisonAlternate"
        fill={isMarvel ? COLORS.LIGHT_BLUE : COLORS.LIGHT_RED}
        stackId="b"
        name={`Alternate (${comparison.name})`}
      />
    </ComparisonChart>
  );
};

ComparisonChartAlternate.propTypes = ComparisonChartProps;

export const DualChart = ({ character, comparison, composedData, showAlternate }) =>
  !showAlternate ? (
    <ComparisonChart character={character} comparison={comparison} composedData={composedData} />
  ) : (
    <ComparisonChartAlternate character={character} comparison={comparison} composedData={composedData} />
  );

DualChart.propTypes = {
  ...ComparisonChart.propTypes,
  showAlternate: PropTypes.bool,
};
