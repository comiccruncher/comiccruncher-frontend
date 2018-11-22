import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Router from 'next/router';
import { DebounceInput } from 'react-debounce-input';
import { CharacterSearchResult } from './CharacterSearchResult';
import { SearchBar } from './SearchStyles';
import { withCache } from '../emotion/cache'; /* Keep this here */

const searchURL = `https://api.comiccruncher.com/search/characters?key=batmansmellsbadly`;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestionValue = (suggestion) => {
  return `${suggestion.name}`;
};

const renderSearchInput = (inputProps) => (
  <DebounceInput minLength={2} debounceTimeout={300} autoFocus={false} {...inputProps} className={SearchBar} />
);

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      error: '',
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ isLoading: true });
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
      return [];
    }
    axios
      .get(searchURL, { params: { query: encodeURIComponent(escapedValue) } })
      .then((response) => {
        const data = response.data.data;
        // stupid hack for setting no suggestions...
        this.setState({ suggestions: data && data.length === 0 ? [{ slug: 'no-suggestion' }] : data });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onClick = (e) => {
    e.preventDefault();
  };

  renderSuggestion = (suggestion, { query }) => {
    return <CharacterSearchResult {...suggestion} onClick={this.onClick} />;
  };

  onSuggestedSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    Router.push(`/characters/${encodeURIComponent(suggestion.slug)}`);
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 1;
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for a character',
      value,
      onChange: this.onChange,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested || this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.props.onSuggestionsClearRequested || this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.props.onSuggestionSelected || this.onSuggestedSelected}
        renderInputComponent={renderSearchInput}
        id={this.props.id || '1'}
      />
    );
  }
}

Search.propTypes = {
  id: PropTypes.string,
  onSuggestionSelected: PropTypes.func,
  onSuggestionsClearRequested: PropTypes.func,
  onSuggestionsFetchRequested: PropTypes.func,
};

export default Search;
