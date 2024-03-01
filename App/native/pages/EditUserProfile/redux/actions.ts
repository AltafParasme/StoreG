import { ChangeFieldAction, CheckPincodeAction, AddAddressAction}  from './types';

export enum EDITUSERPROFILE_ACTION_TYPES {
    CHANGE_FIELD = 'EDITUSERPROFILE/CHANGE_FIELD',
    CHECK_PINCODE = 'EDITUSERPROFILE/CHECK_PINCODE',
    ADD_ADDRESS = 'EDITUSERPROFILE/ADD_ADDRESS',
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: EDITUSERPROFILE_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const addAddress = (address: obj): AddAddressAction => ({
    type: EDITUSERPROFILE_ACTION_TYPES.ADD_ADDRESS,
    data: {address}
});

export const checkPinCode = (pincode: number): CheckPincodeAction => ({
    type: EDITUSERPROFILE_ACTION_TYPES.CHECK_PINCODE,
    data: {pincode}
});

