export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type CheckPincodeAction = {
    type: string;
}

export type AddAddressAction = {
    type: string;
}

export type EditUserProfileAction = ChangeFieldAction | CheckPincodeAction | AddAddressAction;

