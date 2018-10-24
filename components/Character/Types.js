import PropTypes from 'prop-types';

// PropTypes for a character.
export const CharacterProps = PropTypes.shape({
  publisher: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  other_name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string.isRequired,
  vendor_image: PropTypes.string,
  vendor_url: PropTypes.string,
  vendor_description: PropTypes.string,
});

// PropTypes for a character's appearances.
export const AppearancesProps = PropTypes.arrayOf(
  PropTypes.shape({
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    aggregates: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ),
  })
);

// PropTypes for the full character with their appearances attached.
export const FullCharacterProps = PropTypes.shape({
  CharacterProps,
  appearances: AppearancesProps,
});
