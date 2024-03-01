export type UserProfile = {
    user: object
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type CurrentUserAction = {
    type: string;
}

export type RewardsAction = {
    type: string;
    data: object;
}

export type SetCurrentUserAction = {
    type: string;
    data: object
}

export type SetRewardsAction = {
    type: string;
    data: object
}

export type LogoutAction = {
    type: string;
}

export type UserProfileAction = CurrentUserAction | SetCurrentUserAction | ChangeFieldAction | RewardsAction | LogoutAction ;

export type UserProfileState = {
    userProfile: UserProfile,
    // add future state slices here
}