import Config from 'react-native-config';
import {Constants} from '../styles';
import {Colors, Fonts} from '../../assets/global';

export const API_URL = Config.API_URL || 'https://shopg.in';
export const API_PAYMENTS_URL =
  Config.API_PAYMENTS_URL || 'https://payments.shopg.in';
export const PAYTM_URL =
  Config.PAYTM_URL ||
  'https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage';
export const API_LOCATION_URL =
  Config.API_LOCATION_URL || 'https://location.shopg.in';

export const API_ANALYTICS_URL =
  Config.API_ANALYTICS_URL || 'https://prod-api.shopg.in';

export const COMMUNITY_RELEVANCE_EMOTICONS = [
  {'emoji': '👍', 'status': 'liked'}, 
  {'emoji': '❤', 'status': 'great'}, 
  {'emoji': '😂', 'status': 'funny'},
  {'emoji': '😯', 'status': 'wow'},
  {'emoji': '😢', 'status': 'not great'},
  {'emoji': '😡', 'status': 'pissed'}
]
  

export const API_TIMEOUT = Config.API_TIMEOUT || 5000;

export const ApiConstants = {
  userPreferences: 'api/v1/userpref',
  currentUser: 'api/v1/auth/current-user',
  addAddress: 'api/v1/user/add-address',
  checkPinCode: 'api/v1/postal-code',
  rewards: 'api/v3/user/rewards',
  clOnboarding: 'api/v1/cl/clconfig',
  clCreation: 'api/v1/userpref/user-request-to-become-cl',
  orderHistory: 'api/v2/order/history',
  getOfferDetails: 'api/v1/offer/details',
  getEntityDetails: 'api/v1/offer/entityrelevance',
  getEntityDetailsInBulk: 'api/v1/offer/entityrelevance/bulk',
  getOrderDetails: 'api/v1/order/details',
  groupSummary: 'api/v1/groupoffer/summry',
  cancelOrder: 'api/v1/order/cancel',
  returnOrder: 'api/v2/order/return',
  logout: 'api/v1/auth/logout',
  search: 'api/v1/search',
  searchLog: 'api/v1/search/logSelection',
  barcodeSearch: 'api/v1/barcodeSearch/details',
  getCartDetails: 'api/v1/cart',
  updateCart: 'api/v1/cart/updateCart',
  validateCart: 'api/v1/cart/validate?type=CART',
  placeOrder: 'api/v1/cart/placeorder',
  paymentStatus: 'api/v1/payments/payment-status',
  clDetails: 'api/v1/cl',
  v3clDetails: 'api/v3/cl',
  feedback: 'api/v1/feedback',
  shippingHistory: 'api/v2/order/shipment/history',
  shippingDetails: 'api/v2/order/shipment/orders',
  initiatePayment: 'payments/api/v1/initiation',
  validatePayment: 'payments/api/v1/validateStatus',
  shippingMonthlyData: 'api/v2/cl/monthly/summary',
  savelocation: 'api/v1/location/savelocation',
  changeGroup: 'api/v1/group/mygroup/change',
  changeStatus: 'api/v1/shipment/status/change',
  userBankDetails: 'api/v1/payments/customer-account',
  verifyUserBankDetails: 'api/v1/payments/customer-account/verification',
  checkStatus: 'api/v1/payments/customer-account/active',
  liveAnalytics: 'live/analytics',
  returnShipment: 'api/v1/shipment/return/cl',
  getUserSegment: 'api/v2/user/segments',
  getTaskList:'live/tasks',
  getWidgets: 'live/getwidget/v2',
  clEarningSummary:'api/v1/cl-earning-summary',
  clMembers:'api/v2/cl/users',
  clLeaderboard:'api/v2/cl/leaderBoard',
  shareFeedback: 'api/v1/feedback/share',
  dhamakaCashback: 'api/v1/cashback/offer',
  getPincodeFromLocation: 'api/v2/location/pincode',
  getComunities: 'communities/getCommunities',
  getCurrentCommunity: 'communities/getCommunityFeed',
  createPost: 'communities/create-post',
  createComment: 'communities/postComments',
  joinCommunity: 'communities/join-community',
  editDeleteApiUrl: 'live/communities/edit',
  uploadImage:'images/v1/api/upload'
};

export const AppConstants = {
  youtubeAPIKey: 'AIzaSyC6lGHTKemC_QV61vth9HFzSASqaQObewI',
  supportWhatsAppNumber: '916366131117',
  supportCallNumber: '08047103923',
  supportCLWhatsAppNumber: '916366131118',
  supportCLCallNumber: '916366131118',
  timerData: 'timerData',
  timerRemoved: 'timerRemoved',
  orderDescription:'Nyota Order Purchase',
  supportEmail:'contact@shopg.in',
};

export const paymentConstants = {
  merchantId: Config.PAYTM_MERCHANT_ID,
  merchantKey: '6nNrNh%R!cSQvwL9',
};

export const ApiQueryConstants = {
  sizePastOrders: 7,
};

export const orderStatusMap = {
  'Deal Locked': {label: 'Not Confirmed', color: Constants.black},
  'Offer Unlocked': {label: 'Confirmed', color: Constants.lightGreen},
  'Order Confirmed': {label: 'Confirmed', color: Constants.lightGreen},
  'Order Packed': {label: 'Processing', color: Constants.lightGreen},
  'Processing for Dispatch': {
    label: 'Processing',
    color: Constants.lightGreen,
  },
  'Order Shipped': {label: 'Shipped', color: Constants.lightGreen},
  'Out For Delivery': {
    label: 'Out For Delivery',
    color: Constants.lightGreen,
  },
  'Order Delivered': {label: 'Delivered', color: Constants.lightGreen},
  'Order Returned': {label: 'Returned', color: Colors.tomato},
  'Order RTO': {label: 'Returned', color: Colors.tomato},
  'Order Cancelled': {label: 'Cancelled', color: Colors.tomato},
  'Order Refund': {label: 'Refund', color: Colors.tomato},
  'Customer not reachable : Order Cancelled': {
    label: 'Not reachable',
    color: Colors.tomato,
  },
  'Order Undelivered': {label: 'Undelivered', color: Colors.tomato}
};

