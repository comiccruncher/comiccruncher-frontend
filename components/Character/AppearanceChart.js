import React from 'react';
import styled from 'react-emotion';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FullCharacterProps } from './Types';
import Search from '../Search/Search';
import { Brands } from '../shared/styles/colors';
import { withCache } from '../emotion/cache';
import { Text } from '../shared/styles/type';

const ChartHeight = 400;

const ChartDiv = styled.div({
  height: `${ChartHeight}px`,
  marginLeft: '-60px',
  marginRight: '-25px',
});

const SearchDiv = styled.div({
  maxWidth: '400px',
  width: '100%',
  margin: '20px 0',
});

const FormStyle = styled.form({
  margin: '20px 0',
  '& input': {
    border: '1px solid #000',
    '& :after': {
      background: '#000',
    },
  },
  '& span': {
    marginLeft: '10px',
  },
});
const charactersURL = 'https://api.comiccruncher.com/characters';

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
    const obj = {};
    obj[getMainKey(key)] = item.count;
    obj['year'] = item.year;
    return obj;
  });
  const altFiltered = appearances.find(altFilter);
  const altMapped = altFiltered.aggregates.map((item) => {
    const obj = {};
    obj[getAltKey(key)] = item.count;
    obj['year'] = item.year;
    return obj;
  });

  const data = [];
  mainMapped.forEach((item, i) => data.push(Object.assign({}, item, altMapped[i])));
  return data;
};

const getMissingYears = (slug, largestYear, smallestYear) => {
  // We'll have to push items to the beginning of the list.
  // 1963 ... to 1979.
  const numItems = largestYear - smallestYear;
  const filledYears = [];
  for (let i = 0; i < numItems; i++) {
    const obj = {};
    obj[getMainKey(slug)] = 0;
    obj['year'] = smallestYear + i;
    obj[getAltKey(slug)] = 0;
    filledYears.push(obj);
  }
  return filledYears;
};

const getComparisonData = (slug, originalMinYear, comparisonMinYear, comparisonData, originalData) => {
  const filled = getMissingYears(slug, originalMinYear, comparisonMinYear);
  const newData = originalData.slice();
  newData.unshift(...filled);
  const newComparisonData = [];
  newData.forEach((item, i) => newComparisonData.push(Object.assign({}, item, comparisonData[i])));
  return newComparisonData;
};

const SearchComponent = (props) => (
  <React.Fragment>
    <SearchDiv>
      <Search
        id="compare"
        placeholder="Compare to another character."
        onSuggestionSelected={props.onSuggestedSelected}
      />
      <FormStyle>
        <label>
          <Text.Default>
            <input type="checkbox" checked={props.isAlternate} onChange={props.handleAlternate} />
            <span>Alternate Realities</span>
          </Text.Default>
        </label>
      </FormStyle>
    </SearchDiv>
  </React.Fragment>
);

export default class AppearanceChart extends React.Component {
  state = {
    comparison: null,
    data: [],
    comparisonData: [],
    isAlternate: true,
    isMain: true,
    color: Brands.Marvel,
    error: null,
  };

  componentDidMount() {
    const { character } = this.props;
    const publisher = character.publisher.slug;
    const data = getAppearanceCounts(character.slug, character.appearances);
    this.setState({ data: data, color: publisher === 'dc' ? Brands.DC : Brands.Marvel });
  }

  renderComparisonData = (comparison) => {
    const character = res.data.data;
    const comparisonData = getAppearanceCounts(comparison.slug, comparison.appearances);
    const minYearHere = comparisonData[0].year;
    const originalData = this.state.data;
    const currentMinYear = originalData[0].year;
    if (currentMinYear > minYearHere) {
      const filled = getMissingYears(this.props.character.slug, currentMinYear, minYearHere);
      const newData = originalData.map((item) => item);
      newData.unshift(...filled);
      const newComparisonData = [];
      newData.forEach((item, i) => newComparisonData.push(Object.assign({}, item, counts[i])));
      this.setState((prevState) => ({
        comparison: character,
        comparisonData: newComparisonData,
      }));
    } else {
      const filled = getMissingYears(comparison.slug, minYearHere, currentMinYear);
      const newData = comparisonData.map((item) => item);
      newData.unshift(...filled);
      const newComparisonData = [];
      newData.forEach((item, i) => newComparisonData.push(Object.assign({}, item, counts[i])));
      this.setState((prevState) => ({
        comparison: character,
        comparisonData: newComparisonData,
      }));
    }
  };

  onSuggestedSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    event.preventDefault();
    const { comparison } = this.state;
    if (comparison && comparison.slug == suggestion.slug) {
      return;
    }
    axios
      .get(`${charactersURL}/${suggestion.slug}`, { params: { key: 'batmansmellsbadly' } })
      .then((res) => {
        this.setState({ error: null });
        const meta = res.data.meta;
        if (meta.error) {
          throw new Error(meta.error);
        }
        const reqCharacter = res.data.data;
        const counts = getAppearanceCounts(reqCharacter.slug, reqCharacter.appearances);
        const comparisonMinYear = counts[0].year;
        const originalCharacter = this.props.character;
        const originalData = this.state.data;
        const originalMinYear = originalData[0].year;
        const originalIsGreater = originalMinYear > comparisonMinYear;
        this.setState((prevState) => ({
          ...prevState,
          comparison: reqCharacter,
          comparisonData: getComparisonData(
            originalIsGreater ? originalCharacter.slug : reqCharacter.slug,
            originalIsGreater ? originalMinYear : comparisonMinYear,
            originalIsGreater ? comparisonMinYear : originalMinYear,
            originalIsGreater ? counts : originalData,
            originalIsGreater ? originalData : counts
          ),
        }));
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  };

  handleAlternate = () => {
    this.setState((prevState) => ({
      isAlternate: !prevState.isAlternate,
    }));
  };

  render() {
    const c = this.props.character;
    const mainKey = getMainKey(c.slug);
    const altKey = getAltKey(c.slug);
    const { error, comparison, isAlternate, comparisonData, data, color } = this.state;

    if (error) {
      return (
        <React.Fragment>
          <SearchComponent
            onSuggestedSelected={this.onSuggestedSelected}
            handleAlternate={this.handleAlternate}
            isAlternate={isAlternate}
          />
          <p>There was an error getting the chart: {error}</p>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <SearchComponent
          onSuggestedSelected={this.onSuggestedSelected}
          handleAlternate={this.handleAlternate}
          isAlternate={isAlternate}
        />
        <ChartDiv>
          {comparison &&
            isAlternate && (
              <ResponsiveContainer minHeight={ChartHeight} width="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" name="Year" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={mainKey} fill={color} stackId="a" name={`Main (${c.name})`} />
                  <Bar dataKey={altKey} fill="#969696" stackId="a" name={`Alternate (${c.name})`} />
                  <Bar
                    dataKey={getMainKey(comparison.slug)}
                    fill="red"
                    stackId="b"
                    name={`Main (${comparison.name})`}
                  />
                  <Bar
                    dataKey={getAltKey(comparison.slug)}
                    fill="orange"
                    stackId="b"
                    name={`Alternate (${comparison.name})`}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          {comparison &&
            !isAlternate && (
              <ResponsiveContainer minHeight={ChartHeight} width="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" name="Year" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={mainKey} fill={color} stackId="a" name={`Main (${c.name})`} />
                  <Bar
                    dataKey={getMainKey(comparison.slug)}
                    fill="#969696"
                    stackId="b"
                    name={`Main (${comparison.name})`}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          {!comparison &&
            isAlternate && (
              <ResponsiveContainer minHeight={ChartHeight} width="100%">
                <BarChart data={comparisonData.length > 0 ? comparisonData : data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" name="Year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={mainKey} fill={color} stackId="a" name="Main" />
                  <Bar dataKey={altKey} fill="#969696" stackId="a" name="Alternate" />
                </BarChart>
              </ResponsiveContainer>
            )}
          {!comparison &&
            !isAlternate && (
              <ResponsiveContainer minHeight={ChartHeight} width="100%">
                <BarChart data={comparisonData.length > 0 ? comparisonData : data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" name="Year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={mainKey} fill={color} stackId="a" name="Main" />
                </BarChart>
              </ResponsiveContainer>
            )}
          ;
        </ChartDiv>
      </React.Fragment>
    );
  }
}

AppearanceChart.propTypes = {
  character: FullCharacterProps,
};
