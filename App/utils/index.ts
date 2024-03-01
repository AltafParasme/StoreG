import {Dimensions, PixelRatio} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import i18n from '../../i18n';
import Config from "react-native-config";
import {API_URL} from '../Constants';

export const getL10s = (data: any, l10s:any = {}) => {
  const _l10s = l10s;
  if (!data || data.length === 0) return _l10s;
  data.forEach((item:any) => {
    const {mediaJson = {}} = item;
    const {description = {}, title = {}} = mediaJson;
    const descL10n = description.localizations;
    const descL10nKey = description.text;
    const titleL10n = title.localizations;
    const titleL10nKey = title.text;

    if (descL10n && descL10n.length > 0) {
      descL10n.forEach((litem: any) => {
        _l10s[litem.language] = _l10s[litem.language] || {};
        _l10s[litem.language][descL10nKey] = litem.text;
      });
    }
    if (titleL10n && titleL10n.length > 0) {
      titleL10n.forEach((litem : any) => {
        _l10s[litem.language] = _l10s[litem.language] || {};
        _l10s[litem.language][titleL10nKey] = litem.text;
      });
    }
  });
  return _l10s;
};

export const getL10sFeedback = (data: any, l10s:any = {}) => {
  const _l10s = l10s;
  if (!data || data.length === 0) return _l10s;

    let {productName = {}, description = {}} = data;
    const titleL10n = productName.localizations;
    const titleL10nKey = productName.text;
    const descL10n = description.localizations;
    const descL10nKey = description.text;

    if (descL10n && descL10n.length > 0) {
      descL10n.forEach((litem: any) => {
        _l10s[litem.language] = _l10s[litem.language] || {};
        _l10s[litem.language][descL10nKey] = litem.text;
      });
    }
    if (titleL10n && titleL10n.length > 0) {
      titleL10n.forEach((litem : any) => {
        _l10s[litem.language] = _l10s[litem.language] || {};
        _l10s[litem.language][titleL10nKey] = litem.text;
      });
    }
 
  return _l10s;
};

export const noop = () => {};

// export const setLocalization = async () => {
//   let res: any = await fetch(`${API_URL}/api/v1/offer/list`);
//   res = await res.json();
//   const data = getL10s(res.data.rows);
//   i18n.addResourceBundle('kannada', 'translation', data.Kannada);
//   i18n.addResourceBundle('hindi', 'translation', data.hindi);
// };

export const setApplicationLang = async () => {
  let res: any = await fetch(`${API_URL}/api/v1/localization`);
  res = await res.json();
  const languageKeys =
    (res.data && res.data.json && res.data.json.Kannada) || {};
  const hindiLanguageKeys =
    (res.data && res.data.json && res.data.json.Hindi) || {};  
  i18n.addResourceBundle('kannada', 'translation', languageKeys);
  i18n.addResourceBundle('hindi', 'translation', hindiLanguageKeys);
};

export const setDefaultLanguage = async (key:string) => {
  try {
    await AsyncStorage.setItem('language', key);
  } catch (e) {
    console.log('63-> Error', e);
  }
};

export const getDefaultLanguage = async () => {
  try {
    return await AsyncStorage.getItem('language');
  } catch (e) {
    console.log('74-> Error', e);
    return '';
  }
};

export const AppWindow = {
  width : Dimensions.get('window').width,
  height : Dimensions.get('window').height
}
  

const [baseWidth, baseHeight] = [375, 667];

const scaleWidth = AppWindow.width / baseWidth;
const scaleHeight = AppWindow.height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

const widthPercentageToDP = widthPercent => {
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((AppWindow.width * elemWidth) / 100);
};
const heightPercentageToDP = heightPercent => {
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((AppWindow.height * elemHeight) / 100);
};

// use for FontSize
const scaledSize = size => Math.ceil(size * scale);
export {widthPercentageToDP, heightPercentageToDP, scaledSize};


export const getYoutubeVideoIDFromURL = url => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
};

export const isFreeGiftCategory = (data) => {
  let freeGiftCategorySlug = 'free-gift';
  if(!data || !data.mediaJson)
    return false;

  if(data.mediaJson.categories.some(e => e.slug === freeGiftCategorySlug)) {
    return true;
  }  
  return false;
}
