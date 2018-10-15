import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCharacter } from './store/reducer';
import { Box, Flex } from 'grid-styled';
import CountUp from 'react-countup';
import AppearanceChart from 'shared/components/AppearanceChart';
import {UI} from 'shared/styles/colors';
import Spacing from 'shared/styles/spacing';
import Type, {Title, Section, Text} from 'shared/styles/type';
import Button from 'shared/components/Button';

const mapStateToProps = (state) => ({ ...state.character });
const mapDispatchToProps = {
  getCharacter,
};
const aggregateCountMap = (aggregate) => aggregate.count;
const prevNextReduce = (prev, next) => prev + next;
const getDataSets = (appearances) => {
  return appearances.map((appearance) => {
    return {
      label: appearance.category,
      data: appearance.aggregates.map(aggregateCountMap),
      backgroundColor: appearance.category === 'main' ? 'rgb(54, 162, 235)' : 'rgb(255, 159, 64)',
    };
  });
};

class Character extends React.Component {
  state = {
    isEnabled: true,
    totalAppearanceCount: 0,
    years: [],
    datasets: [],
  };

  componentDidMount() {
    const appearances = this.props.appearances;
    const mainCounts = appearances[0]
      ? appearances[0].aggregates.map(aggregateCountMap).reduce(prevNextReduce)
      : 0;
    const altCounts = appearances[1]
      ? appearances[1].aggregates.map(aggregateCountMap).reduce(prevNextReduce)
      : 0;
    const years = appearances[0]
      ? [appearances[0].aggregates.map((aggregate) => aggregate.year)][0]
      : [];
    const datasets = getDataSets(appearances);
    this.setState({
      years: years,
      datasets: datasets,
      totalAppearanceCount: mainCounts + altCounts,
    });
  }

  onClick = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };

  render() {
    const style = { maxWidth: '100%' };
    const otherName = this.props.other_name ? `(${this.props.other_name})` : '';
    const title = `${this.props.name}`;
    const publisher = `${this.props.publisher.name}`;
    const appearanceCount = this.state.totalAppearanceCount;

    // clean markup
    const regex = /(<([^>]+)>)/ig;
    const bio = this.props.vendor_description.replace(regex, '');

    return (
      <div>
        <Helmet defaultTitle={title} titleTemplate="%s – Comic Cruncher" />
        <Flex>
          <Box width={1 / 2} px={10}>
            <img src={this.props.vendor_image} style={style} />
          </Box>
          <Box width={1 / 2} px={10} style={{backgroundColor: UI.Background.Red, textAlign: 'center'}}>
            <Title.Large>{title}</Title.Large>
            <Title.Byline>{otherName}</Title.Byline>
          </Box>
        </Flex>
        <Flex>
          <Box width={1 / 2} px={10}>
            <Section.Title>Bio</Section.Title>
            <Text.Default>{bio}</Text.Default>
          </Box>
          <Box width={1 / 2} px={10}>
            <Text.Default>{this.state.isEnabled ? 'true' : 'false'}</Text.Default>
            <Button onClick={this.onClick} type="primary">Click Me and watch the above text change</Button>
          </Box>
        </Flex>
        <Flex>
          <Box width={1} px={10}>
            <Section.Title>Appearances</Section.Title>
            <Section.Byline><CountUp end={appearanceCount} /> Appearances</Section.Byline>

            <AppearanceChart
              title={'Appearances'}
              years={this.state.years}
              datasets={this.state.datasets}
            />
          </Box>
        </Flex>
      </div>
    );
  }
}

Character.propTypes = {
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
  appearances: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      aggregates: PropTypes.arrayOf(
        PropTypes.shape({
          year: PropTypes.number.isRequired,
          count: PropTypes.number.isRequired,
        })
      ),
    })
  ),
};

Character.serverFetch = getCharacter;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Character)
);
