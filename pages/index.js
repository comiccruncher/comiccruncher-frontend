import React from 'react';
import request from 'superagent';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import PropTypes from 'prop-types';
import Search from '../components/Search/Search';
import Head from 'next/head';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { Stats } from '../components/Stats/Stats';
import { MainHeader } from '../components/Layout/Header';
import { MainContent, ContentBlock } from '../components/Layout/Content';
import { HeadingH1 } from '../components/shared/styles/type';
import Button from '../components/shared/components/Button';
import { css } from 'react-emotion';
import { LoadingIcon } from '../components/shared/components/Icons';
import Layout from '../components/Layout/Layout';

const buttonDiv = css({
  'text-align': 'right',
  '@media (max-width: 640px)': {
    'text-align': 'left',
  },
});

// TODO: center loading icon
const loadingDiv = css({
  margin: '0 auto',
});

export class Home extends React.Component {
  state = {
    isMain: true,
    isAlternate: true,
    isLoading: false,
    characters: null,
  };

  handleButton = (e, category) => {
    e.preventDefault();
    if (this.state.isMain || this.state.isAlternate) {
      this.setState({ isLoading: true });
    }
    if (category === `main`) {
      this.setState({ isMain: !this.state.isMain }, this.loadCharacters);
    }
    if (category === `alternate`) {
      this.setState({ isAlternate: !this.state.isAlternate }, this.loadCharacters);
    }
  };

  loadCharacters = (s) => {
    if (!this.state.isMain && !this.state.isAlternate) {
      return;
    }
    let query = '';
    if (!this.state.isMain && this.state.isAlternate) {
      query = 'alternate';
    }
    if (!this.state.isAlternate && this.state.isMain) {
      query = 'main';
    }
    let url = `https://api.comiccruncher.com/characters?key=batmansmellsbadly&type=${encodeURIComponent(query)}`;
    request.get(url).then((result) => {
      console.log(url);
      console.log(result.body);
      this.setState({ characters: result.body, isLoading: false });
    });
  };

  render() {
    return (
      <React.Fragment>
        <Layout>
          <Head>
            <title>Home | Popular Characters | Comic Cruncher</title>
          </Head>
          <MainHeader>
            <div css={{ 'margin-top': '65px' }}>
              <ContentBlock>
                <Flex flexWrap="wrap" alignItems="center" alignContent="center">
                  <Stats total_characters={1000} total_appearances={200000} total_issues={60000} min_year={1938} />
                </Flex>
              </ContentBlock>
            </div>
            <div css={{ 'margin-top': '50px' }}>
              <ContentBlock width={1152} p={3}>
                <Search />
              </ContentBlock>
            </div>
          </MainHeader>
          <MainContent>
            <ContentBlock pl={3} pr={0} pb={0} pt={0}>
              <Flex flexWrap={'wrap'} m={'30px auto'}>
                <Box width={[1, 2 / 4, 2 / 4, 2 / 4]}>
                  <HeadingH1>Popular Characters</HeadingH1>
                  {this.state.isMain && !this.state.isAlternate && <p>Main Appearances Only</p>}
                  {this.state.isAlternate && !this.state.isMain && <p>Alternate Appearances Only</p>}
                </Box>
                <Box width={[1, 2 / 4, 2 / 4, 2 / 4]} css={buttonDiv} pr={3}>
                  <Button
                    isInactive={!this.state.isMain}
                    style={{ 'margin-right': '10px' }}
                    type={'dark'}
                    onClick={(e) => this.handleButton(e, 'main')}
                  >
                    Main
                  </Button>
                  <Button
                    isInactive={!this.state.isAlternate}
                    type={'dark'}
                    onClick={(e) => this.handleButton(e, 'alternate')}
                  >
                    Alternate
                  </Button>
                </Box>
              </Flex>
              {(this.state.isMain || this.state.isAlternate) &&
                !this.state.isLoading && (
                  <CharactersList characters={this.state.characters || this.props.characters} referer="/" />
                )}
              {this.state.isLoading && (
                <div css={loadingDiv}>
                  <LoadingIcon />
                </div>
              )}
            </ContentBlock>
          </MainContent>
        </Layout>
      </React.Fragment>
    );
  }
}

Home.getInitialProps = async ({ req }) => {
  // TODO: hash history
  const res = await request.get('https://api.comiccruncher.com/stats?key=batmansmellsbadly');
  const res2 = await request.get('https://api.comiccruncher.com/characters?key=batmansmellsbadly');
  return {
    stats: res.body,
    characters: res2.body,
  };
};

Home.propTypes = {
  stats: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.shape({
      total_characters: PropTypes.number,
      total_appearances: PropTypes.number,
      min_year: PropTypes.number,
      max_year: PropTypes.number,
      total_issues: PropTypes.number,
    }),
  }),
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(Home);
