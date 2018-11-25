import React from 'react';
import axios from 'axios';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Layout from '../components/Layout/Layout';
import Search from '../components/Search/Search';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { MainHeader } from '../components/Layout/Header';
import { MainContent } from '../components/Layout/Content';
import { Section, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';

class Marvel extends React.Component {
  state = {
    isLoading: false,
  };

  render() {
    return (
      <React.Fragment>
        <Layout title={'Marvel Comics | Popular Characters | Comic Cruncher'} canonical="/marvel">
          <MainHeader background={Brands.Marvel}>
            <Flex>
              <Box width={1152} m="0 auto" p={3}>
                <h1>Marvel</h1>
                <Search />
              </Box>
            </Flex>
          </MainHeader>
          <MainContent>
            <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
              <Box width={[1]}>
                <Section.Title>
                  <h1>Popular Marvel Characters</h1>
                </Section.Title>
                <Text.Default>
                  <p>
                    This page shows most popular Marvel characters by <strong>main</strong> appearances only (no
                    alternate realities)!
                  </p>
                  {this.props.error && <p>{this.props.error}</p>}
                </Text.Default>
              </Box>
            </Flex>
            {!this.props.error && (
              <CharactersList characters={this.state.characters || this.props.characters} referer="/marvel" />
            )}
          </MainContent>
        </Layout>
      </React.Fragment>
    );
  }
}

Marvel.getInitialProps = async ({ req }) => {
  const res = await axios
    .get('https://api.comiccruncher.com/publishers/marvel?key=batmansmellsbadly')
    .catch((error) => {
      return { error: error.toString() };
    });
  return {
    error: res.hasOwnProperty('error') ? res.error : null,
    characters: res.hasOwnProperty('data') ? res.data : [],
  };
};

Marvel.propTypes = {
  error: PropTypes.string,
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Marvel);
