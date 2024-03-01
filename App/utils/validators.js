const pat = /^\d{6}$/;
export const pincodeValid = pincode => pat.test(pincode);
