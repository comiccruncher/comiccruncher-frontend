import React from 'react';
import PropTypes from 'prop-types';
import Router, { withRouter } from 'next/router';
import request from 'superagent';
import { Flex, Box } from '@rebass/grid/emotion';
import { CharacterCard } from './CharacterCard';
import Button from '../shared/components/Button';
import Modal from 'react-modal';
import { CharacterProps } from './Types';
import FullCharacter from './FullCharacter';

Modal.setAppElement('#__next');

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
    };
  }

  componentDidMount() {
    this.listenOnRouteChangeComplete();
  }

  /**
   * Loads data for the next page.
   */
  loadData = () => {
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
        }));
        if (body.meta.pagination.next_page) {
          const nextHref = 'https://api.comiccruncher.com' + body.meta.pagination.next_page.link;
          this.setState({ nextHref: nextHref });
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
    Router.push('/');
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
    Router.push(`/?character=${slug}`, `/characters/${slug}`);
    if (this.state.currentModal) {
      this.handleModalCloseRequest();
      return;
    }

    this.setState({
      currentModal: slug,
    });
  };

  /**
   * Listens on when the route changes and handles opening the modal.
   */
  listenOnRouteChangeComplete = () => {
    Router.onRouteChangeComplete = (route) => {
      if (this.state.wasModalOpened) {
        if (route === '/') {
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
      <div>
        <Flex flexWrap="wrap" mx={-2}>
          {characters.map((character, i) => {
            return (
              <Box px={2} py={2} width={1 / 4} key={character.slug}>
                <Modal
                  id={character.slug}
                  onRequestClose={this.handleModalCloseRequest}
                  isOpen={currentModal === character.slug}
                  shouldCloseOnOverlayClick={true}
                >
                  {/* TODO: load appearances in go app */}
                  <FullCharacter {...character} />
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
            {this.state.hasMoreItems && (
              <Button type="primary" onClick={this.loadData} style={{textAlign: 'center'}}>
                Load More
              </Button>
            )}
          </Box>
        </Flex>
      </div>
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
    data: PropTypes.arrayOf(CharacterProps),
  }),
};

export default withRouter(CharactersList);
