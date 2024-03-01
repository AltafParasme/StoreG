import { ChangeFieldAction, SendOtpAction, VerifyOtpAction, RegisterUserAction, UserPreferencesAction, GetUserPreferencesAction, GetRecentOrderAction, GetCLDetailsAction }  from './types';

export enum LOGIN_ACTION_TYPES {
    CHANGE_FIELD = 'LOGIN/CHANGE_FIELD',
    SEND_OTP = 'LOGIN/SEND_OTP',
    USER_PREFERENCES = 'LOGIN/USER_PREFERENCES',
    GET_USER_PREFERENCES = 'LOGIN/GET_USER_PREFERENCES',
    REGISTER_USER = 'LOGIN/REGISTER_USER',
    VERIFY_OTP = 'LOGIN/VERIFY_OTP',
    GET_RECENT_ORDER = 'LOGIN/GET_RECENT_ORDER',
    GET_CL_DETAILS = 'LOGIN/GET_CL_DETAILS',
    GET_CL_DETAILS_INVITETOKEN = 'LOGIN/GET_CL_DETAILS_INVITETOKEN'
}

export const getUserPreferences = (skipAppUpdate: boolean): GetUserPreferencesAction => ({
    type: LOGIN_ACTION_TYPES.GET_USER_PREFERENCES,
    data: {skipAppUpdate}
});

export const getRecentOrder = (): GetRecentOrderAction => ({
    type: LOGIN_ACTION_TYPES.GET_RECENT_ORDER,
    data: {}
});

export const getCLDetails = (data): GetCLDetailsAction => ({
    type: LOGIN_ACTION_TYPES.GET_CL_DETAILS,
    data: data
});

export const getClDetailsWithInviteToken = (data): GetCLDetailsAction => ({
    type: LOGIN_ACTION_TYPES.GET_CL_DETAILS_INVITETOKEN,
    data: data
});

export const userPreferences = (auth: boolean, fireToken: string, lang: string, prefPinCode: number, canGoBack: boolean ): UserPreferencesAction => ({
    type: LOGIN_ACTION_TYPES.USER_PREFERENCES,
    data: { auth, fireToken, lang, prefPinCode, canGoBack}
});

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: LOGIN_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const sendOtp = (phoneNumber: string): SendOtpAction => ({
    type: LOGIN_ACTION_TYPES.SEND_OTP,
    data: { phoneNumber }
});

export const registerUser = (inviteToken: string, otp: string, phoneNumber: string, name: string,  callback: object): RegisterUserAction => ({
    type: LOGIN_ACTION_TYPES.REGISTER_USER,
    data: { inviteToken , otp , phoneNumber, name, callback }
});

export const verifyOtp = (inviteToken: string, otp: string, phoneNumber: string, callback: object): VerifyOtpAction => ({
    type: LOGIN_ACTION_TYPES.VERIFY_OTP,
    data: { inviteToken , otp , phoneNumber, callback }
});
