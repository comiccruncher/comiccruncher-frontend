require('dotenv').config();

// TODO: get production URL
export const API_URL = process.env.API_URL ? process.env.API_URL : 'https://api.comiccruncher.com';
