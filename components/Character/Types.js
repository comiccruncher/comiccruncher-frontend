import PropTypes from 'prop-types';

// PropTypes for a character.
export const CharacterProps = {
  publisher: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  name: PropTypes.string,
  other_name: PropTypes.string,
  slug: PropTypes.string,
  image: PropTypes.string,
  vendor_image: PropTypes.string,
};

// PropTypes for a character's appearances.
export const AppearancesProps = {
  appearances: PropTypes.arrayOf(
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
  ),
};
