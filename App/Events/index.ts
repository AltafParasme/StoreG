import { Component } from "react";
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger, AppEventsConstants } from "react-native-fbsdk";
import queryString from 'query-string';
import url from 'url';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
const APP_ENVIRONMENT = Config.NODE_ENV || 'production';

const FIRST_REF = 'FirstRef';
const LAST_REF = 'LastRef';
const NAVIGATION_URL = 'NavigationUrl';
const ACTION = 'action';
const ACTION_ID = 'actionId';
const INVITE_TOKEN = "inviteToken";
const INVITOR_NAME = "invitorName";

const ACTION_PAGE_LOAD='PageLoad';
const ACTION_API_LOAD_TIME='ApiLoadTime';
const ACTION_API_ERROR='ApiValidationError';
const ACTION_APP_ERROR='AppUnKnownError';

const ACTION_CLICK='Click';
const ACTION_API_SUCCESS='ApiSuccess';
const ACTION_SWIPE='OnSwipe';
const ACTION_VIEW = 'ViewItem';

class Event {
    constructor(public pageId: string, public componentId: string, public action: string) {
        this.pageId = pageId;
        this.componentId=componentId;
        this.action=action;
     }
    eventName(){
         return `${this.pageId}_${this.componentId}_${this.action}`;
     }
}

