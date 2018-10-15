import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { characterReducer, charactersReducer } from '../character/store/reducer';

// Register the reducers.
const rootReducer = combineReducers({
  character: characterReducer,
  characters: charactersReducer,
  router,
});

export default rootReducer;
