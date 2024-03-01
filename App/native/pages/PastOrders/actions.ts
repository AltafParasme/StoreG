import { GetOrdersAction, GetOfferDetailsAction, SetOrdersAction, CancelOrderAction,ReturnOrderAction ,GetOrderDetailsAction }  from './types';

export enum PASTORDERS_ACTION_TYPES {
    CHANGE_FIELD = 'PASTORDERS/CHANGE_FIELD',
    GET_ORDER_HISTORY = 'PASTORDERS/GET_ORDER_HISTORY',
    GET_OFFER_DETAILS = 'PASTORDERS/GET_OFFER_DETAILS',
    GET_ORDER_DETAILS = 'PASTORDERS/GET_ORDER_DETAILS',
    SET_ORDER_HISTORY = 'PASTORDERS/SET_ORDER_HISTORY',
    CANCEL_ORDER = 'PASTORDERS/CANCEL_ORDER',
    RETURN_ORDER = 'PASTORDERS/RETURN_ORDER',
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: PASTORDERS_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const getOrderHistory = (obj: Object): GetOrdersAction => ({
    type: PASTORDERS_ACTION_TYPES.GET_ORDER_HISTORY,
    data: obj
});

export const setOrderHistory = (obj: Object, count: Number): SetOrdersAction => ({
    type: PASTORDERS_ACTION_TYPES.SET_ORDER_HISTORY,
    data: obj,
    count: count,
});

export const getOfferDetails = (obj: Object): GetOfferDetailsAction => ({
    type: PASTORDERS_ACTION_TYPES.GET_OFFER_DETAILS,
    data: obj
})

export const getOrderDetails = (obj: Object): GetOrderDetailsAction => ({
    type: PASTORDERS_ACTION_TYPES.GET_ORDER_DETAILS,
    data: obj
})

export const cancelOrder = (obj: Object): CancelOrderAction => ({
    type: PASTORDERS_ACTION_TYPES.CANCEL_ORDER,
    data: obj
});

export const returnOrder = (obj: Object): ReturnOrderAction => ({
    type: PASTORDERS_ACTION_TYPES.RETURN_ORDER,
    data: obj
});