import { UserProfile, UserProfileAction } from './types';
import { USERPROFILE_ACTION_TYPES } from './actions';

export const initialState: UserProfile = {
    user: null,
    initialApiCallCompleted: false,
    rewards: null,
    scratchRewards:null,
    initialRewardsApiCallCompleted: false
};

export const userProfile = (
    state: UserProfile = initialState,
    action: UserProfileAction
) => {
    switch (action.type){
        case USERPROFILE_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data };     
        case USERPROFILE_ACTION_TYPES.SET_CURRENT_USER:
            return { ...state, ...{ user: action.data } };
        default:
            return state;
    }
}