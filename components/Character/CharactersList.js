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
    <Box pr={3} pb={3} width={[1, 1 / 2, 1 / 3, 1 / 4]}>
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

const CharacterItemList = ({ characters, requestedSlug, handleModalOpenRequest }) => {
  if (!characters) {
    return null;
  }
  return characters.map((character) => {
    const slug = character.slug;
    return (
      <CharacterItem
        character={character}
        requestedSlug={requestedSlug}
        handleModalOpenRequest={handleModalOpenRequest(slug)}
        key={slug}
      />
    );
  });
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

const getInitialState = () => {
  return {
    characters: [], // TODO: this should be removed and we should only have props.
    hasMoreItems: true,
    nextHref: null,
    error: null,
    characterModal: null,
    isNextPageLoading: false,
    requestedCharacterSlug: null,
  };
};

const isURLChanged = (curr, next) => {
  const currentChars = curr.characters;
  const nextChars = next.characters;
  const currentPage = currentChars ? currentChars.meta.pagination.current_page : '';
  const nextPage = nextChars ? nextChars.meta.pagination.current_page : '';
  if (currentPage.substring(0, currentPage.indexOf('?')) !== nextPage.substring(0, nextPage.indexOf('?'))) {
    return true;
  }
  return false;
};

const IS_CLICKED = 'comiccruncher.isCharacterClicked';

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
    ...getInitialState(),
  };

  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.handleModalCloseRequest = this.handleModalCloseRequest.bind(this);
    //this.handleModalOpenRequest = this.handleModalOpenRequest.bind(this);
    this.resetCharacterModal = this.resetCharacterModal.bind(this);
    this.loadCharacter = this.loadCharacter.bind(this);
    this.listenBeforePopState = this.listenBeforePopState.bind(this);
  }

  componentDidMount() {
    if (window.innerWidth <= 767) {
      const wasClicked = sessionStorage.getItem(IS_CLICKED);
      if (wasClicked === '1') {
        window.scrollTo(0, sessionStorage.getItem(`comiccruncher.${this.props.router.route}.lastScrollY`));
        sessionStorage.setItem(IS_CLICKED, 0);
      }
    }
    this.listenBeforePopState();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (isURLChanged(this.props, nextProps)) {
      this.setState(getInitialState());
    }
    return true;
  }

  /**
   * Loads data for the next page.
   */
  loadData() {
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
  }

  /**
   * Closes the modal and propagates the history change.
   */
  handleModalCloseRequest() {
    const modal = this.state.characterModal;
    if (modal === null) {
      sessionStorage.setItem(IS_CLICKED, 1);
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
  }

  /**
   * Shows the character modal.
   */
  handleModalOpenRequest = (slug) => (e) => {
    e.preventDefault();
    if (window.innerWidth <= 767) {
      sessionStorage.setItem(`comiccruncher.${this.props.router.route}.lastScrollY`, window.scrollY);
      //window.location = `/characters/${slug}`;
      this.props.router.push(`/characters?slug=${slug}`, `/characters/${slug}`);
      return;
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
  loadCharacter(slug) {
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
            router.push(`${router.route}?characters=${slug}`, localUrl, { shallow: true });
          });
        });
      })
      .catch((err) => {
        this.setState({ error: err.toString(), requestedCharacterSlug: null });
      });
  }

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenBeforePopState() {
    const router = this.props.router;
    const route = router.route;
    router.beforePopState(({ url, as, options }) => {
      // If current page..
      if (as === route) {
        this.handleModalCloseRequest();
      }
      return true;
    });
  }

  render() {
    const data = this.props.characters.data;
    const { characters, characterModal, requestedCharacterSlug, hasMoreItems, isNextPageLoading, error } = this.state;
    return (
      <Fragment>
        <Flex flexWrap="wrap" alignItems="center" alignContent="center" pl={3}>
          <CharacterItemList
            characters={data.concat(characters)}
            requestedSlug={requestedCharacterSlug}
            handleModalOpenRequest={this.handleModalOpenRequest}
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center" alignContent="center" py={24}>
          <Box alignSelf="center">
            {error ? (
              <Text.Default>{error}.</Text.Default>
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
