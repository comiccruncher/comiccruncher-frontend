import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { Text } from '../shared/styles/type';
import { Brands } from '../shared/styles/colors';
import { FullCharacterProps } from './Types';
import { WithFooter } from '../Layout/Content';
import { withCache } from '../emotion/cache';
import { CharacterHeader } from './CharacterHeader';
import { CharacterStats } from './CharacterStats';
import { AppearancesSection } from './AppearancesSection';
import { OutboundLink } from 'react-ga';
import HTMLTitle from './HTMLTitle';
import { withScrollToTop } from '../shared/enhancers/withScrollToTop';

const Wrapper = styled.div({
  background: '#fff',
});

const getHeaderImg = (image, vendor_image, thumbnails) => {
  if (thumbnails && (thumbnails.image || thumbnails.vendor_image)) {
    return thumbnails.image ? thumbnails.image.large : thumbnails.vendor_image.large;
  }
  return image || vendor_image;
};

const FullCharacter = ({ showFooterText, character }) => {
  const { name, other_name, vendor_image, image, thumbnails, publisher, vendor_description, description } = character;
  return (
    <Fragment>
      <HTMLTitle name={character.name} other_name={character.other_name} />
      <Wrapper>
        <CharacterHeader
          name={name}
          other_name={other_name}
          image={getHeaderImg(image, vendor_image, thumbnails)}
          background={publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC}
        />
        <WithFooter showFooterText={showFooterText}>
          <CharacterStats publisher={character.publisher} stats={character.stats} />
          <Flex flexWrap={'wrap'}>
            <Box p={30} width={[1]}>
              <AppearancesSection character={character} />
              <Text.XSmall>
                <p>
                  {name} is a fictional character and copyright (&copy;) of{' '}
                  {publisher.slug === 'marvel' ? (
                    <OutboundLink eventLabel="marvel.com" to="https://www.marvel.com/">
                      Marvel Entertainment, LLC.
                    </OutboundLink>
                  ) : (
                    <OutboundLink eventLabel="dccomics.com" to="https://www.dccomics.com/">
                      DC Entertainment, Inc.
                    </OutboundLink>
                  )}
                  .
                </p>
              </Text.XSmall>
              {publisher.slug === 'marvel' &&
                (vendor_description || (vendor_image && !image)) && (
                  <Text.XSmall>
                    <p>Image and biography provided by the Marvel API: Data provided by Marvel. &copy; 2019 Marvel</p>
                  </Text.XSmall>
                )}
            </Box>
          </Flex>
        </WithFooter>
      </Wrapper>
    </Fragment>
  );
};

FullCharacter.propTypes = {
  showFooterText: PropTypes.bool,
  character: FullCharacterProps,
};

export default withScrollToTop(FullCharacter);
