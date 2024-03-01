import { ChangeFieldAction, InitiatePaymentAction, ValidateCartAction, ValidatePaymentAction}  from './types';

export enum CART_DETAILS_ACTION_TYPES {
    CHANGE_FIELD = 'CART_DETAILS/CHANGE_FIELD',
    INITIATE_PAYMENT = 'CART_DETAILS/INITIATE_PAYMENT',
    VALIDATE_CART = 'CART_DETAILS/VALIDATE_CART',
    VALIDATE_PAYMENT = 'CART_DETAILS/VALIDATE_PAYMENT',
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: CART_DETAILS_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const initiatePayment = (obj,callback): InitiatePaymentAction => ({
    type: CART_DETAILS_ACTION_TYPES.INITIATE_PAYMENT,
    data: {obj,callback}
})

export const validateCart = (obj): ValidateCartAction => ({
    type: CART_DETAILS_ACTION_TYPES.VALIDATE_CART,
    data: obj
})

export const validatePayment = (obj): ValidatePaymentAction => ({
    type: CART_DETAILS_ACTION_TYPES.VALIDATE_PAYMENT,
    data: obj
})
