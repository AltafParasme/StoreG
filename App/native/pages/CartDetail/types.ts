export type CartDetails = {
    transactionToken: string;
    internalTransactionId: string;
    transactionInitiated: boolean,
    cartError: any,
    isCartValid: boolean
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type InitiatePaymentAction = {
    type: string;
    obj: any;
}

export type ValidateCartAction = {
    type: string;
}

export type ValidatePaymentAction = {
    type: string;
    obj: any;
}

export type CartDetailAction = ChangeFieldAction | InitiatePaymentAction | ValidateCartAction | ValidatePaymentAction;

export type CartDetailState = {
    cartDetails: CartDetails
}