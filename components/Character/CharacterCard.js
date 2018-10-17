import React from 'react';
import PropTypes from 'prop-types';
import { DisplayName } from './DisplayName';
import Image from '@rebass/grid/emotion';
import Link from 'next/link';

export const CharacterCard = (props) => (
  <div>
    <h4>
      <DisplayName {...props} />
    </h4>
    <Link href={`/characters/${encodeURIComponent(props.slug)}`}>To Page</Link>
  </div>
);

CharacterCard.propTypes = {
  publisher: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  name: PropTypes.string,
  other_name: PropTypes.string,
  slug: PropTypes.string,
  image: PropTypes.string,
  vendor_image: PropTypes.string,
};
