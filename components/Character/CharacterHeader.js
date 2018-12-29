import React from 'react';
import PropTypes from 'prop-types';
import { PublisherProps, CharacterThumbnailsProps } from './Types';
import { Box, Flex } from 'rebass/emotion';
import styled, { css } from 'react-emotion';
import { Header } from '../Layout/Header';
import Responsive from '../shared/styles/responsive';
import { UI, Brands } from '../shared/styles/colors';
import { Title } from '../shared/styles/type';
import Dimensions from '../shared/styles/dimensions';

const AngledBox = css({
  zIndex: 10,
  position: 'relative',
  '&::after': {
    content: `' '`,
    width: '100%',
    height: '100%',
    zIndex: -1,
    transform: 'skew(-6deg)',
    backgroundColor: 'inherit',
    position: 'absolute',
    top: 0,
    left: '-40px',
    borderLeft: '20px solid ' + UI.Background.White,
    [Responsive.Mobile]: {
      borderLeft: 'none',
      borderTop: '20px solid ' + UI.Background.White,
      left: 0,
      top: '-40px',
      transform: 'skewY(-6deg)',
    },
  },
});

const HeaderTitle = styled('div')((props) => ({
  position: 'absolute',
  top: '35%',
  left: 0,
  right: 0,
  bottom: 0,
  [Responsive.Mobile]: {
    margin: '20px 0 40px 0',
    position: 'relative',
  },
}));

const ImgContainer = styled.div({
  height: '400px',
  [Responsive.TabletAndBelow]: {
    height: '300px',
  },
});

const CharacterImg = styled(ImgContainer.withComponent('img'))((props) => ({
  width: props.width || '100%',
  height: props.height || '100%',
  objectFit: 'cover',
  objectPosition: props.objectPosition || 'center',
}));

const BlankImg = styled(ImgContainer)({
  height: '400px',
  [Responsive.TabletAndBelow]: {
    height: '300px',
  },
  [Responsive.Mobile]: {
    height: '0',
  },
});

export const CharacterHeader = ({ name, other_name, publisher, image, vendor_image, thumbnails }) => {
  return (
    <React.Fragment>
      <Header background="#fff" overflow="hidden">
        <Flex flexWrap="wrap" justifyContent="space-between" alignContent="center">
          <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]}>
            {image || vendor_image ? (
              <CharacterImg
                src={image ? thumbnails.image.large : thumbnails.vendor_image.large}
                alt={`${name} profile image`}
              />
            ) : (
              // Show blank div. TODO: Replace with placeholder!
              <BlankImg />
            )}
          </Box>
          <Box
            flex="1 0 auto"
            width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}
            className={AngledBox}
            bg={publisher.slug == 'marvel' ? Brands.Marvel : Brands.DC}
          >
            <Flex justifyContent="space-between" alignItems="center" alignContent="center">
              <Box flex="1 0 auto">
                <HeaderTitle>
                  <Title.Large>
                    <h1>{name}</h1>
                  </Title.Large>
                  {other_name && (
                    <Title.Byline>
                      <h2>{other_name}</h2>
                    </Title.Byline>
                  )}
                </HeaderTitle>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Header>
    </React.Fragment>
  );
};

CharacterHeader.propTypes = {
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
  publisher: PublisherProps.isRequired,
  image: PropTypes.string,
  vendor_image: PropTypes.string,
  thumbnails: CharacterThumbnailsProps,
};
