import React from 'react';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/common';
import './search.css';

const searchUrl = API_URL + '/search/characters';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return `${suggestion.name}`;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.name}`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span className={'suggestion-content ' + suggestion.name}>
      <span className="name">
        <Link to={`/characters/${encodeURIComponent(suggestion.slug)}`}>
          {parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;
            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </Link>
      </span>
    </span>
  );
}

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
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
      return [];
    }
    const full = searchUrl + '?query=' + encodeURIComponent(escapedValue);
    console.log(full);
    axios
      .get(full)
      .then((response) => {
        this.setState({ suggestions: response.data.data });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: error });
        // @TODO: Show error.
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestedSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.props.pushRoute('/characters/' + encodeURIComponent(suggestion.slug));
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
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        onSuggestionSelected={this.onSuggestedSelected}
      />
    );
  }
}

export default withRouter(Search);
