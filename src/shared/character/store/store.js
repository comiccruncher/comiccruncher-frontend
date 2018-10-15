export const storeCharacter = (data) => ({
  type: 'STORE_CHARACTER',
  data,
});

export const storeCharacters = (data) => ({
  type: 'STORE_CHARACTERS',
  data,
});

export const storeData = (data, type) => ({
  type: type,
  data,
});
