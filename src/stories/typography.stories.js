import React from 'react';
import styled from 'react-emotion';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import {UI} from '../shared/styles/colors';
import Spacing from '../shared/styles/spacing';
import {Title, Section, Text} from '../shared/styles/type';

const TypeScale = ({text}) => (
  <div>
    <div style={{marginBottom: Spacing.Large}}>
      <Text.Default style={{textTransform: 'uppercase'}}>Title</Text.Default>
      <Title.Large>{text}</Title.Large>
      <div style={{backgroundColor: UI.Background.Dark}}>
        <Title.Byline>{text}</Title.Byline>
      </div>
    </div>
    <div style={{marginBottom: Spacing.Large}}>
      <Text.Default style={{textTransform: 'uppercase'}}>Section</Text.Default>
      <Section.Title>{text}</Section.Title>
      <Section.Byline>{text}</Section.Byline>
    </div>
    <div style={{marginBottom: Spacing.Large}}>
      <Text.Default style={{textTransform: 'uppercase'}}>Text</Text.Default>
      <Text.Default>{text}</Text.Default>
      <Text.Default bold>{text}</Text.Default>
    </div>
  </div>
);

storiesOf('Typography').add('Type Scale', () => <TypeScale text={'Lorem ipsum dolor sit amet'} />);
