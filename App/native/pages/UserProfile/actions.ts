import { ChangeFieldAction, CurrentUserAction, SetCurrentUserAction, RewardsAction, SetRewardsAction, LogoutAction }  from './types';

export enum USERPROFILE_ACTION_TYPES {
    CHANGE_FIELD = 'USERPROFILE/CHANGE_FIELD',
    CURRENT_USER = 'USERPROFILE/CURRENT_USER',
    SET_CURRENT_USER = 'USERPROFILE/SET_CURRENT_USER',
    REWARDS = 'USERPROFILE/GET_REWARDS',
    SET_REWARDS = 'USERPROFILE/SET_REWARDS',
    LOGOUT = 'USERPROFILE/LOGOUT',
    EDIT_PROFILE = 'USERPROFILE/EDIT_PROFILE',
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: USERPROFILE_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const currentUser = (): CurrentUserAction => ({
    type: USERPROFILE_ACTION_TYPES.CURRENT_USER
});

export const editProfile = (payload: Object) => {
  return{
    type: USERPROFILE_ACTION_TYPES.EDIT_PROFILE,
    payload,
  }};

export const setCurrentUser = (obj: Object): SetCurrentUserAction => ({
    type: USERPROFILE_ACTION_TYPES.SET_CURRENT_USER,
    data: obj
});

export const logout = (): LogoutAction => ({
    type: USERPROFILE_ACTION_TYPES.LOGOUT
});
