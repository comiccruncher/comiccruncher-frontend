import React from 'react';
import request from 'superagent';
import { Flex, Box } from '@rebass/grid/emotion';
import { CharacterCard } from './CharacterCard';
import Button from '../shared/components/Button';
import PropTypes from 'prop-types';

class CharactersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      data: [],
      hasMoreItems: true,
      nextHref: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    let url = this.props.url || 'https://api.comiccruncher.com/characters?key=batmansmellsbadly';
    if (this.state.nextHref) {
      url = this.state.nextHref;
    }
    request
      .get(url)
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
  render() {
    const characters = this.state.data;
    return (
      <div>
        <Flex flexWrap="wrap" mx={-2}>
          {characters.map((character, i) => {
            return (
              <Box px={2} py={2} width={1 / 4} key={character.slug}>
                <CharacterCard {...character} />
              </Box>
            );
          })}
        </Flex>
        <Flex>
          {this.state.hasMoreItems && (
            <Button type="primary" onClick={this.loadData}>
              Load More
            </Button>
          )}
        </Flex>
      </div>
    );
  }
}

CharactersList.propTypes = {
  url: PropTypes.string,
};

export default CharactersList;
