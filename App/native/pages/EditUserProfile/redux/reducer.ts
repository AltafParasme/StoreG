import {EDITUSERPROFILE_ACTION_TYPES} from './actions';

export const initialState = {
  pincode: '',
};

export const editUserProfile = (state = initialState, action) => {
  switch (action.type) {
    case EDITUSERPROFILE_ACTION_TYPES.CHANGE_FIELD:
      return {...state, ...action.data};
    default:
      return state;
  }
};