export const shipmentStatusMap = {
  'Deal Locked': {label: 'Not Confirmed', color: Constants.red}, 
  'Confirmed': {label: 'Shipment Confirmed', color: Constants.primaryColor},
  'Packed': {label: 'Shipment Packed', color: Constants.primaryColor},
  'Picked': {label: 'Shipment Picked', color: Constants.primaryColor},
  'Processing for Dispatch': {
    label: 'Processing for Dispatch',
    color: Constants.primaryColor,
  },
  'Shipped': {label: 'Shipped', color: Constants.primaryColor},
  'Out For Delivery': {
    label: 'Out For Delivery',
    color: Constants.primaryColor,
  },
  'Delivered': {label: 'Shipment Delivered', color: Constants.primaryColor},
  'Returned': {label: 'Shipment Returned', color: Colors.tomato},
  'RTO': {label: 'Shipment Returned', color: Colors.tomato},
  'Cancelled': {label: 'Shipment Cancelled', color: Colors.tomato},
  'Refund': {label: 'Shipment Refund', color: Colors.tomato},
  'Undelivered': {label: 'Shipment Undelivered', color: Colors.tomato}
};

export const trustMarkerLogoMap = {
  'FSSAI_approved': {label: 'FSSAI'},
  'ISO': {label: 'ISO certified'},
  'Made_in_India': {label: 'Made In India'},
  'GMP': {label: 'GMP'},
  'BPA_FREE': {label: 'BPA Free'},
  'HDPE': {label: 'HDPE'},
  'Food_Grade_Plastic': {label: 'Food Grade Plastic'},
  'Farm_Fresh': {label: 'Farm Fresh'},
  'Pure_natural': {label: '100% Natural'},
  'ISI_approved': {label: 'ISI certified'},
  'ShopG_Certified': {label: 'ShopG certified'}
};

export const profileMarkerLogoMap = {
  'New_arrival': {label: 'New Arrival'},
  'Top_selling': {label: 'Top Selling'},
  'Trending': {label: 'Trending'}
};

export const OrderStatusTimeLine = {
  'Deal Locked': 'Placed',
  'Offer Unlocked': 'Confirmed',
  'Order Confirmed': 'Confirmed',
  'Order Packed': 'Processing for Dispatch',
  'Processing for Dispatch': 'Processing for Dispatch',
  'Order Shipped': 'Shipped',
  'Out For Delivery': 'Shipped',
  'Order Delivered': 'Delivered',
  'Order Returned': 'Return',
  'Order RTO': 'Return',
  'Order Cancelled': 'Canceled',
  'Order Refund': 'Refund',
  'Order Undelivered' : 'Undelivered',
  'Customer not reachable : Order Cancelled': 'Canceled',
};

export const specialCaseWidgets = ['customerFeedback', 'scratchCardRewards','dhamakaCashback'];

export const orderSummaryMap = {
  'Deal Locked': { label: 'Placed' },
  'Offer Unlocked': { label: 'Confirmed' },
  'Order Confirmed': { label: 'Confirmed'},
  'Order Packed': {label: 'Shipped'},
  'Processing for Dispatch': { label: 'Shipped'} ,
  'Order Shipped': { label: 'Shipped'},
  'Out For Delivery': { label: 'Shipped' },
  'Order Delivered': { label: 'Delivered' },
  'Order Returned': { label: 'Returned' },
  'Order RTO': { label: 'Returned' },
  'Order Cancelled': { label: 'Canceled' },
  'Order Refund': { label: 'Refunded' },
  'Customer not reachable : Order Cancelled': { label: 'Canceled' },
  'Order Undelivered': { label: 'Undelivered' }
};

export const listOfNegativeOrderStatus = ['Order Returned','Order Refund','Order Cancelled'];

export const essentialEntityId = 2616;
export const benefitsArr = ['Free Delivery', '5% Cashback on Non Essential items'];
export const groupMemberLimit = 100;
export const packageName = 'com.sociofy.tech.nyota';
export const appStoreURL =
  'https://play.google.com/store/apps/details?id=com.sociofy.tech.nyota';

export const customerReviews = [
  {
    name: 'Harsha Kiran',
    quote:
      'I purchased with my friends and received amazing discounts. Easy to use application. Very happy with the service. Great going guys :)',
  },
  {
    name: 'Rhea mohan',
    quote:
      'No doubt, Its the best app to get quality products in a fair price along with free gift,rewards and offers. Love to do shoppjng on Nyota. Must go for it when its about shopping😍.',
  },
  {
    name: 'Hridya Menon',
    quote:
      "Really the best app out there! Can't believe what I'd been missing out on. 😍 Tysm ShopG team for such a Fab user experience!",
  },
  {
    name: 'Mahiboob Chikkanalli',
    quote:
      'ಒಂದು ಒಳ್ಳೆಯ online ಮಾರ್ಕೆಟ್ ವಸ್ತು ಗಳು ತುಂಬಾ ಚೆನ್ನಾಗಿವೆ.. ಕೈಗೆಟುಕುವ ಬೆಲೆಯಲ್ಲಿ....*****',
  },
];
