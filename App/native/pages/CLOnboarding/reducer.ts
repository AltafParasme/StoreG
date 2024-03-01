import {CLOnboarding, CLFlowAction} from './types';
import { CL_FLOW_ACTION_TYPES } from './actions';

export const initialState: CLOnboarding = {
    clConfig: null,
    userSegmentData: null,
    actionData: null,
    TaskData:null,
    shipmentsToBeDelivered: [],
    isDeliveredShipmentLoading: false,
    taskGroupList: [],
    totalTaskGroupListCount: null,
    isCLConfigUpdated: false,
    isCLConfigLoading: false,
    isTaskLoading:false,
    isTaskDhamakaLoading: false,
    isCLCreationApiCalled: false,
    clUsers:[],
    isTaskComplete:false,
    lenDoneTasks:0,
    feedbackGiven: false,
    requestFeedbackOrders: null,
    requestFeedbackOrdersCL: null,
    positiveFeedbacks:null,
    dhamakaCashbackDetails: null,
    loadingLeaderboardData: false,
    loadingMembersData: false,
    clLeaderboardData:[],
    clMediumLogoImage: '',
    clBigLogoImage: '',
    clConfigFetched: false
};

export const clOnboarding = (
    state: CLOnboarding = initialState,
    action: CLFlowAction
) => {
    switch (action.type){
        case CL_FLOW_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data }; 
        case CL_FLOW_ACTION_TYPES.START_LOADING:
            return { ...state, ...{ loading: true, loadingText: action.data } };
        case CL_FLOW_ACTION_TYPES.END_LOADING:
            return { ...state, ...{ loading: false, loadingText: '' } };   
        default:
            return state;
    }
}