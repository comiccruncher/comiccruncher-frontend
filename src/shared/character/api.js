import axios from 'axios';
import { API_URL } from '../utils/common';

const charactersEndpoint = `${API_URL}/characters`;

// Gets a single character with their appearances.
export function fetchCharacter(slug) {
  const url = charactersEndpoint + `/${encodeURIComponent(slug)}`;
  return axios
    .get(url)
    .then((res) => res.data.data)
    .catch((error) => {
      return error;
    });
}

// Gets all the characters.
export function fetchCharacters(pageNumber = 1) {
  return axios
    .get(`${charactersEndpoint}?page=${encodeURIComponent(pageNumber)}`)
    .then((res) => res.data)
    .catch((error) => {
      return error;
    });
}
