import React from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'react-emotion';
import { DebounceInput } from 'react-debounce-input';

const searchUrl = `https://api.comiccruncher.com/search/characters?key=batmansmellsbadly`;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getSuggestionValue = (suggestion) => {
  return `${suggestion.name}`;
};

const SearchResult = styled('div')`
  display: flex;
  align-items: center;
`;

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
    axios
      .get(full)
      .then((response) => {
        this.setState({ suggestions: response.data.data });
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
    return (
      <span className={'suggestion-content ' + suggestion.slug}>
        <span className="name">
          <Link href={`/characters/${encodeURIComponent(suggestion.slug)}`}>
            <SearchResult>
              <img src={suggestion.vendor_image} alt={suggestion.name} width={50} height={50} />
              <p>
                {suggestion.name} {suggestion.other_name ? ` (${suggestion.other_name})` : ''}
              </p>
            </SearchResult>
          </Link>
        </span>
      </span>
    );
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
    const renderSearchInput = (inputProps) => (
      <DebounceInput minLength={1} debounceTimeout={500} autoFocus {...inputProps} />
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
