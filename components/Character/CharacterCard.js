import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { CharacterProps, CharacterThumbnailsProps } from './Types';
import { DisplayName } from './DisplayName';
import { UI, Brands } from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';
import Responsive from '../shared/styles/responsive';
import { LoadingSVG } from '../shared/components/Icons';

const Card = styled.div(
  (props) => ({
    width: '100%',
    height: Spacing.xxLarge * 6.25,
    overflow: 'hidden',
    position: 'relative',
    [Responsive.Mobile]: {
      height: '300px',
      /*
      overflow: 'hidden',
      height: '112px',
      lineHeight: '112px',
      textAlign: 'left',
      backgroundColor: props.publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC,
      */
    },
    '& .DisplayName': {
      position: 'absolute',
      color: UI.Text.White,
      backgroundColor: UI.Background.Red,
      zIndex: 2,
      bottom: 0,
      left: 0,
      width: '80%',
      padding: Spacing.Small,
      [Responsive.Mobile]: {
        /*
        position: 'relative',
        width: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        paddingLeft: '125px',
        */
      },
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
        [Responsive.Mobile]: {
         // border: 0,
        },
      },
      '& *': {
        color: UI.Text.White,
      },
    },
    '& img': {
      zIndex: 0,
      width: '100%',
      height: 'inherit',
      objectFit: 'cover',
      transition: '0.3s ease-in-out',
      /*
      [Responsive.Mobile]: {
        float: 'left',
        height: '112px',
        width: '112px',
        position: 'absolute',
        zIndex: 9,
        borderRight: '10px solid #fff',
        '&:after': {
          content: '',
          transform: 'skew(160deg)',
        },
      },
      */
    },
    '&:hover': {
      cursor: 'pointer',
      '& img': {
        transform: 'scale(1.1)',
      },
    },
  }),
  (props) => ({
    '& .DisplayName': {
      backgroundColor: props.publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC,
      '&:after': {
        backgroundColor: props.publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC,
      },
    },
  })
);

const LoadingBG = styled.div({
  background: '#000',
  opacity: 0.7,
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 10,
});

const SVGStyle = css({
  margin: 'auto',
  top: 0,
  right: 0,
  position: 'absolute',
  bottom: '25%',
  left: 0,
  [Responsive.Mobile]: {
    bottom: 0,
    padding: '10px 0',
  },
});

export const getImage = (image, vendor_image, thumbnails, size) => {
  if (thumbnails && (thumbnails.image || thumbnails.vendor_image)) {
    return thumbnails.image ? thumbnails.image[size] : thumbnails.vendor_image[size];
  }
  return image || vendor_image;
};

const CharacterImage = ({ name, image, vendor_image, thumbnails }) => {
  return <img src={getImage(image, vendor_image, thumbnails, 'large')} alt={name} title={name} />;
};

CharacterImage.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  vendor_image: PropTypes.string.isRequired,
  thumbnails: CharacterThumbnailsProps.isRequired,
};

export const CharacterCard = ({ character, isLoading }) => (
  <Fragment>
    <Card publisher={character.publisher}>
      {isLoading && (
        <LoadingBG>
          <LoadingSVG className={SVGStyle} color={character.publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC} />
        </LoadingBG>
      )}
      {character.thumbnails &&
        (character.image || character.vendor_image) && (
          <CharacterImage
            name={character.name}
            image={character.image}
            vendor_image={character.vendor_image}
            thumbnails={character.thumbnails}
          />
        )}
      <DisplayName stats={character.stats} name={character.name} />
    </Card>
  </Fragment>
);

CharacterCard.propTypes = {
  character: CharacterProps.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
