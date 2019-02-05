import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'react-emotion';
import Spacing from '../shared/styles/spacing';
import { UI } from '../shared/styles/colors';
import { UIFontStack, Weight } from '../shared/styles/type';
import { Flex, Box } from 'rebass/emotion';
import { Github } from '../shared/components/Icons';
import { TrackEvent } from '../ga/Tracker';
import { OutboundLink } from 'react-ga';

const FooterContainer = styled('footer')({
  textAlign: 'center',
  padding: Spacing.xLarge,
  ul: {
    listStyle: 'none',
  },
  li: {
    display: 'inline-block',
    padding: Spacing.Tiny,
  },
  a: {
    color: UI.Text.Dark,
    fontFamily: UIFontStack,
    fontWeight: Weight.Medium,
    padding: 0,
    transition: 'all .3s ease-in-out',
    '&:hover': {
      color: UI.Text.Light,
    },
  },
});

const IconsContainer = styled('div')({
  margin: '10px auto',
});

const aimeelaplant = 'https://twitter.com/aimeelaplant';
const ghanbak = 'https://twitter.com/ghanbak';
const github = 'https://github.com/aimeelaplant/comiccruncher';

const gaCategory = 'footer';
const TrackCC = (e) => {
  e.preventDefault();
  TrackEvent(gaCategory, 'click', 'Comic Cruncher').then(() => Router.push('/'));
};

const Footer = ({ showFooterText = true }) => (
  <Fragment>
    <Flex>
      <Box width={1}>
        <FooterContainer>
          {showFooterText && (
            <Fragment>
              <ul>
                <li>
                  <Link href={`/`}>
                    <a onClick={(e) => TrackCC(e)}>Comic Cruncher</a>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <OutboundLink eventLabel="twitter.com/aimeelaplant" to={aimeelaplant}>
                    @aimeelaplant
                  </OutboundLink>
                </li>
                <li>
                  <OutboundLink eventLabel="twitter.com/ghanbak" to={ghanbak}>
                    @ghanbak
                  </OutboundLink>
                </li>
              </ul>
              <IconsContainer>
                <OutboundLink eventLabel="GitHub Link" to={github}>
                  <Github width="32" height="32" />
                </OutboundLink>
              </IconsContainer>
            </Fragment>
          )}
        </FooterContainer>
      </Box>
    </Flex>
  </Fragment>
);

Footer.propTypes = {
  showFooterText: PropTypes.bool,
};

export default Footer;
