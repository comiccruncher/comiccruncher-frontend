import PropTypes from 'prop-types';

export const ThumbnailSizesProps = PropTypes.shape({
  small: PropTypes.string.isRequired,
  medium: PropTypes.string.isRequired,
  large: PropTypes.string.isRequired,
});

export const CharacterThumbnailsProps = PropTypes.shape({
  slug: PropTypes.string,
  image: ThumbnailSizesProps,
  vendor_image: ThumbnailSizesProps,
});

export const CharacterStatProps = PropTypes.shape({
  category: PropTypes.string.isRequired,
  issue_count_rank: PropTypes.number.isRequired,
  issue_count: PropTypes.number.isRequired,
  average_issues_per_year: PropTypes.number.isRequired,
  average_issues_per_year_rank: PropTypes.number.isRequired,
});

export const CharacterStatsProps = PropTypes.arrayOf(CharacterStatProps);

export const CharacterSyncLogProps = PropTypes.shape({
  synced_at: PropTypes.string,
  num_issues: PropTypes.number,
});

export const CharacterSyncLogsProps = PropTypes.arrayOf(CharacterSyncLogProps);

export const PublisherProps = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
});

// PropTypes for a ranked character for the characters list.
export const RankedCharacterProps = PropTypes.shape({
  publisher: PublisherProps.isRequired,
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string.isRequired,
  vendor_image: PropTypes.string,
  thumbnails: CharacterThumbnailsProps,
  stats: CharacterStatProps.isRequired,
});

// PropTypes for a character.
export const CharacterProps = PropTypes.shape({
  publisher: PublisherProps.isRequired,
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
  image: PropTypes.string,
  vendor_image: PropTypes.string,
  slug: PropTypes.string.isRequired,
});

// PropTypes for a character's appearances.
export const AppearancesProps = PropTypes.shape({
  slug: PropTypes.string,
  aggregates: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      main: PropTypes.number.isRequired,
      alternate: PropTypes.number.isRequired,
    })
  ),
});

// PropTypes for the full character with their appearances attached.
export const FullCharacterProps = PropTypes.shape({
  CharacterProps,
  vendor_description: PropTypes.string,
  description: PropTypes.string,
  thumbnails: CharacterThumbnailsProps,
  last_syncs: CharacterSyncLogsProps,
  stats: CharacterStatsProps,
  appearances: AppearancesProps,
});