export const Events = {
    /* Splash screen Events */

    LOAD_SPLASH_SCREEN : new Event('Splash', 'Splash',ACTION_PAGE_LOAD),
    SPLASH_LANGUAGE_SELECTION_CLICK : new Event('Splash', 'Language', ACTION_CLICK),
    SPLASH_GET_STARTED_BUTTON_CLICK : new Event('Splash', 'ContinueButton', ACTION_CLICK),

    /* Login Screen Events */

    LOAD_LOGIN_SCREEN : new Event('Login', 'Login',ACTION_PAGE_LOAD),
    LOGIN_PHONE_SUGGESTION_LOAD : new Event('Login', 'PhomeAutoSuggestionLoad', ACTION_CLICK),
    LOGIN_PHONE_SUGGESTION_USED_CLICK : new Event('Login', 'PhomeAutoSuggestionUsed', ACTION_CLICK),
    LOGIN_PHONE_OTP_SMS_AUTO_READ_CLICK : new Event('Login', 'PhomeOtpAutoRead', ACTION_CLICK),
    LOGIN_LOGIN_BUTTON_CLICK : new Event('Login', 'LoginButton', ACTION_CLICK),
    LOGIN_RESEND_OTP_BUTTON_CLICK : new Event('Login', 'ResendOTP', ACTION_CLICK),
    LOGIN_FIRST_USER : new Event('Login', 'FirstUser', ACTION_CLICK),

    /* App Force Update */
    
    LOAD_APP_FORCE_UPDATE_SCREEN : new Event('ForceUpdate', 'ForceUpdate',ACTION_PAGE_LOAD),
    SKIP_APP_UPDATE_CLICK : new Event('ForceUpdate', 'ForceUpdateSkipped', ACTION_CLICK),
    LINK_TO_APP_UPDATE_CLICK : new Event('ForceUpdate', 'LinkToForceUpdate', ACTION_CLICK),

   /* Add Contact Events */
    
    LOAD_ADD_CONTACT_SCREEN : new Event('AddContact', 'AddContact',ACTION_PAGE_LOAD),
    ADD_CONTACT_ADD_CONTACT_BUTTON_CLICK : new Event('AddContact', 'AddContactButton', ACTION_CLICK),
   
   
    /* Home Screen Events */

    LOAD_HOME_SCREEN : new Event('Home', 'Home',ACTION_PAGE_LOAD),
    LOAD_HOME_SUB_CATEGORY : new Event('Home', 'SubCategory',ACTION_PAGE_LOAD),
    HOME_CATEGORY_CLICK : new Event('Home', 'Category', ACTION_CLICK),
    HOME_CATEGORY_BANNER_CLICK : new Event('Home', 'CategoryBanner', ACTION_CLICK),
    HOME_OFFER_VIEW : new Event('Home', 'OfferView', ACTION_VIEW),
    HOME_OFFER_IMAGE_CLICK : new Event('Home', 'OfferImage', ACTION_CLICK),
    HOME_OFFER_IMAGE_VIDEO_CLICK : new Event('Home', 'OfferImageVideo', ACTION_CLICK),
    HOME_OFFER_TITLE_CLICK : new Event('Home', 'OfferTitle', ACTION_CLICK),
    HOME_OFFER_BUY_BUTTON_CLICK : new Event('Home', 'OfferBuyButton', ACTION_CLICK),
    HOME_OFFER_GROUP_INFO_CLICK : new Event('Home', 'OfferGroupInfo', ACTION_CLICK),
    HOME_POPUP_BUY_BUTTON_CLICK : new Event('Home', 'HomePopUpBuyButton', ACTION_CLICK),
    HOME_OFFER_VIDEO_CLOSE : new Event('PDP', 'OfferVideoClose', ACTION_CLICK),
    HOME_OFFER_VIDEO_OPEN : new Event('PDP', 'OfferVideoOpen', ACTION_CLICK),
    HOME_POPUP_CANCEL_BUTTON_CLICK : new Event('Home', 'HomePopUpCancelButton', ACTION_CLICK),
    HOME_POPUP_QTY_PLUS_BUTTON_CLICK : new Event('Home', 'HomePopUpQtyPlusButton', ACTION_CLICK),
    HOME_POPUP_QTY_MINUS_BUTTON_CLICK : new Event('Home', 'HomePopUpQtyMinusButton', ACTION_CLICK),
    HOME_SUB_CATEGORY_CLICK : new Event('Home', 'HomeSubCategory', ACTION_CLICK),
    HOME_RECENT_ORDER_STRIP_CLICK : new Event('Home', 'RecentOrderStrip',ACTION_CLICK),
    
    /** Combined Whatsapp Share Events */
    SHARE_OFFER_WHATSAPP_CLICK: new Event('ShareOffer', 'Whatsapp', ACTION_CLICK),
    SHARE_WHATSAPP_CLICK: new Event('ShareGeneral', 'Whatsapp', ACTION_CLICK),
    SHARE_WHATSAPP_DHAMAKA_CLICK: new Event('Share', 'DhamakaWhatsapp', ACTION_CLICK),
    SHARE_WHATSAPP_CL_TASK_CLICK: new Event('ShareCLTask', 'Whatsapp', ACTION_CLICK),
    SHARE_WHATSAPP_SHOPG_LIVE_CLICK: new Event('ShareShopGLive', 'Whatsapp', ACTION_CLICK),

    DEALOFTHEDAY_OFFER_IMAGE_CLICK : new Event('Home', 'OfferImage', ACTION_CLICK),

    /* Pref Pincode Events */

    LOAD_PREFPINCODE_SCREEN : new Event('PrefPincode', 'PrefPincode',ACTION_PAGE_LOAD),
    PREFPINCODE_UPDATE_USER : new Event('UserProfile', 'PrefPincodeUpdateUser', ACTION_CLICK),
    PREFPINCODE_TYPED : new Event('PrefPincode', 'PrefPincodeTyped', ACTION_CLICK),
    PREFPINCODE_CLICK : new Event('PrefPincode', 'PrefPincodeGiven', ACTION_CLICK),

    /* Cart Events */

    LOAD_CART_DETAILS : new Event('CartDetails', 'CartDetails',ACTION_PAGE_LOAD),
    PLACE_CART_ORDER :  new Event('CartDetails', 'CartDetailsOrderPLaced',ACTION_CLICK),
    PLACE_ONLINE_PAYMENT :  new Event('CartDetails', 'AfterPayment',ACTION_CLICK),
    PAYMENT_SELECTOR :  new Event('CartDetails', 'PaymentSelector',ACTION_CLICK),
    CONFIRM_CART_ORDER: new Event('CartDetails', 'CartDetailsOrderConfirm',ACTION_CLICK),
    PAYMENT_MODE_COD_PRESS: new Event('CartDetails', 'PaymentSheetCODClick',ACTION_CLICK),
    PAYMENT_MODE_ONLINE_PRESS: new Event('CartDetails', 'PaymentSheetOnlineClick',ACTION_CLICK),
    PAYMENT_MODE_SHEET_OPEN: new Event('CartDetails', 'PaymentSheetOpen',ACTION_CLICK),
    ADDRESS_FORM_EDIT_PINCODE: new Event('CartDetails', 'AddressFormEditPinCode',ACTION_CLICK),
    AGREE_TO_PAY_DELIVERY_CHARGES: new Event('CartDetails', 'AgreeDeliveryCharges',ACTION_CLICK),
    AGREE_TO_SHOP_MORE: new Event('CartDetails', 'AgreeShopMore',ACTION_CLICK),

    CART_ITEM_QUANTITY_INCREASE_HOME : new Event('Home', 'HomeCartQuantityIncrease',ACTION_CLICK),
    CART_ITEM_QUANTITY_DECREASE_HOME : new Event('Home', 'HomeCartQuantityDecrease',ACTION_CLICK),

    CART_ITEM_QUANTITY_INCREASE_SEARCH : new Event('Search', 'SearchCartQuantityIncrease',ACTION_CLICK),
    CART_ITEM_QUANTITY_DECREASE_SEARCH : new Event('Search', 'SearchCartQuantityDecrease',ACTION_CLICK),

    OTHER_ESSENTIALS_ADD_TO_CART_CARTDETAIL : new Event('CartDetails', 'OtherEssentialsCartAddToCart',ACTION_CLICK),
    OTHER_ESSENTIALS_QUANTITY_INCREASE_CART_DETAILS : new Event('CartDetails', 'OtherEssentialsCartQuantityIncrease',ACTION_CLICK),
    OTHER_ESSENTIALS_QUANTITY_DECREASE_CART_DETAILS : new Event('CartDetails', 'OtherEssentialsCartQuantityDecrease',ACTION_CLICK),

    OTHER_SIMILAR_ADD_TO_CART_CARTDETAIL : new Event('CartDetails', 'OtherSimilarCartAddToCart',ACTION_CLICK),
    OTHER_SIMILAR_QUANTITY_INCREASE_CART_DETAILS : new Event('CartDetails', 'OtherSimilarCartQuantityIncrease',ACTION_CLICK),
    OTHER_SIMILAR_QUANTITY_DECREASE_CART_DETAILS : new Event('CartDetails', 'OtherSimilarCartQuantityDecrease',ACTION_CLICK),

    CART_ITEM_QUANTITY_INCREASE_PDP : new Event('PDP', 'PDPQuantityIncrease',ACTION_CLICK),
    CART_ITEM_QUANTITY_DECREASE_PDP : new Event('PDP', 'PDPQuantityDecrease',ACTION_CLICK),
    HOME_ADD_TO_CART_BUTTON_CLICK : new Event('Home', 'AddToCart',ACTION_CLICK),
    HOME_SEND_TO_WHATSAPP_GROUP : new Event('Home', 'SendToWhatsApp',ACTION_CLICK),
    SUB_CATEGORY_ADD_TO_CART_BUTTON_CLICK : new Event('HomeSubCategory', 'AddToCart',ACTION_CLICK),
    CART_PURCHASE_SUCCESS : new Event('CartDetails', 'CartDetailsPurchaseSuccess',ACTION_API_SUCCESS),
    CART_NUMBER_OF_ORDERS: new Event('CartDetails', 'NumberOfOrders', ACTION_API_SUCCESS),

    CART_SIMILAR_ITEM_CLICK: new Event('CartDetails', 'SimilarItem', ACTION_CLICK),
    CART_ESSENTIAL_ITEM_CLICK: new Event('CartDetails', 'EssentialItem', ACTION_CLICK),

     /* Entity Events */

     LOAD_ENTITY_SCREEN : new Event('EntityDetails', 'EntityDetails',ACTION_PAGE_LOAD),
     ENTITYDETAILS_SUB_CATEGORY_CLICK : new Event('EntityDetails', 'SubCategory', ACTION_CLICK),
     ENTITYDETAILS_TITLE_CLICK : new Event('ShopGTv', 'EntityDetailsTitle',ACTION_CLICK),
     ENTITYDETAILS_IMAGE_CLICK : new Event('ShopGTv', 'EntityDetailsImage',ACTION_CLICK),
     ENTITYDETAILS_VIDEO_CLICK : new Event('ShopGTv', 'EntityDetailsVideo',ACTION_CLICK),

     /* Free Gift Events */

     LOAD_FREEGIFT_SCREEN: new Event('FreeGift', 'FreeGift', ACTION_PAGE_LOAD),
     
     /* ShopG Tv Events */
     LOAD_SHOPGTV_SCREEN : new Event('ShopGTv', 'ShopGTv',ACTION_PAGE_LOAD),
     SHOPGTV_TITLE_CLICK : new Event('ShopGTv', 'ShopGTvTitle',ACTION_CLICK),
     SHOPGTV_IMAGE_CLICK : new Event('ShopGTv', 'ShopGTvImage',ACTION_CLICK),
     SHOPGTV_VIDEO_CLICK : new Event('ShopGTv', 'ShopGTvVideo',ACTION_CLICK),
     VIDEO_LANGUAGE_SELECTION_CLICK : new Event('VerticalVideo', 'Language', ACTION_CLICK),

    /* Bottom Navigation Events */

    LOAD_BOTTOM_NAVIGATION_BAR_LOAD: new Event('BottomBar', 'BottomBar',ACTION_PAGE_LOAD),
    BOTTOM_NAVIGATION_BAR_HOME_CLICK : new Event('BottomBar', 'BottomBarHome', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_SEARCH_CLICK : new Event('BottomBar', 'BottomBarSearch', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_SHOPGTV_CLICK : new Event('BottomBar', 'BottomBarShopGTv', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_FREEGIFT_CLICK: new Event('BottomBar', 'BottomBarFreeGift', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_GROUP_DEALS_CLICK: new Event('BottomBar', 'BottomBarGroupDeal', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_MY_ORDERS_CLICK: new Event('BottomBar', 'MyOrders', ACTION_CLICK),
    BOTTOM_NAVIGATION_BAR_USER_SETTING_CLICK : new Event('BottomBar', 'BottomBarUserSetting', ACTION_CLICK),

   
    /* PDP Events */
    LOAD_PDP_SCREEN : new Event('PDP', 'PDP',ACTION_PAGE_LOAD),
    PDP_OFFER_IMAGE_CLICK : new Event('PDP', 'OfferImage', ACTION_CLICK),
    PDP_OFFER_VIDEO_CLICK : new Event('PDP', 'OfferVideo', ACTION_CLICK),
    PDP_SIMILAR_ITEM_CLICK: new Event('PDP', 'SimilarItem', ACTION_CLICK),
    PDP_QTY_PLUS_BUTTON_CLICK : new Event('PDP', 'PDPQtyPlusButton', ACTION_CLICK),
    PDP_QTY_MINUS_BUTTON_CLICK : new Event('PDP', 'PDPQtyMinusButton', ACTION_CLICK),
    PDP_BUY_BUTTON_CLICK : new Event('Home', 'PDPBuyButton', ACTION_CLICK),
    PDP_BUY_BUTTON_CLICK_OUT_OF_STOCK : new Event('Home', 'OutOfStockPDPBuyButton', ACTION_CLICK),
    PDP_OUT_OF_SERVICE_AREA : new Event('Home', 'PDPOutOfServiceArea', ACTION_CLICK),
    PDP_IN_SERVICE_AREA : new Event('Home', 'PDPInServiceArea', ACTION_CLICK),
    PDP_SCREEN_PURCHASE_SUCCESS : new Event('PDP', 'PurchaseSuccess',ACTION_API_SUCCESS),
   
    /* Customer Feedback Events */

    LOAD_CSAT_POPUP : new Event('CSAT', 'POPUP',ACTION_PAGE_LOAD),
    CSAT_SKIP_CLICK : new Event('CSAT', 'POPUPSkip', ACTION_CLICK),
    CSAT_PLAYSTORE_CLICK : new Event('CSAT', 'POPUPPlaystore', ACTION_CLICK),
    CSAT_CONTINUE_CLICK : new Event('CSAT', 'POPUPContinue', ACTION_CLICK),

    /* Group Events */

    LOAD_GROUP_SCREEN : new Event('Group', 'Group',ACTION_PAGE_LOAD),
    LOAD_UPDATE_GROUP_SCREEN : new Event('Group', 'Group',ACTION_PAGE_LOAD),
    GROUP_BUY_MORE_BUTTON_CLICK : new Event('Group', 'GroupBuyMoreButton', ACTION_CLICK),
    GROUP_MY_ITEMS_SECTION_CLICK : new Event('Group', 'GroupMyItemsSection', ACTION_CLICK),

   /* Whatsapp Support Events */
   SHIPPING_HEADER_WHATSAPP_SUPPORT_BUTTON_CLICK: new Event('ShippingList', 'Header', ACTION_CLICK),
   SHIPPING_WHATSAPP_SUPPORT_BUTTON_CLICK : new Event('ShippingList', 'TopSection', ACTION_CLICK),
   USER_PROFILE_WHATSAPP_SUPPORT_BUTTON_CLICK: new Event('UserProfile', 'MidSection', ACTION_CLICK),
   CL_MEMBER_WHATSAPP_CONTACT_CLICK: new Event('CLMembers', 'Whatsapp', ACTION_CLICK),
   CL_MEMBER_PHONE_DIALING_CONTACT_CLICK: new Event('CLMembers', 'PhoneNumber', ACTION_CLICK),
   
    /* User Settings Events */
    LOAD_USER_SETTING_SCREEN : new Event('UserSetting', 'UserSetting',ACTION_PAGE_LOAD),

    /* CL OnBoarding Events */
    CL_ONBOARDING_BANNER_CLICK : new Event('CLFlowBanner', 'Button',ACTION_CLICK),
    CL_STARTER_KIT_LOAD : new Event('MyOrderBusinessCheckout', 'CLOnboarding',ACTION_PAGE_LOAD),
    CL_STARTER_KIT_CLICK : new Event('MyOrderBusinessCheckout', 'CLOnboarding',ACTION_CLICK),
    CL_VIDEO_CLICK : new Event('CLOnboarding', 'VideoSection',ACTION_CLICK),

    /* CL Training */ 
    CL_TRAINING_LOAD : new Event('MyOrderBusinessCheckout', 'CLTraining',ACTION_PAGE_LOAD),
    CL_TRAINING_SUBSTEPS_CLICK: new Event('CLTraining', 'StepsDetails', ACTION_CLICK),

    /** CL Leader Board */
    CL_LEADERBOARD_STRIP_CLICK: new Event('Home', 'CLLeaderBoardStrip', ACTION_CLICK),
    CL_LEADERBOARD_LOAD : new Event('MyOrderBusinessCheckout', 'CLLeaderBoard',ACTION_PAGE_LOAD),
    CL_LEADERBOARD_BANNER_WHATSAPP_BUTTON_CLICK: new Event('CLLeaderBoard', 'BannerWhatsapp', ACTION_CLICK),


    /** CL Top Strip */
    CL_TOP_STRIP_CLICK: new Event('Home', 'CLTopStrip', ACTION_CLICK),

     /* CL Task */
    CL_TASKS_LOAD : new Event('MyOrderBusinessCheckout', 'CLTasks',ACTION_PAGE_LOAD),
    CL_TASK_ACTION_BUTTON_CLICK: new Event('CLTasks', 'CardGroup', ACTION_CLICK),
    CL_TASK_COMPLETE_CLICK: new Event('ShopGTask', 'TaskComplete', ACTION_CLICK),

     /* CL Members */
    CL_MEMBERS_LOAD:  new Event('MyOrderBusinessCheckout', 'Members',ACTION_PAGE_LOAD),

    /* Rewards Screen Events */
    LOAD_REWARDS_SCREEN : new Event('Rewards', 'Rewards',ACTION_PAGE_LOAD),

    /* Scratch Card Events */
    LOAD_SCRATCH_CARD_SCREEN : new Event('ScratchCardList', 'ScratchCardList',ACTION_PAGE_LOAD),

    /* Reward Widget Events */
    SHOPG_LIVE_RATING_COMPLETE : new Event('ShopGLive', 'RatingComplete', ACTION_CLICK),
    
    /* Home Myorders Events */
    LOAD_MY_ORDERS_SCREEN : new Event('MyOrders', 'MyOrders',ACTION_PAGE_LOAD),
    MY_ORDERS_SCREEN_ORDER_CLICK : new Event('MyOrders', 'GroupOrderOverlay',ACTION_CLICK),
    
    /* Home Edit profile Events */
    LOAD_EDIT_PROFILE_SCREEN : new Event('EditProfile', 'EditProfile',ACTION_PAGE_LOAD),

    /* Home bottom sheet for Society Buy Events */
    LOAD_HOME_SHOPG_SOCIETY_BOTTOM_SHEET : new Event('Home', 'SocietyBuy',ACTION_PAGE_LOAD),
    SHOPG_SOCIETY_CONTINUE_CLICK : new Event('SocietyBuy', 'BottomSheetContinue', ACTION_CLICK),
  
    /* Order Detail Events */
    LOAD_ORDER_DETAIL_SCREEN : new Event('OrderDetail', 'OrderDetail',ACTION_PAGE_LOAD),
    ORDER_DETAIL_SCREEN_CANCEL_ORDER_SHOW_POPUP : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    ORDER_DETAIL_SCREEN_CANCEL_ORDER_HIDE_POPUP_YES : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    ORDER_DETAIL_SCREEN_CANCEL_ORDER_HIDE_POPUP_NO : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    ORDERDETAILS_SIMILAR_ITEM_CLICK: new Event('OrderDetail', 'SimilarItem', ACTION_CLICK),
    
    ORDER_DETAIL_SCREEN_RETURN_ORDER_SHOW_POPUP : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    ORDER_DETAIL_SCREEN_RETURN_ORDER_HIDE_POPUP_YES : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    ORDER_DETAIL_SCREEN_RETURN_ORDER_HIDE_POPUP_NO : new Event('OrderDetail', 'OrderDetail',ACTION_CLICK),
    
    /* Search Events */

    LOAD_SEARCH_SCREEN : new Event('Search', 'Search',ACTION_PAGE_LOAD),
    SEARCH_SCREEN_SEARCH_RESULTS : new Event('Search', 'Search',ACTION_VIEW),
    SEARCH_SCREEN_SEARCH_SUCCESS : new Event('Search', 'SearchWithResult',ACTION_VIEW),
    SEARCH_SCREEN_SEARCH_FAIL : new Event('Search', 'SearchNoResult',ACTION_VIEW),
    SEARCH_SCREEN_SEARCH_CLEAR : new Event('Search', 'ClearSearch',ACTION_CLICK),
    SEARCH_SCREEN_ITEM_CLICK : new Event('Search', 'ItemClick',ACTION_CLICK),
    SEARCH_SUB_CATEGORY_CLICK : new Event('Search', 'SubItemClick',ACTION_CLICK),

    /* Shipping List Events */
    LOAD_SHIPPING_LIST_SCREEN : new Event('MyOrderBusinessCheckout', 'ShippingList',ACTION_PAGE_LOAD),
    SHIPPING_LIST_ITEM_CLICK : new Event('ShippingList', 'ListItem',ACTION_CLICK),

    /* Shipping Details Events */
    LOAD_SHIPPING_DETAILS_SCREEN : new Event('ShippingDetails', 'ShippingDetails',ACTION_PAGE_LOAD),

    /* Shipping Details Events */
    OUT_OF_STOCK : new Event('OUT_OF_STOCK', 'OUT_OF_STOCK',ACTION_VIEW),

    /* Location Events */
    LOCATION_PERMISSION_GIVEN : new Event('LOCATION', 'PERMISSION_ALLOWED',ACTION_VIEW),
    LOCATION_PERMISSION_UNAVAILIBLE : new Event('LOCATION', 'PERMISSION_UNAVAILIBLE',ACTION_VIEW),
    LOCATION_PERMISSION_DINIED : new Event('LOCATION', 'PERMISSION_DENIED',ACTION_VIEW),
    LOCATION_PERMISSION_DINIED_PERMANENT : new Event('LOCATION', 'PERMISSION_DENIED_PERMANENT',ACTION_VIEW),

    /* QR code Events */
    LOAD_QR_CODE_SCREEN : new Event('QRContainer', 'QRContainer',ACTION_PAGE_LOAD),
    QRCODE_SCAN_RESULT : new Event('QRContainer', 'QRCODE_SCAN_RESULT',ACTION_VIEW),
    QRCODE_CHANGE_GROUP : new Event('QRContainer', 'QRCODE_CHANGE_GROUP',ACTION_VIEW),
    QRCODE_BACK_TOSCAN : new Event('QRContainer', 'QRCODE_BACK_TOSCAN',ACTION_VIEW),

    LOAD_VIEW_MY_QR_CODE_SCREEN : new Event('ViewQrCode', 'ViewQrCode',ACTION_PAGE_LOAD),
    QRCODE_RELOAD : new Event('ViewQrCode', 'QRCODE_RELOAD',ACTION_VIEW),
    
    /* Shopg Live Events */
    OFFER_LIST_IMPRESSION : new Event('ShopGLive', 'DataListImpression', ACTION_PAGE_LOAD),
    OFFER_LIST_CLICK_PDP : new Event('ShopGLive', 'DataListItemPDP', ACTION_CLICK),
    SHOPG_LIVE_IMPRESSION : new Event('ShopGLive', 'Impression', ACTION_PAGE_LOAD),
    
    SHOPG_LIVE_SCRATCH_COMPLETE : new Event('ShopGLive', 'ScratchCardComplete', ACTION_SWIPE),
    SHOPG_LIVE_QUESTIONNARE_CLICK: new Event('ShopGLive', 'Questionnare', ACTION_CLICK),
    SHOPG_LIVE_RATING_CLICK: new Event('ShopGLive', 'Rating', ACTION_CLICK),
    SHOPG_LIVE_CL_ONBOARD_CLICK: new Event('ShopGLive', 'CLOnboard', ACTION_CLICK),
    SHOPG_LIVE_BANNER_CLICK : new Event('ShopGLive', 'Banner', ACTION_CLICK),
    SHOPG_LIVE_WIDGET_HEADER_CLICK : new Event('ShopGLive', 'HeaderViewAll', ACTION_CLICK),
    SHOPG_LIVE_OFFER_VIDEO_CLOSE : new Event('ShopGLive', 'VideoClose', ACTION_CLICK),
    SHOPG_LIVE_OFFER_VIDEO_OPEN : new Event('ShopGLive', 'VideoOpen', ACTION_CLICK),
    SHOPG_LIVE_REVIEW_SUBMIT : new Event('ShopGLive', 'ReviewSubmit', ACTION_CLICK),
    
    /* Shopg Video Events */
    SHOPG_VIDEO_PLAYTIME : new Event('ShopGVideo', 'VideoPlayTime', ACTION_CLICK),

    SHARE_FAILURE: new Event('Share', 'ShareItem', ACTION_CLICK),

    /*General Add to cart */
    ADD_TO_CART_BUTTON_CLICK : new Event('General', 'AddToCart',ACTION_CLICK),
    CL_TASK_VIDEO_OPEN: new Event('ShopGClTask', 'VideoOpen', ACTION_CLICK),
    CL_TASK_VIDEO_CLOSE : new Event('ShopGClTask', 'VideoClose', ACTION_CLICK),

    /*scratch card events */
    SCRATCH_CARD_DONE : new Event('ScratchCardList', 'OnScratchDone', ACTION_CLICK),
    SCRATCH_CARD_PAGE_LOAD : new Event('ScratchCardList', 'OnScratchPageLoad', ACTION_PAGE_LOAD),

    /*Daily check in to earn coins */
    USER_DAILY_CHECKIN_COINS: new Event('User_Daily', 'Checkin', 'Coins'),
    CL_WHATSAPPGROUPLINK_CLICK : new Event('CL','WhatsAppGroupJoin', ACTION_CLICK),
    
    /*vertical video screen */
    VERTICAL_VIDEO_SCREEN: new Event('VerticalVideo', 'VerticalVideo', ACTION_PAGE_LOAD),

    /* App Opened Using Deep Link */
    APP_DEEPLINK_CLICK: new Event('App','DeepLink',ACTION_CLICK),

    /* Community Events */
    VIEW_MY_COMMUNITY_CLICK : new Event('Community', 'ViewMyCommunity', ACTION_CLICK),
    LAUNCH_COMMUNITY: new Event('Community', 'CommunityLoad', ACTION_PAGE_LOAD),
    CHANGE_COMMUNITY_CLICK : new Event('Community', 'ChangeCommunity', ACTION_CLICK),
    SHARE_WIDGET_CLICK : new Event('Community', 'ShareWidget', ACTION_CLICK),
    ADD_COMMENT : new Event('Community', 'AddComment', ACTION_CLICK),
    ADD_REACTION : new Event('Community', 'AddReaction', ACTION_CLICK),
    COMMENT_NEXT_PAGE: new Event('Community', 'CommentNextPage', ACTION_PAGE_LOAD),
    COMMUNITY_NEXT_PAGE: new Event('Community', 'CommunityNextPage', ACTION_PAGE_LOAD),
    COMMUNITY_DETAIL_PAGE: new Event('Community', 'CommunityDetailPage', ACTION_PAGE_LOAD),
    ADD_POST : new Event('Community', 'AddPost', ACTION_CLICK),
    JOIN_COMMUNITY_CLICK : new Event('Community', 'JoinBtn', ACTION_CLICK),
    LOGIN_TO_CONTINUE: new Event('Login', 'Continue', ACTION_CLICK)
};

export const ErrEvents = {
     // API Load Events - call this event if API is taking more then 300 ms - data = {api:Apiurl, timeTaken:apiLoadTime}
     API_LOAD_TIME : new Event('Api', 'Api',ACTION_API_LOAD_TIME),

     // API Validation error - call this event if API sends a 200 and success=false - {api:Apiurl, errMsg:errMsg, isError:true, httpCode:httpStatusCode}
     API_VALIDATION_ERROR : new Event('Api', 'Validation',ACTION_API_ERROR),
 
     // API Auth error - call this event if API sends a 401 and success=false - {api:Apiurl, errMsg:errMsg, isError:true, httpCode:httpStatusCode}
     API_AUTH_ERROR : new Event('Api', 'Auth',ACTION_API_ERROR),
 
     // API Unknown error - call this event if API sends a !200 and !401 success=false - {api:Apiurl, errMsg:errMsg, isError:true, httpCode:httpStatusCode}
     API_UNKNOWN_ERROR : new Event('Api', 'Unknown',ACTION_API_ERROR),
 
 
     // API Validation error - Call if you encouner any unwated scenario in App - {api:App, errMsg:errMsg, isError:true}
     APP_UNKNOWN_ERROR : new Event('App', 'Unknown',ACTION_APP_ERROR),

     // API Validation error - Call if you encouner any unwated scenario in App - {api:App, errMsg:errMsg, isError:true}
     FACEBOOK_PURCHASE_EVENT_FAILED : new Event('Facebook', 'logEventFail',ACTION_APP_ERROR),

     // API Validation error - Call if you encouner any unwated scenario in App - {api:App, errMsg:errMsg, isError:true}
     FACEBOOK_ADD_TO_CART_EVENT_FAILED : new Event('Facebook', 'logEventFail',ACTION_APP_ERROR),
     // App Update Error - Call if any error raised while checking whether the app needs any update 
     APP_UPDATE_ERROR : new Event('App', 'Update',ACTION_APP_ERROR),
}    


export  const LogFBEvent = async (event:Event, data: any) => {
    try {
        if(!event.eventName())
        return;
        //use hasOwnProperty over here
        data = !!data?data:{};
        data.event=event;
        data.env=APP_ENVIRONMENT;
        AsyncStorage.multiGet([FIRST_REF, LAST_REF]).then(response => {
            if(!!response[0][1]){
                data.firstRef=queryString.parse(response[0][1]);
            }
            if(!!response[1][1]){
                data.lastRef=queryString.parse(response[1][1]);
            }
            
            analytics().logEvent(event.eventName(), data);
            
            if(Events.CART_PURCHASE_SUCCESS.eventName() === event.eventName()){
                try{
                    AppEventsLogger.logPurchase(data.value, "INR", { value: data.value, categories: data.categories });
                    AppEventsLogger.logEvent('Orders', data.numberOfOrders);
                    analytics().logPurchase({
                        value: data.value,
                        currency: data.currency,
                        transaction_id: data.cartId,
                    });
                }catch(error){
                    analytics().logEvent( ErrEvents.FACEBOOK_PURCHASE_EVENT_FAILED , data);
                    throw error;
                }
            }
            if(event.componentId.includes('AddToCart') || event.componentId.includes('QuantityIncrease') || event.componentId.includes('QuantityDecrease')){
                try{
                    AppEventsLogger.logEvent('fb_mobile_add_to_cart', null, data);
                }catch(error){
                    analytics().logEvent( ErrEvents.FACEBOOK_ADD_TO_CART_EVENT_FAILED , data);
                    throw error;
                }
            }
            console.log('LogEvent Name : ',event.eventName(),' Event : ', event ,' Data : ', data);
            
        })
        
        
    } catch (e) {
      console.log('63-> Error', e);
    }
}; 

export  const SetScreenName = async (screenName:string) => {
    try {
        //use hasOwnProperty over here
        analytics().setCurrentScreen(screenName, screenName);
        console.log('Analytics Screen Name set as  ', screenName);

    } catch (e) {
      console.log('63-> Error', e);
    }
}; 


export  const SetShopGFBaseParams = async (screenName:string) => {
    try {
        //use hasOwnProperty over here
        analytics().setCurrentScreen(screenName, screenName);
        //FBAnalytics.setMinimumSessionDuration(10000);
        //FBAnalytics.setSessionTimeoutDuration(1800000);
        analytics().setAnalyticsCollectionEnabled(true);
    } catch (e) {
      console.log('63-> Error', e);
    }
};

export const parseDeepLinkParams = (location: any, appLaunchEvent) => {
    try {
        if(!!location){
            // TODO : Check encoding of passed params
            const urlObj = url.parse(location);
            let queryParam = queryString.parse(urlObj.search);
            console.log('DEEPLINK All Params', queryParam);
            const { inviteToken, action } = queryParam;
            try{
                LogFBEvent(Events.APP_DEEPLINK_CLICK, queryParam);
            }catch(err){
                // Do nothing in case 
            }
            processDeepLink(queryParam, appLaunchEvent);
            
        }
        
    } catch (e) {
        console.log('63-> Error', e);
    }
}; 

export let inviteToken: string = '';
export let invitorName: string = ''
export  const  processDeepLink = async (data: any, appLaunchEvent) => {
    try {
        /*
            https://shopg.in/dl?action=groupInvite&actionId=adfsdf&inviteToken=asdfasdf&invitorName=test
        }

        */
        if(!!data){
            let firstRef = await AsyncStorage.getItem(FIRST_REF);

            const utmData = queryString.stringify(data);
            // Set UTM params for defining reference of source
            console.log('DEEPLINK data ', utmData);
            console.log('DEEPLINK data invite ', data[INVITE_TOKEN]);
            if(!!firstRef && !!utmData){
                await AsyncStorage.setItem(LAST_REF, utmData);
            }
            
            if(!firstRef && !!utmData){
                await AsyncStorage.setItem(FIRST_REF, utmData);
            }
            
            // Set invite token to read back while registring user - redux 
            if(!!data[INVITE_TOKEN]){
                inviteToken = data[INVITE_TOKEN];
                invitorName = data[INVITOR_NAME];
                await AsyncStorage.setItem(INVITE_TOKEN, data[INVITE_TOKEN]);
            }

            // Set - to redux for action 

            if(!!data[ACTION]){
                let navigateTo = '';
                if(!!data[ACTION_ID]){
                    navigateTo = `${data[ACTION]}/${data[ACTION_ID]}`;  
                }else{
                    navigateTo = data[ACTION];
                }
                AsyncStorage.setItem("deepLinkTo",navigateTo);
            }

            if(data['utm_source'] || data['utm_medium'] || (data['taskId'] && data['userId'])) {
                appLaunchEvent(data['utm_source'], data['utm_medium'], data['taskId'], data['userId']);
            }

            //readUTMTags();

        }
        
    } catch (e) {
        console.log('63-> Error', e);
    }
}; 

export  const  readUTMTags = async () => {
    try {
        /*
            https://shopg.in/dl?action=groupInvite&actionId=adfsdf&inviteToken=asdfasdf
        }

        */
        AsyncStorage.multiGet([FIRST_REF, LAST_REF]).then(response => {
            console.log('DEEPLINK ',response[0][0]) // Key1
            console.log('DEEPLINK ',response[0][1]) // Value1
            console.log('DEEPLINK ',response[1][0]) // Key2
            console.log('DEEPLINK ',response[1][1]) // Value2
            if(!!response[0][1]){
                console.log('DEEPLINK firstRef Data ',queryString.parse(response[0][1])); 
            }
            if(!!response[1][1]){
                console.log('DEEPLINK lastRef Data ',queryString.parse(response[1][1])); 
            }
            
        })
    } catch (e) {
        console.log('63-> Error', e);
    }
}; 