import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'react-emotion';
import Spacing from '../shared/styles/spacing';
import { Text } from '../shared/styles/type';
import { withCache } from '../emotion/cache';
import { CharacterThumbnailsProps } from '../Character/Types';

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

const SearchLink = styled('a')({
  textDecoration: 'none',
});

const CharacterSearchProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
  image: PropTypes.string,
  vendor_image: PropTypes.string,
  thumbnails: CharacterThumbnailsProps,
});

const DisplayName = ({ name, other_name, image, vendor_image, thumbnails }) => (
  <React.Fragment>
    {(image || vendor_image) && (
      <SearchImg src={image ? thumbnails.image.small : thumbnails.vendor_image.small} alt={name} />
    )}
    <Text.SearchResult>
      <p>
        <strong>{name}</strong>
      </p>
      {other_name && <p>{other_name}</p>}
    </Text.SearchResult>
  </React.Fragment>
);

DisplayName.propTypes = {
  CharacterSearchProps,
};

export const CharacterSearchResult = (props) => (
  <div>
    <span className={'suggestion-content ' + props.slug}>
      <span className="name">
        <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
          <SearchLink onClick={props.onClick}>
            <SearchResult>
              {/* lol if there is no suggestion, then display no results... */}
              {props.slug === 'no-suggestion' ? <p>No results.</p> : <DisplayName {...props} />}
            </SearchResult>
          </SearchLink>
        </Link>
      </span>
    </span>
  </div>
);

CharacterSearchResult.propTypes = {
  slug: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  CharacterSearchProps,
};
