import React from 'react';
import styled from 'react-emotion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FullCharacterProps } from './Types';

const ChartHeight = 400;

const ChartDiv = styled.div({
  height: `${ChartHeight}px`,
  width: '100%',
});

const getMainKey = (slug) => `main-${slug}`;
const getAltKey = (slug) => `alt-${slug}`;
const mainFilter = (item) => item.category === 'main';
const altFilter = (item) => item.category === 'alternate';

const getAppearanceCounts = (key, appearances) => {
  if (!appearances || appearances.length === 0) {
    return [];
  }
  const mainFiltered = appearances.find(mainFilter);
  const mainMapped = mainFiltered.aggregates.map((item) => {
    let obj = {};
    obj[getMainKey(key)] = item.count;
    obj['year'] = item.year;
    return obj;
  });
  const altFiltered = appearances.find(altFilter);
  const altMapped = altFiltered.aggregates.map((item) => {
    let obj = {};
    obj[getAltKey(key)] = item.count;
    obj['year'] = item.year;
    return obj;
  });

  const data = [];
  mainMapped.forEach((item, i) => data.push(Object.assign({}, item, altMapped[i])));
  return data;
};

export default class AppearanceChart extends React.Component {
  state = {
    comparisons: [],
    isLoading: true,
  };

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  render() {
    const data = getAppearanceCounts(this.props.character.slug, this.props.character.appearances);
    const mainKey = getMainKey(this.props.character.slug);
    const altKey = getAltKey(this.props.character.slug);
    return (
      <ChartDiv>
        <ResponsiveContainer minHeight={ChartHeight} width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" name="Year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={mainKey} fill="#000" stackId="a" name="Main" />
            <Bar dataKey={altKey} fill="#8884d8" stackId="a" name="Alternate" />
          </BarChart>
        </ResponsiveContainer>
      </ChartDiv>
    );
  }
}

AppearanceChart.propTypes = {
  character: FullCharacterProps,
};
