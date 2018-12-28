import React from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import getConfig from 'next/config';
import ReactGA from 'react-ga';
import axios from 'axios';
import styled from 'react-emotion';
import { Flex, Box } from 'rebass/emotion';
import { CharacterCard } from './CharacterCard';
import Button from '../shared/components/Button';
import { RankedCharacterProps } from './Types';
import CharacterModal from './CharacterModal';
import { LoadingSVG } from '../shared/components/Icons';
import { Text } from '../shared/styles/type';
import { withCache } from '../emotion/cache';

const { baseURL, charactersURL } = getConfig().publicRuntimeConfig.API;

const CharacterLink = styled.a({
  textDecoration: 'none',
});

class CharactersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: props && props.hasOwnProperty('characters') ? props.characters.data : [],
      hasMoreItems: true,
      nextHref: null,
      error: null,
      characterModal: null,
      isNextPageLoading: false,
      requestedCharacterSlug: null,
    };
  }

  componentDidMount() {
    this.listenBeforePopState();
  }

  /**
   * Loads data for the next page.
   */
  loadData = () => {
    this.setState({ isNextPageLoading: true });
    let link = baseURL + this.props.characters.meta.pagination.next_page;
    if (this.state.nextHref) {
      link = this.state.nextHref;
    }
    axios
      .get(link)
      .then((res) => {
        const body = res.data;
        this.setState(
          (prevState) => ({
            characters: prevState.characters.concat(body.data),
            isNextPageLoading: false,
          }),
          ReactGA.event({
            category: `CharacterList:LoadMore`,
            action: 'click',
            label: link,
          })
        );
        const nextPage = body.meta.pagination.next_page;
        if (nextPage) {
          this.setState({ nextHref: baseURL + nextPage });
        } else {
          this.setState({ hasMoreItems: false, nextHref: null });
        }
      })
      .catch((err) => {
        this.setState({ error: err.toString() });
      });
  };

  /**
   * Closes the modal and propagates the history change.
   */
  handleModalCloseRequest = () => {
    const slug = this.state.characterModal.slug;
    this.setState(
      {
        characterModal: null,
        requestedCharacterSlug: null,
      },
      () => {
        ReactGA.event({
          category: `CharacterList:Modal:${this.props.referer}`,
          action: 'close',
          label: slug,
        });
        Router.push(this.props.referer, this.props.referer, { shallow: true });
      }
    );
  };

  /**
   * Shows the character modal.
   */
  handleModalOpenRequest(e, slug) {
    e.preventDefault();
    this.setState({ requestedCharacterSlug: slug }, () => {
      this.loadCharacter(slug);
    });
  }

  resetCharacterModal() {
    this.setState({ characterModal: null });
  }

  /**
   * Loads the character.
   */
  loadCharacter = (slug) => {
    this.resetCharacterModal();
    slug = encodeURIComponent(slug);
    const link = `${charactersURL}/${slug}`;
    axios
      .get(link, { params: { key: 'batmansmellsbadly' } })
      .then((res) => {
        const data = res.data.data;
        this.setState({ characterModal: data }, () => {
          // todo: fix document.title and <Layout> so we get a dynamic title.
          //document.title = `${data.name} ${data.other_name && `(${data.other_name})`} | Comic Cruncher`;
          // Must use `{ shallow: true }` so modals load for other pages.
          Router.push(`${this.props.referer}?character=${slug}`, `/characters/${slug}`, { shallow: true });
          ReactGA.event({
            category: `CharacterList:Modal:${this.props.referer}`,
            action: 'open',
            label: slug,
          });
        });
      })
      .catch((error) => {
        this.setState({ error: error.toString() });
      });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenBeforePopState = () => {
    Router.beforePopState(({ url, as, options }) => {
      if (as === this.props.referer) {
        this.handleModalCloseRequest();
      }
      if (url.includes(`${this.props.referer}?character=`) || url.includes('/character?slug=')) {
        // Force SSR refresh so it doesn't try loading a character page JS.
        window.location.href = as;
        return false;
      }
      return true;
    });
  };

  render() {
    const { characters, characterModal, requestedCharacterSlug } = this.state;
    return (
      <React.Fragment>
        <Flex flexWrap="wrap" alignItems="center" alignContent="center" pl={3}>
          {characters.map((character, i) => {
            return (
              <Box pr={3} pb={3} width={[1, 1 / 3, 1 / 3, 1 / 4]} key={character.slug}>
                <CharacterLink
                  href={`/characters/${character.slug}`}
                  onClick={(e) => this.handleModalOpenRequest(e, character.slug)}
                >
                  <CharacterCard {...character} isLoading={requestedCharacterSlug === character.slug} />
                </CharacterLink>
              </Box>
            );
          })}
        </Flex>
        <Flex justifyContent="center" alignItems="center" alignContent="center" py={24}>
          <Box alignSelf="center">
            {this.state.hasMoreItems &&
              !this.state.isNextPageLoading && (
                <Button type="primary" onClick={this.loadData} style={{ textAlign: 'center' }}>
                  Load More
                </Button>
              )}
            {!this.state.error && this.state.isNextPageLoading && <LoadingSVG />}
            {this.state.error && (
              <Text.Default>
                <p>{this.state.error}.</p>
              </Text.Default>
            )}
          </Box>
        </Flex>
        <CharacterModal
          handleModalCloseRequest={this.handleModalCloseRequest}
          character={characterModal}
          isOpen={characterModal ? true : false}
        />
      </React.Fragment>
    );
  }
}

CharactersList.propTypes = {
  referer: PropTypes.string,
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
      pagination: PropTypes.shape({
        previous_page: PropTypes.string,
        current_page: PropTypes.string,
        next_page: PropTypes.string,
      }),
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

export default withRouter(CharactersList);
