import { GroupSummaryAction, GroupSummary  } from './types';
import { GROUPSUMMARY_ACTION_TYPES } from './actions';

export const initialState: GroupSummary = {
    groupDetails: null,
    initialApiCallCompleted: false,
    isOverlay: false,
};

export const groupSummary = (
    state: GroupSummary = initialState,
    action: GroupSummaryAction
) => {
    switch (action.type){
        case GROUPSUMMARY_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data };     
        case GROUPSUMMARY_ACTION_TYPES.SET_GROUP_SUMMARY:
            return { ...state, ...{ groupDetails: action.data } }; 
        default:
            return state;
    }
}