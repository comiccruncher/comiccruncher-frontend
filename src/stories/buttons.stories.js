import React from 'react';
import styled from 'react-emotion';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Button from '../shared/components/Button';

storiesOf('Button', module)
  .add('Primary', () => <Button type="primary">Button Text</Button>);
