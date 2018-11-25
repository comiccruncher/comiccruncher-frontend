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
import { HeadingH1, Text } from '../components/shared/styles/type';
import { Brands } from '../components/shared/styles/colors';

class Trending extends React.Component {
  state = {
    isLoading: false,
  };

  render() {
    return (
      <React.Fragment>
        <Layout title={'Marvel Comics | Popular Characters | Comic Cruncher'}>
          <MainHeader background={Brands.Marvel}>
            <Flex>
              <Box width={1152} m="0 auto" p={3}>
                <h1>Trending</h1>
                <Search />
              </Box>
            </Flex>
          </MainHeader>
          <MainContent>
            <Flex flexWrap={'wrap'} m={'30px auto'} p={3}>
              <Box width={[1]}>
                <HeadingH1>Trending Marvel Characters</HeadingH1>
                <Text.Default>
                  <p>
                    This page shows trending Marvel characters by <strong>main</strong> appearances only (no alternate
                    realities)!
                  </p>
                </Text.Default>
              </Box>
            </Flex>
            <CharactersList characters={this.state.characters || this.props.characters} referer="/trending" />
          </MainContent>
        </Layout>
      </React.Fragment>
    );
  }
}

Trending.getInitialProps = async ({ req }) => {
  const res = await axios.get('https://api.comiccruncher.com/trending/marvel?key=batmansmellsbadly');
  return {
    characters: res.data,
  };
};

Trending.propTypes = {
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default Trending;
