import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Head from 'next/head';
import { Box, Flex } from 'rebass/emotion';
import { Text } from '../shared/styles/type';
import { Brands } from '../shared/styles/colors';
import { FullCharacterProps } from './Types';
import { MainContent } from '../Layout/Content';
import { withCache } from '../emotion/cache';
import { CharacterHeader } from './CharacterHeader';
import { CharacterStats } from './CharacterStats';
import { AppearancesSection } from './AppearancesSection';
import { Biography } from './Biography';

const Wrapper = styled.div({
  background: '#fff',
});

const FullCharacter = ({ showFooterText, character }) => {
  const { name, other_name, vendor_image, image, thumbnails, publisher, vendor_description, description } = character;
  return (
    <React.Fragment>
      <Head>
        <title>{`${name} ${other_name && `(${other_name})`} | Comic Cruncher`}</title>
      </Head>
      <Wrapper>
        <CharacterHeader
          name={character.name}
          other_name={character.other_name}
          image={
            thumbnails.image
              ? thumbnails.image
                ? thumbnails.image.large
                : thumbnails.vendor_image.large
              : image || vendor_image
          }
          background={publisher.slug === 'marvel' ? Brands.Marvel : Brands.DC}
        />
        <MainContent showFooterText={showFooterText}>
          <CharacterStats publisher={character.publisher} stats={character.stats} />
          <Flex flexWrap={'wrap'}>
            <Box p={30} width={[1]}>
              <AppearancesSection character={character} />
              <Biography description={description} vendor_description={vendor_description} title="Biography" />
              {publisher.slug === 'marvel' &&
                (vendor_description || (vendor_image && !image)) && (
                  <Text.Default>
                    <p>
                      <small>
                        Data ({vendor_description && `biography`}
                        {vendor_description && ` and `}
                        image) provided by Marvel. &copy; 2019 Marvel
                      </small>
                    </p>
                  </Text.Default>
                )}
            </Box>
          </Flex>
        </MainContent>
      </Wrapper>
    </React.Fragment>
  );
};

FullCharacter.propTypes = {
  showFooterText: PropTypes.bool,
  character: FullCharacterProps,
};

export default withCache(FullCharacter);
