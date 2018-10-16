import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Head from 'next/head';
import styled from 'react-emotion';
import { Box, Flex } from '@rebass/grid/emotion';
import { UI } from '../styles/colors';
import Dimensions from '../styles/dimensions';
import Spacing from '../styles/spacing';
import Type, { UIFontStack } from '../styles/type';

const CharacterCard = styled('div') ({
  backgroundImage: url(`${c.vendor_image}`)
});

export default CharacterCard;
