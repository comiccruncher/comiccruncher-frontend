import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'rebass/emotion';
import ReactGA from 'react-ga';
import { withRouter } from 'next/router';
import { RankedCharacterProps } from './Types';
import CharacterList from './CharactersList';
import { getMarvelProps, getDCProps, getTrendingProps } from '../../pages/_utils.js';
import styled from 'react-emotion';
import { UI, Brands } from '../shared/styles/colors';
import { UIFontStack, Size } from '../shared/styles/type';
import { LoadingSVG } from '../shared/components/Icons';
import { MainPageFlex, CenterWrap } from '../Layout/Content';

const FormStyle = styled.div({
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: 1.5,
  fontSize: Size.Default,
});

const SelectBox = styled.select({
  border: '2px solid ' + UI.Border.Dark,
  padding: '0 5px',
  margin: ' 0',
  height: '35px',
  width: '175px',
  fontSize: '1em',
});

const VALUES = [{ main: 'All-Time Main' }, { trending: 'Trending' }];
const LS_KEY = (publisher) => `comiccruncher.${publisher}`;

class CharacterListFilter extends Component {
  state = {
    value: 'main',
    characters: null,
    isLoading: false,
  };

  constructor(props) {
    super(props);
    this.handleSelected = this.handleSelected.bind(this);
  }

  getValue() {
    const value = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(LS_KEY(this.props.publisher)) : 'main';
    return VALUES.some((element) => value in element) ? value : '';
  }

  handleSelected(e) {
    e.preventDefault();
    const value = encodeURIComponent(e.target.value);
    const publisher = this.props.publisher;
    // count as page view.
    ReactGA.pageview(`/${publisher}/${value}`);
    this.setState({ value: value, isLoading: true });
    sessionStorage.setItem(LS_KEY(publisher), value);
    switch (value) {
      case 'main':
        const pubFunc = publisher === 'marvel' ? getMarvelProps : getDCProps;
        pubFunc().then((data) => {
          this.setState({ characters: data, isLoading: false });
        });
        break;
      case 'trending':
        getTrendingProps(null, null, publisher).then((data) => {
          this.setState({ characters: data, isLoading: false });
        });
        break;
    }
  }

  render() {
    const value = this.getValue() || this.state.value;
    return (
      <Fragment>
        <MainPageFlex>
          <Box>
            <FormStyle>
              <label htmlFor="characterFilter">Filter: </label>
              <SelectBox value={value} onChange={this.handleSelected} name="category">
                {VALUES.map((item) => {
                  const key = Object.keys(item)[0];
                  const val = Object.values(item)[0];
                  return (
                    <option value={key} key={key} label={val}>
                      {val}
                    </option>
                  );
                })}
              </SelectBox>
            </FormStyle>
          </Box>
        </MainPageFlex>
        {this.state.isLoading && (
          <CenterWrap>
            <LoadingSVG
              color={this.props.publisher === 'marvel' ? Brands.Marvel : Brands.DC}
              width={200}
              height={200}
            />
          </CenterWrap>
        )}
        <CharacterList characters={this.state.characters !== null ? this.state.characters : this.props.characters} />
      </Fragment>
    );
  }
}

CharacterListFilter.propTypes = {
  publisher: PropTypes.string.isRequired,
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
  router: PropTypes.object,
};

export default withRouter(CharacterListFilter);
