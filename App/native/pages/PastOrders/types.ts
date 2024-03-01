export type PastOrders = {
    orders: object
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type GetOfferDetailsAction = {
    type: string;
    data: Object;
}

export type GetOrderDetailsAction = {
    type: string;
    data: Object;
}

export type GetOrdersAction = {
    type: string;
    data: object;
}

export type SetOrdersAction = {
    type: string;
    data: object;
    count: Number;
}

export type CancelOrderAction = {
    type: string;
    data: object;
}

export type ReturnOrderAction = {
    type: string;
    data: object;
}

export type PastOrdersAction = GetOrdersAction | GetOfferDetailsAction | SetOrdersAction | CancelOrderAction | GetOrderDetailsAction | ReturnOrderAction

export type PastOrdersState = {
    pastOrders: PastOrders 
}