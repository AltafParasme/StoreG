import { CartDetails, CartDetailAction, } from './types';
import { CART_DETAILS_ACTION_TYPES } from './actions';

export const initialState: CartDetails = {
    transactionToken: null,
    internalTransactionId: null,
    transactionInitiated: false,
    cartError: [],
    isCartValid: false
};

export const cartDetails = (
    state: CartDetails = initialState,
    action: CartDetailAction
) => {
    switch (action.type){
        case CART_DETAILS_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data }; 
        default:
            return state;
    }
}