import React from 'react';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import Router from 'next/router';
import { DebounceInput } from 'react-debounce-input';
import { CharacterSearchResult } from './CharacterSearchResult';
import { SearchBar } from './SearchStyles';

const searchUrl = `https://api.comiccruncher.com/search/characters?key=batmansmellsbadly`;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestionValue = (suggestion) => {
  return `${suggestion.name}`;
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      error: '',
      isLoading: false,
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
    const full = searchUrl + '&query=' + encodeURIComponent(escapedValue);
    request
      .get(full)
      .then((response) => {
        this.setState({ suggestions: response.body.data });
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

  renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${suggestion.name}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);
    // todo: fix autosuggest highlight parse match.
    const match = parts.map((part, index) => {
      const className = part.highlight ? 'highlight' : null;
      return (
        <span className={className} key={index}>
          {part.text}
        </span>
      );
    });
    return <CharacterSearchResult {...suggestion} />;
  };

  onSuggestedSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    Router.push('/characters/' + encodeURIComponent(suggestion.slug));
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 2;
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search for a character',
      value,
      onChange: this.onChange,
    };
    // TODO: Why is the debounce input so freakin slow?!!?!
    const renderSearchInput = (inputProps) => (
      <DebounceInput minLength={1} debounceTimeout={200} autoFocus {...inputProps} className={SearchBar} />
    );
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestedSelected}
        renderInputComponent={renderSearchInput}
      />
    );
  }
}

export default Search;
