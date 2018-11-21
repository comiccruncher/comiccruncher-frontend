import React from 'react';
import Link from 'next/link';
import styled from 'react-emotion';
import { DisplayName } from '../Character/DisplayName';
import Spacing from '../shared/styles/spacing';

const SearchResult = styled('div')`
  display: flex;
  align-items: center;
  text-align: left;
`;

const SearchImg = styled('img')({
  width: '50px',
  height: '50px',
  objectFit: 'cover',
  marginRight: Spacing.Small,
});

export const CharacterSearchResult = (props) => (
  <div>
    <span className={'suggestion-content ' + props.slug}>
      <span className="name">
        <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
          <SearchResult>
            {/* lol if there is no suggestion, then display no results... */}
            {props.slug === 'no-suggestion' ? (
              <p>No results.</p>
            ) : props.image || props.vendor_image ? (
              <React.Fragment>
                <SearchImg src={props.image || props.vendor_image} alt={props.name} />
                <DisplayName {...props} />
              </React.Fragment>
            ) : (
              <DisplayName {...props} />
            )}
          </SearchResult>
        </Link>
      </span>
    </span>
  </div>
);
