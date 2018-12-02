import PropTypes from 'prop-types';

export const CharacterStats = PropTypes.shape({
  category: PropTypes.string,
  issue_count_rank: PropTypes.number,
  issue_count: PropTypes.number,
  average_issues_per_year: PropTypes.number,
  average_issues_per_year_rank: PropTypes.number,
});

export const CharacterSyncLogs = PropTypes.shape({
  synced_at: PropTypes.instanceOf(Date),
  num_issues: PropTypes.number,
});

// PropTypes for a ranked character for the characters list.
export const RankedCharacterProps = PropTypes.shape({
  publisher: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  average_per_year_rank: PropTypes.number,
  average_per_year: PropTypes.number,
  issue_count_rank: PropTypes.number,
  issue_count: PropTypes.number,
  name: PropTypes.string,
  other_name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  vendor_image: PropTypes.string,
  vendor_url: PropTypes.string,
  vendor_description: PropTypes.string,
  appearances: AppearancesProps,
  stats: CharacterStats,
});

// PropTypes for a character.
export const CharacterProps = PropTypes.shape({
  publisher: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  name: PropTypes.string,
  other_name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  vendor_image: PropTypes.string,
  vendor_url: PropTypes.string,
  vendor_description: PropTypes.string,
});

// PropTypes for a character's appearances.
export const AppearancesProps = PropTypes.arrayOf(
  PropTypes.shape({
    slug: PropTypes.string,
    category: PropTypes.string,
    aggregates: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number,
        count: PropTypes.number,
      })
    ),
  })
);

// PropTypes for the full character with their appearances attached.
export const FullCharacterProps = PropTypes.shape({
  CharacterProps,
  last_syncs: PropTypes.arrayOf(CharacterSyncLogs),
  stats: PropTypes.arrayOf(CharacterStats),
  appearances: AppearancesProps,
});
