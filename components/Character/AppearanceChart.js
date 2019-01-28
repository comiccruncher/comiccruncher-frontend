import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import getConfig from 'next/config';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FullCharacterProps } from './Types';
import Search from '../Search/Search';
import { Brands } from '../shared/styles/colors';
import { Text, UIFontStack } from '../shared/styles/type';
import { Event } from '../ga/Tracker';
import { getCookieHeaders } from '../../pages/_utils';
import { withCache } from '../emotion/cache';

const cookies = new Cookies();

const ChartHeight = 400;

const ChartDiv = styled.div({
  fontFamily: UIFontStack,
  height: `${ChartHeight}px`,
  marginLeft: '-60px',
  marginRight: '-25px',
  fontSize: '.8em',
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
const charactersURL = getConfig().publicRuntimeConfig.API.charactersURL;
const getMainKey = (slug) => `main-${slug}`;
const getAltKey = (slug) => `alt-${slug}`;
// we'll need to map the apperance aggregates with unique keys
// for bar chart to work with comparisons.
const mapAppearances = (appearances) => {
  const { slug, aggregates } = appearances;
  return aggregates.map((item) => {
    const obj = {};
    obj[getMainKey(slug)] = item.main;
    obj[getAltKey(slug)] = item.alternate;
    obj['year'] = item.year;
    return obj;
  });
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

const SearchComponent = ({ onSuggestedSelected, isAlternate, handleAlternate }) => (
  <React.Fragment>
    <SearchDiv>
      <Search id="compare" placeholder="Compare to another character." onSuggestionSelected={onSuggestedSelected} />
      <FormStyle>
        <label>
          <Text.Default>
            <input type="checkbox" checked={isAlternate} onChange={handleAlternate} />
            <span>Alternate Realities</span>
          </Text.Default>
        </label>
      </FormStyle>
    </SearchDiv>
  </React.Fragment>
);

SearchComponent.propTypes = {
  onSuggestedSelected: PropTypes.func.isRequired,
  isAlternate: PropTypes.bool.isRequired,
  handleAlternate: PropTypes.func.isRequired,
};

export default class AppearanceChart extends React.Component {
  static propTypes = {
    character: FullCharacterProps,
  };

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
    const data = mapAppearances(character.appearances);
    this.setState({ data: data, color: publisher === 'dc' ? Brands.DC : Brands.Marvel });
  }

  onSuggestedSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    event.preventDefault();
    const { character } = this.props;
    const { slug } = suggestion;
    // no appearances for current character, then pass.
    if (character.appearances.aggregates.length === 0 || slug === character.slug) {
      Event('appearances', 'compare', `${this.props.character.slug}:${slug}`);
      return;
    }
    axios
      .get(`${charactersURL}/${slug}`, getCookieHeaders(cookies))
      .then((res) => {
        this.setState({ error: null });
        const meta = res.data.meta;
        if (meta.error) {
          throw new Error(meta.error);
        }
        const reqCharacter = res.data.data;
        const counts = mapAppearances(reqCharacter.appearances);
        if (counts.length === 0) {
          return;
        }
        const comparisonMinYear = counts[0].year;
        const originalCharacter = this.props.character;
        const originalData = this.state.data;
        const originalMinYear = originalData[0].year;
        const originalIsGreater = originalMinYear > comparisonMinYear;
        this.setState((prevState) => ({
          comparison: reqCharacter,
          comparisonData: getComparisonData(
            originalIsGreater ? originalCharacter.slug : reqCharacter.slug,
            originalIsGreater ? originalMinYear : comparisonMinYear,
            originalIsGreater ? comparisonMinYear : originalMinYear,
            originalIsGreater ? counts : originalData,
            originalIsGreater ? originalData : counts
          ),
        })),
          () => {
            Event('appearances', 'compare', `${this.props.character.slug}:${slug}`);
          };
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  };

  handleAlternate = () => {
    this.setState(
      (prevState) => ({
        isAlternate: !prevState.isAlternate,
      }),
      () => {
        Event('appearances', `alternate ${this.state.isAlternate ? 'on' : 'off'}`, this.props.character.slug);
      }
    );
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
          <Text.Default>There was an error getting the chart: {error}</Text.Default>
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
            (isAlternate ? (
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
            ) : (
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
            ))}
          {!comparison &&
            (isAlternate ? (
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
            ) : (
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
            ))}
        </ChartDiv>
      </React.Fragment>
    );
  }
}
