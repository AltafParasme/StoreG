import Constants from './constants';

export const startLoading = loadingText => ({ type: Constants.START_LOADING, data: loadingText });

export const endLoading = () => ({ type: Constants.END_LOADING });
