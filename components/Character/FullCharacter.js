import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { Box, Flex } from 'rebass/emotion';
import { Section, Text } from '../shared/styles/type';
import { FullCharacterProps } from './Types';
import { MainContent } from '../Layout/Content';
import { withCache } from '../emotion/cache';
import { CharacterHeader } from './CharacterHeader';
import { CharacterStats } from './CharacterStats';
import { AppearancesSection } from './AppearancesSection';

const Wrapper = styled.div({
  background: '#fff',
});

const Year = new Date().getFullYear();

class FullCharacter extends React.Component {
  render() {
    const { showFooterText, character } = this.props;
    const bio = character.vendor_description;
    const publisherSlug = character.publisher.slug;
    return (
      <React.Fragment>
        <Wrapper>
          <CharacterHeader {...character} />
          <MainContent showFooterText={showFooterText}>
            <CharacterStats {...character} />
            <Flex flexWrap={'wrap'}>
              <Box p={30} width={[1]}>
                <AppearancesSection {...character} />
                {publisherSlug === 'marvel' &&
                  bio && (
                    <React.Fragment>
                      <Section.Title>
                        <h3>Bio</h3>
                      </Section.Title>
                      <Text.Default>
                        <p>{bio}</p>
                      </Text.Default>
                    </React.Fragment>
                  )}
                {publisherSlug === 'marvel' &&
                  (bio || (character.vendor_image && !character.image)) && (
                    <Text.Default>
                      <p>
                        <small>
                          Data ({bio && `biography`}
                          {bio && ` and `}
                          image) provided by Marvel. &copy; {Year} Marvel
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
  }
}
FullCharacter.propTypes = {
  showFooterText: PropTypes.bool,
  character: FullCharacterProps,
};

export default withCache(FullCharacter);
