import React from 'react';
import { Box, Flex } from 'rebass/emotion';
import styled, { css } from 'react-emotion';
import { Header } from '../Layout/Header';
import Responsive from '../shared/styles/responsive';
import { UI, Brands } from '../shared/styles/colors';
import { Title } from '../shared/styles/type';
import Dimensions from '../shared/styles/dimensions';

const AngledBox = css({
  zIndex: 10,
  position: 'relative',
  '&::after': {
    content: `' '`,
    width: '100%',
    height: '100%',
    zIndex: -1,
    transform: 'skew(-6deg)',
    backgroundColor: 'inherit',
    position: 'absolute',
    top: 0,
    left: '-40px',
    borderLeft: '20px solid ' + UI.Background.White,
    [Responsive.Mobile]: {
      borderLeft: 'none',
      borderTop: '20px solid ' + UI.Background.White,
      left: 0,
      top: '-40px',
      transform: 'skewY(-6deg)',
    },
  },
});

const HeaderTitle = styled('div')((props) => ({
  marginTop: '120px',
  [Responsive.Tablet]: {
    marginTop: '70px',
  },
  [Responsive.Mobile]: {
    margin: '20px',
  },
}));

const CharacterImg = styled('img')((props) => ({
  width: props.width || '100%',
  height: props.height || '100%',
  objectFit: 'cover',
  objectPosition: props.objectPosition || 'top',
  height: '400px',
  [Responsive.TabletAndBelow]: {
    height: '350px',
  },
}));

export const CharacterHeader = (props) => {
  const c = props;
  return (
    <React.Fragment>
      <Header background="#fff" overflow="hidden">
        <Flex flexWrap="wrap">
          <Box flex="1 0 auto" width={[1, `${Dimensions.GoldenRatio.Small}`, 2 / 5]}>
            <CharacterImg src={c.image || c.vendor_image} alt={`${c.name} profile image`} />
          </Box>
          <Box
            flex="1 0 auto"
            width={[1, `${Dimensions.GoldenRatio.Large}`, 3 / 5]}
            className={AngledBox}
            bg={c.publisher.slug == 'marvel' ? Brands.Marvel : Brands.DC}
          >
            <Flex justifyContent="center" alignItems="center" alignContent="center">
              <Box p={30}>
                <HeaderTitle>
                  <Title.Large>
                    <h1>{c.name}</h1>
                  </Title.Large>
                  {c.other_name && (
                    <Title.Byline>
                      <h2>{c.other_name}</h2>
                    </Title.Byline>
                  )}
                </HeaderTitle>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Header>
    </React.Fragment>
  );
};
