import { fetchCharacter, fetchCharacters } from '../api';
import { storeData } from './store';

export const getCharacter = (slug) =>
  function(dispatch) {
    return fetchCharacter(slug).then((res) => dispatch(storeData(res, 'STORE_CHARACTER')));
  };

export const characterReducer = (state = [], action) => {
  switch (action.type) {
    case 'STORE_CHARACTER':
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export const charactersReducer = (state = [], action) => {
  switch (action.type) {
    case 'STORE_CHARACTERS':
      return {
        ...state,
        pagination: action.data.meta.pagination,
        data: action.data.data,
      };
    default:
      return state;
  }
};

export const getCharacters = (pageNumber = 1) =>
  function(dispatch) {
    return fetchCharacters(pageNumber).then((res) => dispatch(storeData(res, 'STORE_CHARACTERS')));
  };
