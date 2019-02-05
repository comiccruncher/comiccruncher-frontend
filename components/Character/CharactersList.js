import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
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
import { Event, TrackEvent, TrackError } from '../ga/Tracker';
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
      throw new Error(error.toString());
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
      throw new Error(error.toString());
    });
};

class CharactersList extends React.Component {
  static propTypes = {
    router: PropTypes.object,
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
    width: 0,
  };

  componentDidMount() {
    this.listenBeforePopState();
    this.setState({ width: window.innerWidth });
  }

  /**
   * Loads data for the next page.
   */
  loadData = () => {
    this.setState({ isNextPageLoading: true });
    const { characters, router } = this.props;
    let link = baseURL + characters.meta.pagination.next_page;
    const { nextHref } = this.state;
    if (nextHref) {
      link = nextHref;
    }
    getNextPage(link)
      .then((res) => {
        const body = res.data;
        Event(router.asPath, 'load more', link);
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
        const pushAs = router.route;
        TrackEvent('modal', 'close', modal.slug).then(() => router.push(pushAs, pushAs, { shallow: true }));
      }
    );
  };

  /**
   * Shows the character modal.
   */
  handleModalOpenRequest = (slug) => (e) => {
    e.preventDefault();
    if (this.state.width < 767) {
      // force ssr-refresh
      window.location.href = `/characters/${slug}`;
      //  router.push(`/characters?slug=${slug}`, `/characters/${slug}`, { shallow: false });
    } else {
      this.setState({ requestedCharacterSlug: slug }, () => {
        this.loadCharacter(slug);
      });
    }
  };

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
          TrackEvent('modal', 'open', slug).then(() => {
            const router = this.props.router;
            // Must use `{ shallow: true }` so modals load for other pages.
            router.push(`${router.route}?character=${slug}`, localUrl, { shallow: true });
          });
        });
      })
      .catch((err) => {
        this.setState({ error: err.toString(), requestedCharacterSlug: null });
      });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenBeforePopState = () => {
    const router = this.props.router;
    const route = router.route;
    router.beforePopState(({ url, as, options }) => {
      // If current page..
      if (as === route) {
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
    const data = this.props.characters.data;
    const { characters, characterModal, requestedCharacterSlug, hasMoreItems, isNextPageLoading, error } = this.state;
    return (
      <Fragment>
        <Flex flexWrap="wrap" alignItems="center" alignContent="center" pl={3}>
          {data &&
            data.map((character) => {
              const slug = character.slug;
              return (
                <CharacterItem
                  character={character}
                  requestedSlug={requestedCharacterSlug}
                  handleModalOpenRequest={this.handleModalOpenRequest(slug)}
                  key={slug}
                />
              );
            })}
          {characters &&
            characters.map((character) => {
              const slug = character.slug;
              return (
                <CharacterItem
                  character={character}
                  requestedSlug={requestedCharacterSlug}
                  handleModalOpenRequest={this.handleModalOpenRequest(slug)}
                  key={slug}
                />
              );
            })}
        </Flex>
        <Flex justifyContent="center" alignItems="center" alignContent="center" py={24}>
          <Box alignSelf="center">
            {error ? (
              <Text.Default>
                <p>{error}.</p>
              </Text.Default>
            ) : (
              hasMoreItems &&
              !isNextPageLoading && (
                <Button type="primary" onClick={this.loadData} textAlign="center">
                  Load More
                </Button>
              )
            )}
            {!error && isNextPageLoading && <LoadingSVG />}
          </Box>
        </Flex>
        <CharacterModal
          handleModalCloseRequest={this.handleModalCloseRequest}
          character={characterModal}
          isOpen={characterModal ? true : false}
        />
      </Fragment>
    );
  }
}

export default withRouter(CharactersList);
