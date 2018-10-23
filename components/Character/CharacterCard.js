import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import Image from '@rebass/grid/emotion';
import Link from 'next/link';
import { DisplayName } from './DisplayName';
import { UI, Brands } from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';

const Character = styled.div(
  {
    width: Spacing.xxLarge * 5,
    height: Spacing.xxLarge * 6.25,
    overflow: 'hidden',
    position: 'relative',
    '& .DisplayName': {
      position: 'absolute',
      color: UI.Text.White,
      backgroundColor: UI.Background.Red,
      zIndex: 2,
      bottom: 0,
      left: 0,
      width: '80%',
      padding: Spacing.Small,
      '&::after': {
        content: `' '`,
        width: '100%',
        height: '100%',
        zIndex: -1,
        transform: 'skew(6deg)',
        backgroundColor: UI.Background.Red,
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        borderTop: '10px solid ' + UI.Background.White,
        borderRight: '10px solid ' + UI.Background.White,
      },
      '& *': {
        color: UI.Text.White
      }
    },
    '& img': {
      zIndex: 0,
      width: Spacing.xxLarge * 5,
      height: Spacing.xxLarge * 6.25,
      objectFit: 'cover',
      transition: '0.3s ease-in-out'
    },
    '&:hover': {
      cursor: 'pointer',
      '& img': {
        transform: 'scale(1.1)'
      }
    }
  },
  (props) => props.publisher.slug === 'marvel' && {
    '& .DisplayName': {
      backgroundColor: Brands.Marvel,
      '&:after': {
        backgroundColor: Brands.Marvel
      }
    }
  },
  (props) => props.publisher.slug === 'dc' && {
    '& .DisplayName': {
      backgroundColor: Brands.DC,
      '&:after': {
        backgroundColor: Brands.DC
      }
    }
  }
);

export const CharacterCard = (props) => (
  <div>
    <Link href={`/characters/${encodeURIComponent(props.slug)}`}>
      <Character {...props}>
        <img src={props.vendor_image} alt={props.name} title={props.name} />
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
