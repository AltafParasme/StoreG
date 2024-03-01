import { ChangeFieldAction, GetSummaryAction, SetGroupSummaryAction }  from './types';

export enum GROUPSUMMARY_ACTION_TYPES {
    CHANGE_FIELD = 'GROUPSUMMARY/CHANGE_FIELD',
    GET_GROUP_SUMMARY = 'GROUPSUMMARY/GET_GROUP_SUMMARY',
    SET_GROUP_SUMMARY = 'GROUPSUMMARY/SET_GROUP_SUMMARY'
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: GROUPSUMMARY_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const getGroupSummary = (limit: any): GetSummaryAction => ({
    type: GROUPSUMMARY_ACTION_TYPES.GET_GROUP_SUMMARY,
    data: {limit}
});

export const setGroupSummary = (groupSummary: obj): SetGroupSummaryAction => ({
    type: GROUPSUMMARY_ACTION_TYPES.SET_GROUP_SUMMARY,
    data: groupSummary
});
