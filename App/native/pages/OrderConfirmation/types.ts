export type GroupSummary = {
    user: object
}

export type ChangeFieldAction = {
    type: string;
    fieldName: string;
    value: string;
}

export type GetSummaryAction = {
    type: string;
}

export type SetGroupSummaryAction = {
    type: string;
    data: object
}

export type GroupSummaryAction = GetSummaryAction | SetGroupSummaryAction;

export type GroupSummaryState = {
    groupSummary: GroupSummaryAction,
    // add future state slices here
}