import {createSelector} from 'reselect';

const commonSelector = state => state.login;

export const userDetailsSelector = createSelector(
  commonSelector,
  subState => subState.userDetails
);

export const userEmailIdSelector = createSelector(
  userDetailsSelector,
  user => (user && user.email) || null
);

export const accessTokenSelector = createSelector(
  commonSelector,
  subState => subState.accessToken
);
