import React from 'react';
import { Text } from '../shared/styles/type';
import PropTypes from 'prop-types';

// Shows the display name of the character.
export const DisplayName = ({ stats, name }) => (
  <div className="DisplayName">
    <Text.Default>
      {stats && stats.issue_count_rank && `#${stats.issue_count_rank}.`} <strong>{name}</strong>
    </Text.Default>
    {stats && stats.issue_count && <Text.Default>{stats.issue_count} issues </Text.Default>}
  </div>
);

DisplayName.propTypes = {
  name: PropTypes.string,
  stats: PropTypes.shape({
    issue_count_rank: PropTypes.number.isRequired,
    issue_count: PropTypes.number.isRequired,
  }),
};
