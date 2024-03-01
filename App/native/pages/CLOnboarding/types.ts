export type CLOnboarding = {
    user: object
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type GetStarterKitCL = {
    type: string;
}

export type GetUserSegmentsAction = {
    type: string;
}

export type UpdateCLConfig = {
    type: string;
    value: string;
}

export type CLFlowState = {
    clOnboarding: CLOnboarding,
}

export type GetTaskData = {
    type: string;
}

export type GetRequestFeedback = {
    type: string;
}

export type GetShareFeedback = {
    type: string;
}

export type GetDhamakaCashback = {
    type: string;
}

export type CreateCL = {
    type: string;
}

export type startLoading = {
    type: string;
}

export type endLoading = {
    type: string;
}

export type GetClLeaderboard = {
    type: string;
}

export type CLFlowAction = GetStarterKitCL | UpdateCLConfig | GetTaskData | GetRequestFeedback | GetUserSegmentsAction | UpdateCLConfig | startLoading | endLoading | CreateCL | GetShareFeedback | GetClLeaderboard;

//export const GET_TASK_DATA = 'GET_TASK_DATA';