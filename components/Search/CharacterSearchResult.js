import React from 'react';
import Link from 'next/link';
import styled from 'react-emotion';
import { DisplayName } from '../Character/DisplayName';

const SearchResult = styled('div')`
  display: flex;
  align-items: center;
`;

export const CharacterSearchResult = (props) => (
  <div>
    <span className={'suggestion-content ' + props.slug}>
      <span className="name">
        <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
          <SearchResult>
            <img src={props.vendor_image} alt={props.name} width={50} height={50} />
            <p>
              <DisplayName {...props} />
            </p>
          </SearchResult>
        </Link>
      </span>
    </span>
  </div>
);
