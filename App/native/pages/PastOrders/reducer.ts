import { PastOrders, PastOrdersAction } from './types';
import { PASTORDERS_ACTION_TYPES } from './actions';

export const initialState: PastOrders = {
    orders: null,
    page: 1,
    loading: true,
    initialApiCallCompleted: false,
    friendsContactList: []
};

export const pastOrders = (
    state: PastOrders = initialState,
    action: PastOrdersAction
) => {
    switch (action.type){
        case PASTORDERS_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data };        
        case PASTORDERS_ACTION_TYPES.SET_ORDER_HISTORY:
            return { ...state, ...{ orders: action.data, count: action.count } };     
        default:
            return state;
    }
}

