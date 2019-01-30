import React, { Fragment } from 'react';
import styled from 'react-emotion';
import getConfig from 'next/config';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { FullCharacterProps } from './Types';
import Search from '../Search/Search';
import { Text, UIFontStack } from '../shared/styles/type';
import { Event } from '../ga/Tracker';
import { getCookieHeaders } from '../../pages/_utils';
import { SingularChart, DualChart } from './Charts';
import { withCache } from '../emotion/cache';

const cookies = new Cookies();

const ChartDiv = styled.div({
  fontFamily: UIFontStack,
  marginLeft: '-35px',
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

/**
 * Fills 0's for between the largest and greatest year.
 *
 * @param {int} largestYear
 * @param {int} smallestYear
 */
const fillZeros = (largestYear, smallestYear) => {
  const numItems = largestYear - smallestYear;
  const filledYears = [];
  for (let i = 0; i < numItems; i++) {
    filledYears.push({
      main: 0,
      year: smallestYear + i,
      alternate: 0,
    });
  }
  return filledYears;
};

const composeComparisonData = (original, comparison) => {
  // if 2011 (original) > 1979 (comparison) ... means we want to backfill the original data.
  const a = original.appearances.aggregates;
  const b = comparison.appearances.aggregates;
  const aYear = a[0].year;
  const bYear = b[0].year;
  let newData = [];
  let missingYears = [];
  const backFillOriginal = aYear > bYear;
  if (backFillOriginal) {
    // backfill original data
    missingYears = fillZeros(aYear, bYear);
    newData = a.slice();
  } else {
    missingYears = fillZeros(bYear, aYear);
    newData = b.slice();
  }
  newData.unshift(...missingYears);
  return newData.map((e, i) => {
    return {
      main: backFillOriginal ? newData[i].main : a[i].main,
      alternate: backFillOriginal ? newData[i].alternate : a[i].alternate,
      comparisonMain: backFillOriginal ? b[i].main : newData[i].main,
      comparisonAlternate: backFillOriginal ? b[i].alternate : newData[i].alternate,
      year: backFillOriginal ? newData[i].year : a[i].year,
    };
  });
};

export default class AppearanceChart extends React.Component {
  static propTypes = {
    character: FullCharacterProps,
  };

  state = {
    comparison: null,
    comparisonData: [],
    isAlternate: true,
    error: null,
  };

  onSuggestedSelected = (event, { suggestion }) => {
    event.preventDefault();
    const { character } = this.props;
    const { slug } = suggestion;
    const aggregates = character.appearances.aggregates;
    // no appearances for current character, then pass.
    if (aggregates.length === 0 || slug === character.slug) {
      Event('appearances', 'compare', `${character.slug}:${slug}`);
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
        this.setState((prevState) => ({
          comparison: reqCharacter,
          comparisonData: composeComparisonData(character, reqCharacter),
        })),
          () => {
            Event('appearances', 'compare', `${character.slug}:${slug}`);
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
    const { character } = this.props;
    const { error, comparison, isAlternate, comparisonData } = this.state;
    return (
      <Fragment>
        <SearchDiv>
          <Search
            id="compare"
            placeholder="Compare to another character."
            onSuggestionSelected={this.onSuggestedSelected}
          />
        </SearchDiv>
        <FormStyle>
          <label>
            <Text.Default>
              <input type="checkbox" checked={isAlternate} onChange={this.handleAlternate} />
              <span>Alternate Realities</span>
            </Text.Default>
          </label>
        </FormStyle>
        <ChartDiv>
          {!error ? (
            !comparison ? (
              <SingularChart showAlternate={isAlternate} character={character} />
            ) : (
              <DualChart
                composedData={comparisonData}
                character={character}
                comparison={comparison}
                showAlternate={isAlternate}
              />
            )
          ) : (
            <Text.Default>There was an error getting the chart: {error}</Text.Default>
          )}
        </ChartDiv>
      </Fragment>
    );
  }
}
