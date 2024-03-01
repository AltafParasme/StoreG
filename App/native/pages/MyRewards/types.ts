export type Rewards = {
    rewards: any
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type RewardAction = ChangeFieldAction;

export type RewardState = {
    reward: any,
    // add future state slices here
}