import { Reward, RewardAction,  ChangeFieldAction } from './types';
import { REWARD_ACTION_TYPES } from './actions';

export const initialState: Reward = {
    rewards: '',
    scratchCardRewards:null,
    rewardsBackup: '',
    earnCoins: [],
};

export const rewards = (
    state: Reward = initialState,
    action: RewardAction
) => {
    switch (action.type){
        case REWARD_ACTION_TYPES.CHANGE_FIELD:
            return {...state, ...action.data }; 
        default:
            return state;
    }
}