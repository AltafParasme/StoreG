import { UserListState, UserListAction, AddUserAction } from '../types';
import { USER_LIST_ACTION_TYPES } from './actions';

export const initialState: UserListState = [];

export const userList = (
    state: UserListState = initialState,
    action: UserListAction
) => {
    switch (action.type){
        case USER_LIST_ACTION_TYPES.ADD_USER:
            // pay attention to type-casting on action
            const { userData } = <AddUserAction>action;
            const { name, surname, age } = userData;
            return [...state, { name, surname, age }];
            
        default:
            return state;
    }
}