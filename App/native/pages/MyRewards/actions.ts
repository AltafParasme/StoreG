import { ChangeFieldAction, RewardAction }  from './types';

export enum REWARD_ACTION_TYPES {
    CHANGE_FIELD = 'REWARD/CHANGE_FIELD',
    GET_REWARDS = 'REWARD/GET_REWARDS',
}

export const changeField = (fieldName: string, value: any): ChangeFieldAction => ({
    type: REWARD_ACTION_TYPES.CHANGE_FIELD,
    data: { [fieldName] : value }
});

export const getRewards = (getCashback: boolean, getCoins: boolean, getScratchDetails: boolean ,history: boolean,page: number, size: number): GetRewardsAction => ({
    type: REWARD_ACTION_TYPES.GET_REWARDS,
    data: {getCashback: getCashback, getCoins: getCoins, getScratchDetails: getScratchDetails, history: history, page: page, size: size}
});

