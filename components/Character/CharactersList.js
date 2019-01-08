import React from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import getConfig from 'next/config';
import axios from 'axios';
import styled from 'react-emotion';
import Cookies from 'universal-cookie';
import { Flex, Box } from 'rebass/emotion';
import { CharacterCard } from './CharacterCard';
import Button from '../shared/components/Button';
import { RankedCharacterProps } from './Types';
import CharacterModal from './CharacterModal';
import { LoadingSVG } from '../shared/components/Icons';
import { Text } from '../shared/styles/type';
import { Event, TrackEvent, TrackError, TrackPageviewP } from '../ga/Tracker';
import { getCookieHeaders } from '../../pages/_utils';
import { withCache } from '../emotion/cache';

const cookie = new Cookies();
const { baseURL, charactersURL } = getConfig().publicRuntimeConfig.API;

const CharacterLink = styled.a({
  textDecoration: 'none',
});

const CharacterItem = ({ character, requestedSlug, handleModalOpenRequest }) => {
  return (
    <Box pr={3} pb={3} width={[1, 1 / 3, 1 / 3, 1 / 4]}>
      <CharacterLink href={`/characters/${character.slug}`} onClick={handleModalOpenRequest}>
        <CharacterCard character={character} isLoading={requestedSlug === character.slug} />
      </CharacterLink>
    </Box>
  );
};

CharacterItem.propTypes = {
  character: RankedCharacterProps.isRequired,
  requestedSlug: PropTypes.string,
  handleModalOpenRequest: PropTypes.func.isRequired,
};

const getNextPage = async (url) => {
  return await axios
    .get(url, getCookieHeaders(cookie))
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      TrackError(error.toString(), false);
      return error;
    });
};

const getCharacter = async (slug) => {
  return await axios
    .get(`${charactersURL}/${encodeURIComponent(slug)}`, getCookieHeaders(cookie))
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      TrackError(error.toString(), false);
      return error;
    });
};

class CharactersList extends React.Component {
  static propTypes = {
    router: PropTypes.instanceOf(Router),
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

  state = {
    characters: [],
    hasMoreItems: true,
    nextHref: null,
    error: null,
    characterModal: null,
    isNextPageLoading: false,
    requestedCharacterSlug: null,
  };

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
    getNextPage(link)
      .then((res) => {
        const body = res.data;
        Event('LoadMore', 'click', link);
        this.setState((prevState) => ({
          characters: prevState.characters.concat(body.data),
          isNextPageLoading: false,
        }));
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
    const modal = this.state.characterModal;
    if (modal === null) {
      return;
    }
    this.setState(
      {
        characterModal: null,
        requestedCharacterSlug: null,
      },
      () => {
        const { router } = this.props;
        // Check if it's the `/index` page...we want to push it as `/`. Otherwise, use normally.
        const pushAs = router.route === '/index' ? '/' : router.route;
        TrackEvent('modal', 'close', modal.slug).then(() => router.push(pushAs, pushAs, { shallow: true }));
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
    getCharacter(slug)
      .then((resp) => {
        const data = resp.data;
        const localUrl = `/characters/${slug}`;
        this.setState({ characterModal: data }, () => {
          // todo: fix document.title and <Layout> so we get a dynamic title.
          const title = `${data.name} ${data.other_name && `(${data.other_name})`} | Comic Cruncher`;
          Promise.all([TrackEvent('modal', 'open', slug), TrackPageviewP(localUrl, title)]).then(() => {
            const router = this.props.router;
            // Must use `{ shallow: true }` so modals load for other pages.
            router.push(`${router.route}?character=${slug}`, localUrl, { shallow: true });
          });
        });
      })
      .catch((err) => {
        this.setState({ error: err.toString() });
      });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenBeforePopState = () => {
    const router = this.props.router;
    const route = router.route;
    router.beforePopState(({ url, as, options }) => {
      // If current page or we're on the index page. Above, if it's the index page
      // we pushed it as `/` and not `/index`.
      if (as === route || (as === '/' && route === '/index')) {
        this.handleModalCloseRequest();
      }
      if (url.includes(`${route}?character=`) || url.includes('/character?slug=')) {
        // Force SSR refresh so it doesn't try loading a character page JS.
        window.location.href = as;
        return false;
      }
      return true;
    });
  };

  render() {
    const initial = this.props.characters.data;
    const { characters, characterModal, requestedCharacterSlug, hasMoreItems, isNextPageLoading, error } = this.state;
    return (
      <React.Fragment>
        <Flex flexWrap="wrap" alignItems="center" alignContent="center" pl={3}>
          {initial &&
            initial.map((character, i) => {
              return (
                <CharacterItem
                  character={character}
                  requestedSlug={requestedCharacterSlug}
                  // Bug?? this.setState not a function??
                  handleModalOpenRequest={(e) => this.handleModalOpenRequest(e, character.slug)}
                  key={character.slug}
                />
              );
            })}
          {characters &&
            characters.map((character, i) => {
              return (
                <CharacterItem
                  character={character}
                  requestedSlug={requestedCharacterSlug}
                  handleModalOpenRequest={(e) => this.handleModalOpenRequest(e, character.slug)}
                  key={character.slug}
                />
              );
            })}
        </Flex>
        <Flex justifyContent="center" alignItems="center" alignContent="center" py={24}>
          <Box alignSelf="center">
            {initial &&
              hasMoreItems &&
              !isNextPageLoading && (
                <Button type="primary" onClick={this.loadData} style={{ textAlign: 'center' }}>
                  Load More
                </Button>
              )}
            {!error && isNextPageLoading && <LoadingSVG />}
            {error && (
              <Text.Default>
                <p>{error}.</p>
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

export default withRouter(CharactersList);
