import React from 'react';
import Link from 'next/link';
import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { DisplayName } from '../Character/DisplayName';
import Spacing from '../shared/styles/spacing';

const SearchResult = styled('div')`
  display: flex;
  align-items: center;
  text-align: left;
`;

export const CharacterSearchResult = (props) => (
  <div>
    <span className={'suggestion-content ' + props.slug}>
      <span className="name">
        <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
          <SearchResult>
            <img src={props.vendor_image} alt={props.name} width={50} height={50} style={{ objectFit: 'cover', marginRight: Spacing.Small }}/>
            <DisplayName {...props} />
          </SearchResult>
        </Link>
      </span>
    </span>
  </div>
);
