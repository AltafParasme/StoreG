import { Login, LoginState, ChangeFieldAction, SendOtpAction, VerifyOtpAction, LoginAction, } from './types';
import { LOGIN_ACTION_TYPES } from './actions';

export const initialState: Login = {
    phoneNumber: '',
    otp: '',
    name: '',
    phoneNumberValid: false,
    otpValid: false,
    formValid: false,
    resendOtpEnable: false,
    otpCallStatus: '',
    verifyOtpCallStatus: '',
    userRegistered: false,
    userPreferences: {},
    accessToken: '',
    isLoggedIn: false,
    inviteToken: '',
    updateUrl: '',
    app_update_type: '',
    recentOrderExists: false,
    currentScreen: '',
    recentOrder: null,
    clDetails: null,
    martSheetOpened: null,
    fireAppLaunchEvent: false,
    launchEventDetails: null,
    loginInitiatedFrom: ''
};

export const login = (
    state: Login = initialState,
    action: LoginAction
) => {
    switch (action.type){
        case LOGIN_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data }; 
        default:
            return state;
    }
}