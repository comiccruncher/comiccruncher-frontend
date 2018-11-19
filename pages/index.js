import React from 'react';
import request from 'superagent';
import { withRouter } from 'next/router';
import { Flex, Box } from 'rebass/emotion';
import Type, { Section } from '../components/shared/styles/type';
import Spacing from '../components/shared/styles/spacing';
import PropTypes from 'prop-types';
import Search from '../components/Search/Search';
import CharactersList from '../components/Character/CharactersList';
import { RankedCharacterProps } from '../components/Character/Types';
import { Stats } from '../components/Stats/Stats';
import { MainHeader } from '../components/Layout/Header';
import { MainContent, ContentBlock } from '../components/Layout/Content';
import { HeadingH1, Text } from '../components/shared/styles/type';
import Button from '../components/shared/components/Button';
import { LoadingIcon } from '../components/shared/components/Icons';
import Layout from '../components/Layout/Layout';
import { css } from 'react-emotion';
import { withCache } from '../components/emotion/cache';

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
    const url = `https://api.comiccruncher.com/characters`;
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
    request
      .get(url)
      .query({ key: 'batmansmellsbadly', type: query })
      .then((result) => {
        this.setState({ characters: result.body, isLoading: false });
      });
  };

  render() {
    return (
      <React.Fragment>
        <Layout title={'Home | All-Time Popular Characters | Comic Cruncher'}>
          <MainHeader>
            <div css={{ paddingBottom: Spacing.xxLarge * 2, paddingTop: Spacing.xxLarge, }}>
              <ContentBlock>
                <Flex flexWrap="wrap" alignItems="center" alignContent="center">
                  <Stats {...this.props.stats.data} />
                </Flex>
              </ContentBlock>
            </div>
            <div>
              <ContentBlock width={1152} p={3}>
                <Search />
              </ContentBlock>
            </div>
          </MainHeader>
          <MainContent>
            <ContentBlock pl={3} pr={0} pb={0} pt={0}>
              <Flex flexWrap={'wrap'} m={'30px auto'}>
                <Box width={[1, 2 / 4, 2 / 4, 2 / 4]}>
                  <Section.Title><h1>Popular Characters</h1></Section.Title>
                  {this.state.isMain && !this.state.isAlternate && <Section.Byline>Main Appearances Only</Section.Byline>}
                  {this.state.isAlternate && !this.state.isMain && <Section.Byline>Alternate Appearances Only</Section.Byline>}
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

export default withCache(withRouter(Home));
