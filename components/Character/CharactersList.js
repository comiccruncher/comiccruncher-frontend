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
import Layout from '../Layout/Layout';
import { LoadingIcon } from '../shared/components/Icons';

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
    let link = 'https://api.comiccruncher.com' + this.props.characters.meta.pagination.next_page.link;
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
          this.setState({ nextHref: 'https://api.comiccruncher.com' + nextPage.link });
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
    if (!this.state.wasModalOpened) {
      this.setState({ wasModalOpened: true });
    }
    this.showCharacter(key);
  };

  /**
   * Closes the modal and propagates the history change.
   */
  handleModalCloseRequest = () => {
    this.closeModal();
    Router.push(this.props.referer);
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
  showCharacter = (slug) => {
    slug = encodeURIComponent(slug);
    Router.push(`${this.props.referer}?character=${slug}`, `/characters/${slug}`);
    if (this.state.currentModal) {
      this.handleModalCloseRequest();
      return;
    }
    this.loadCharacter(slug);
  };

  /**
   * Loads the character.
   */
  loadCharacter = (slug) => {
    const link = 'https://api.comiccruncher.com/characters/' + encodeURIComponent(slug) + '?key=batmansmellsbadly';
    request.get(link).then((res) => {
      this.setState({ currentCharacter: res.body.data, currentModal: slug });
    });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenOnRouteChangeComplete = () => {
    Router.onRouteChangeComplete = (route) => {
      console.log(route);
      if (this.state.wasModalOpened) {
        if (route === this.props.referer) {
          this.closeModal();
          return;
        }
        const currentCharacter = Router.query.character;
        if (currentCharacter !== this.state.currentModal) {
          this.showCharacter(currentCharacter);
        }
      }
    };
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
                  <Button
                    onClick={this.handleModalCloseRequest}
                    style={{ position: 'absolute', top: Spacing.Small, right: Spacing.Small, zIndex: 20 }}
                  >
                    Close
                  </Button>
                  <FullCharacter {...this.state.currentCharacter} />
                </Modal>
                <a href={`/characters/${character.slug}`} onClick={this.toggleModal(character.slug)}>
                  <CharacterCard {...character} />
                </a>
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

const pageProps = PropTypes.shape({
  number: PropTypes.number,
  link: PropTypes.string,
});

CharactersList.propTypes = {
  onDismissModal: PropTypes.func,
  onShowCharacter: PropTypes.func,
  referer: PropTypes.string,
  characters: PropTypes.shape({
    meta: PropTypes.shape({
      status_code: PropTypes.number,
      error: PropTypes.string,
      pagination: PropTypes.shape({
        per_page: PropTypes.number,
        previous_page: pageProps,
        current_page: pageProps,
        next_page: pageProps,
      }),
    }),
    data: PropTypes.arrayOf(RankedCharacterProps),
  }),
};

Modal.setAppElement('#__next');

// TODO: Fix modal for marvel and dc route!!!
export default withRouter(CharactersList);
