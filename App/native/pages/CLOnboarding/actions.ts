import {ChangeFieldAction, GetStarterKitCL, GetUserSegmentsAction, GetTaskData , GetGroupMembers , GetRequestFeedback, GetShareFeedback, GetDhamakaCashback, UpdateCLConfig, CreateCL,GetClLeaderboard} from './types'

export enum CL_FLOW_ACTION_TYPES {
    CHANGE_FIELD = 'CLFLOW/CHANGE_FIELD',
    GET_STARTER_KIT = 'CLFLOW/GET_STARTER_KIT',
    GET_USER_SEGMENTS = 'CLFLOW/GET_USER_SEGMENTS',
    GET_TASK_DATA = 'CLFLOW/GET_TASK_DATA',
    GET_REQUEST_FEEDBACK = 'CLFLOW/GET_REQUEST_FEEDBACK',
    GET_SHARE_FEEDBACK = 'CLFLOW/GET_SHARE_FEEDBACK',
    PUT_CL_CONFIG = 'CLFLOW/PUT_CL_CONFIG',
    CREATE_CL = 'CLFLOW/CREATE_CL',
    CL_MEMBERS = 'CLFLOW/CL_MEMBERS',
    GET_DHAMAKA_CASHBACK = 'CLFLOW/GET_DHAMAKA_CASHBACK',
    START_LOADING = 'CLFLOW/START_LOADING',
    END_LOADING = 'CLFLOW/END_LOADING',
    CL_LEADERBOARD = 'CLFLOW/CL_LEADERBOARD'
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: CL_FLOW_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const getStarterKit = (): GetStarterKitCL => ({
    type: CL_FLOW_ACTION_TYPES.GET_STARTER_KIT
});

export const getUserSegments = (obj: object): GetUserSegmentsAction => ({
    type: CL_FLOW_ACTION_TYPES.GET_USER_SEGMENTS,
    data: obj
});
    
export const getTaskData = (isEarnCoins: boolean): GetTaskData => ({
    type: CL_FLOW_ACTION_TYPES.GET_TASK_DATA,
    data: {isEarnCoins: isEarnCoins}
});

export const getRequestFeedback = (userType: string, mode: string, page: number): GetRequestFeedback => ({
    type: CL_FLOW_ACTION_TYPES.GET_REQUEST_FEEDBACK,
    data: {userType: userType, mode: mode, page: page}
});

export const getShareFeedback = (type: string, userType: string,page: number): GetShareFeedback => ({
    type: CL_FLOW_ACTION_TYPES.GET_SHARE_FEEDBACK,
    data: {type: type, userType: userType, page: page}
});

export const getDhamakaCashback = (tnc: boolean, clUsers: boolean): GetShareFeedback => ({
    type: CL_FLOW_ACTION_TYPES.GET_DHAMAKA_CASHBACK,
    data: {tnc: tnc, clUsers: clUsers}
});



export const updateCLConfig = (inputBody: object, successCallBack: any): UpdateCLConfig => ({
    type: CL_FLOW_ACTION_TYPES.PUT_CL_CONFIG,
    data: {inputBody, successCallBack}
});

export const createCL = (inputBody: object): CreateCL => ({
    type: CL_FLOW_ACTION_TYPES.CREATE_CL,
    data: {inputBody}
});

export const getGroupMembers = (limit: any, startDate: string, endDate: string): GetGroupMembers => ({
    type: CL_FLOW_ACTION_TYPES.CL_MEMBERS,
    data:{startDate, endDate}
});

export const startLoading = (text: string): UpdateCLConfig => ({
    type: CL_FLOW_ACTION_TYPES.START_LOADING,
    data: text
});

export const endLoading = (text: string): UpdateCLConfig => ({
    type: CL_FLOW_ACTION_TYPES.END_LOADING,
    data: {}
});

export const getClLeaderboard = (dateRange: string): GetClLeaderboard => ({
    type: CL_FLOW_ACTION_TYPES.CL_LEADERBOARD,
    data:{dateRange}
});

