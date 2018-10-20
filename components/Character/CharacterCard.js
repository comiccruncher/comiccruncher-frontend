import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import Image from '@rebass/grid/emotion';
import Link from 'next/link';
import { DisplayName } from './DisplayName';
import { UI } from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';

const Character = styled.div(
  {
    backgroundRepeat: 'none',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: Spacing.xxLarge * 5,
    height: Spacing.xxLarge * 6.25,
    '& DisplayName *': {
      color: UI.Text.White,
      backgroundColor: UI.Background.Red,
    }
  },
  props => ({
    // Need to figure out how to get background images to work with props
    backgroundImage: `url('${props.vendor_image}')`
  })
);

export const CharacterCard = (props) => (
  <div>
    <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
      <Character>
        <DisplayName {...props} />
      </Character>
    </Link>
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
