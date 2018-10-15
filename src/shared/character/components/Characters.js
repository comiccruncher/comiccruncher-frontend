import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCharacters } from '../store/reducer';
import { Box, Flex } from 'grid-styled';

const mapStateToProps = (state) => ({ ...state.characters.data });
const mapDispatchToProps = {
  getCharacters,
};

class Characters extends React.Component {
  state = {
    isEnabled: true,
    currentPage: 1,
    pagination: {
      previous_page: null,
      current_page: null,
      next_page: null,
    },
    data: [],
  };

  onClick = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };

  render() {
    return (
      <div>
        <Helmet defaultTitle="All Characters" titleTemplate="%s – Comic Cruncher" />
        <Flex>
          <Box width={1} px={10}>
            <h2>Characters</h2>
          </Box>
        </Flex>
      </div>
    );
  }
}

const pageShape = PropTypes.shape({
  number: PropTypes.number,
  link: PropTypes.string,
});

Characters.propTypes = {
  pagination: PropTypes.shape({
    per_page: PropTypes.number,
    previous_page: pageShape,
    current_page: pageShape,
    next_page: pageShape,
  }),
  characters: PropTypes.arrayOf(
    PropTypes.shape({
      publisher: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
      }).isRequired,
      name: PropTypes.string.isRequired,
      other_name: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      slug: PropTypes.string.isRequired,
      vendor_image: PropTypes.string,
      vendor_url: PropTypes.string,
      vendor_description: PropTypes.string,
    })
  ),
};

Characters.serverFetch = getCharacters;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Characters)
);
