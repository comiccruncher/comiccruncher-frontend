import React from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import request from 'superagent';
import { Flex, Box } from 'rebass/emotion';
import { CharacterCard } from './CharacterCard';
import Button from '../shared/components/Button';
import Modal from 'react-modal';
import { RankedCharacterProps } from './Types';
import FullCharacter from './FullCharacter';
import Spacing from '../shared/styles/spacing';
import { LoadingIcon } from '../shared/components/Icons';
import { withCache } from '../emotion/cache';
import styled from 'react-emotion';

const characterURL = `https://api.comiccruncher.com/characters`;

const CharacterLink = styled.a({
  textDecoration: 'none',
});

class CharactersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.characters.data, // an anti-pattern? w/e for now.
      hasMoreItems: true,
      nextHref: null,
      error: null,
      currentModal: null,
      wasModalOpened: false,
      currentCharacter: null,
      isLoading: false,
      isModalLoading: false,
    };
  }

  componentDidMount() {
    this.listenOnRouteChangeComplete();
  }

  getParent = (element) => {
    const document = typeof document === 'undefined' ? '' : document;
    if (document) {
      return document.querySelector(element);
    }
  };

  /**
   * Loads data for the next page.
   */
  loadData = () => {
    this.setState({ isLoading: true });
    let link = 'https://api.comiccruncher.com' + this.props.characters.meta.pagination.next_page;
    if (this.state.nextHref) {
      link = this.state.nextHref;
    }
    request
      .get(link)
      .then((res) => {
        const body = res.body;
        this.setState((prevState) => ({
          data: prevState.data.concat(body.data),
          isLoading: false,
        }));
        const nextPage = body.meta.pagination.next_page;
        if (nextPage) {
          this.setState({ nextHref: 'https://api.comiccruncher.com' + nextPage });
        } else {
          this.setState({ hasMoreItems: false, nextHref: null });
        }
      })
      .catch((err) => {
        this.setState({ error: 'Error loading page!! :(' });
      });
  };

  /**
   * Toggles the modal so that it shows the character.
   */
  toggleModal = (key) => (event) => {
    event.preventDefault();
    this.setState({ isModalLoading: true });
    if (!this.state.wasModalOpened) {
      this.setState({ wasModalOpened: true });
    }
    this.showCharacter(key);
  };

  /**
   * Closes the modal and propagates the history change.
   */
  handleModalCloseRequest = () => {
    Router.push(this.props.referer);
    this.closeModal();
  };

  /**
   * Closes the modal.
   */
  closeModal = () => {
    this.setState({
      currentModal: null,
    });
  };

  /**
   * Shows the character modal.
   */
  showCharacter(e, slug) {
    e.preventDefault();
    slug = encodeURIComponent(slug);
    Router.push(`${this.props.referer}?character=${slug}`, `/characters/${slug}`);
    if (this.state.currentModal) {
      this.handleModalCloseRequest();
      return;
    }
    this.loadCharacter(slug);
  }

  /**
   * Loads the character.
   */
  loadCharacter = (slug) => {
    const link = `${characterURL}/${encodeURIComponent(slug)}`;
    request
      .get(link)
      .query({ key: 'batmansmellsbadly' })
      .then((res) => {
        this.setState({ currentCharacter: res.body.data, currentModal: slug, isModalLoading: false });
      });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenOnRouteChangeComplete = () => {
    Router.onRouteChangeComplete = (route) => {
      if (this.state.wasModalOpened) {
        if (route === this.props.referer) {
          this.closeModal();
          return;
        }
        const requested = Router.query.character;
        if (requested !== this.state.currentModal) {
          this.showCharacter(requested);
        }
      }
    };

    Router.beforePopState(({ url, as, options }) => {
      if (as === this.props.referer) {
        this.handleModalCloseRequest();
      }
      console.log(url);
      if (url.includes(`${this.props.referer}?character=`) || url.includes('/character?slug=')) {
        window.location.href = as;
        return false;
      }
      return true;
    });
  };

  render() {
    const characters = this.state.data;
    const currentModal = this.state.currentModal;
    return (
      <React.Fragment>
        <Flex flexWrap="wrap" alignItems="center" alignContent="center">
          {characters.map((character, i) => {
            return (
              <Box pr={3} pb={3} width={[1, 1 / 2, 1 / 3, 1 / 4]} key={character.slug}>
                <Modal
                  closeTimeoutMS={500}
                  className="Modal"
                  overlayClassName="Overlay"
                  id={character.slug}
                  onRequestClose={this.handleModalCloseRequest}
                  isOpen={currentModal === character.slug}
                  shouldCloseOnOverlayClick={true}
                  parentSelector={() => document.querySelector('#__next')}
                >
                  {/* TODO: Add loading icon. */}
                  <Button
                    onClick={this.handleModalCloseRequest}
                    style={{ position: 'absolute', top: Spacing.Small, right: Spacing.Small, zIndex: 20 }}
                  >
                    Close
                  </Button>
                  <FullCharacter {...this.state.currentCharacter} />
                </Modal>
                <CharacterLink href={`/characters/${character.slug}`} onClick={(e) => this.showCharacter(e, character.slug)}>
                  <CharacterCard {...character} />
                </CharacterLink>
              </Box>
            );
          })}
        </Flex>
        <Flex justifyContent="center" alignItems="center" alignContent="center" py={24}>
          <Box alignSelf="center">
            {this.state.hasMoreItems &&
              !this.state.isLoading && (
                <Button type="primary" onClick={this.loadData} style={{ textAlign: 'center' }}>
                  Load More
                </Button>
              )}
            {this.state.isLoading && <LoadingIcon />}
          </Box>
        </Flex>
      </React.Fragment>
    );
  }
}

CharactersList.propTypes = {
  onDismissModal: PropTypes.func,
  onShowCharacter: PropTypes.func,
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

Modal.setAppElement('#__next');

// TODO: Fix modal for marvel and dc route!!!
export default withCache(withRouter(CharactersList));
