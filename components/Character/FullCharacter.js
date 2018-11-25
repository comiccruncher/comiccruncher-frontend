import React from 'react';
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
    const c = this.props;
    // clean markup
    const bio = c.vendor_description;
    return (
      <React.Fragment>
        <Wrapper>
          <CharacterHeader {...c} />
          <MainContent>
            <CharacterStats {...c} />
            <Flex flexWrap={'wrap'}>
              <Box p={30} width={[1]}>
                <AppearancesSection {...c} />
                {c.publisher.slug === 'marvel' &&
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
                {c.publisher.slug === 'marvel' &&
                  (bio || (c.vendor_image && !c.image)) && (
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

FullCharacter.propTypes = FullCharacterProps;

export default withCache(FullCharacter);
