import {
  SHIPPING_GET_SHIPPING_LIST,
  SHIPPING_GET_SHIPPING_LIST_GROUP,
  SHIPPING_GET_SHIPPING_DETAIL,
  SHIPPING_GET_GROUP_SHIPPING_DETAIL,
  SHIPPING_RETURN,
  CHANGE_STATUS_DELIVERED,
  GET_USER_BANK_DETAILS,
  ADD_USER_BANK_DETAILS,
  VERIFY_USER_BANK_DETAILS,
  CHECK_ACCOUNT_VERIFICATION_STATUS,
  GET_CL_EARNING,
} from './type';

export const GetShippingList = (
  page,
  status,
  shipmentId,
  awb,
  shouldShowLoading,
  callFromDetail
) => ({
  type: SHIPPING_GET_SHIPPING_LIST,
  payload: {page, status, shipmentId, awb, shouldShowLoading, callFromDetail},
});

export const GetShippingListGroup = (
  page,
  group,
  phone,
  status,
  awb,
  shipmentId,
  shouldShowLoading,
  isFromCLTask
) => ({
  type: SHIPPING_GET_SHIPPING_LIST_GROUP,
  payload: {
    page,
    group,
    phone,
    status,
    awb,
    shipmentId,
    shouldShowLoading,
    isFromCLTask,
  },
});

export const GetShippingDetails = shipmentId => ({
  type: SHIPPING_GET_SHIPPING_DETAIL,
  payload: {shipmentId},
});

export const GetGroupShippingData = (startDate, endDate) => ({
  type: SHIPPING_GET_GROUP_SHIPPING_DETAIL,
  payload: {startDate, endDate},
});

export const SetDelivered = (shipmentId, otp) => ({
  type: CHANGE_STATUS_DELIVERED,
  payload: {shipmentId, otp},
});

export const GetUserBankDetails = () => ({
  type: GET_USER_BANK_DETAILS,
});

export const AddUserBankDetails = data => ({
  type: ADD_USER_BANK_DETAILS,
  payload: {data},
});

export const verifyUserBankDetails = data => ({
  type: VERIFY_USER_BANK_DETAILS,
  payload: {data},
});

export const checkAccountVerificationStatus = data => ({
  type: CHECK_ACCOUNT_VERIFICATION_STATUS,
});

export const returnShipment = (shipmentId, returnReason) => ({
  type: SHIPPING_RETURN,
  payload: {shipmentId, returnReason},
});

export const GetClEarning = (startDate, frequency, callback) => ({
  type: GET_CL_EARNING,
  payload: {startDate, frequency, callback},
});
