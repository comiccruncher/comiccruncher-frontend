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

class FullCharacter extends React.Component {
  render() {
    const c = this.props;
    // clean markup
    const regex = /(<([^>]+)>)/gi;
    const bio = c.vendor_description.replace(regex, '');
    return (
      <React.Fragment>
        <Wrapper>
          <CharacterHeader {...c} />
          <MainContent>
            <CharacterStats {...c} />
            <Flex flexWrap={'wrap'}>
              <Box p={30} width={[1]}>
                <AppearancesSection {...c} />
                {bio && (
                  <React.Fragment>
                    <Section.Title>
                      <h3>Bio</h3>
                    </Section.Title>
                    <Text.Default>
                      <p>{bio}</p>
                    </Text.Default>
                  </React.Fragment>
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
