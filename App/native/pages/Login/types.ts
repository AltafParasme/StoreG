export type Login = {
    phoneNumber: string;
    otp: string;
    name: string;
    phoneNumberValid: boolean,
    otpValid: boolean,
    nameValid: boolean,
    formValid: boolean,
    resendOtpEnable: boolean,
    userRegistered: boolean;
    userPreferences: any;
    otpCallStatus: string;
    verifyOtpCallStatus: string;
    accessToken: string;
    isLoggedIn: boolean;
    inviteToken: string;
    updateUrl: string;
    app_update_type: string;
    isSharedEver: string;
    recentOrderExists: boolean;
    recentOrderStatus: any;
    currentScreen: string;
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type GetUserPreferencesAction = {
    type: string
}

export type GetRecentOrderAction = {
    type: string
}

export type UserPreferencesAction = {
    type: string;
    av: string;
    fireToken: string;
    sid: string;
    auth: boolean;
    prefPinCode: number,
}

export type SendOtpAction = {
    type: string;
    phoneNumber: string;
}

export type VerifyOtpAction = {
    type: string;
    inviteToken: string;
    otp: string;
    phoneNumber: string;
    callback: object
}

export type RegisterUserAction = {
    type: string;
    inviteToken: string;
    otp: string;
    phoneNumber: string;
    name: string;
}

export type GetCLDetailsAction = {
    type: string
}

export type LoginAction = ChangeFieldAction | SendOtpAction | VerifyOtpAction | RegisterUserAction | GetRecentOrderAction | GetCLDetailsAction;

export type LoginState = {
    login: Login,
    // add future state slices here
}