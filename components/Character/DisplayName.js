import React from 'react';
import { Text } from '../shared/styles/type';

// Shows the display name of the character.
export const DisplayName = (props) => (
  <div className="DisplayName">
    <Text.Default>
      {props.stats && props.stats.issue_count_rank && `#${props.stats.issue_count_rank}.`} <strong>{props.name}</strong>
    </Text.Default>
    {props.stats && props.stats.issue_count && <Text.Default>{props.stats.issue_count} issues </Text.Default>}
  </div>
);
