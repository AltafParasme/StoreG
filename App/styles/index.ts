import { StyleSheet } from 'react-native';
import { flattenToStyleSheetFormat } from '../utils/misc';

const Constants = {
  stdSpacingValue: 16,
  primaryColor: '#fd7400',
  lightOrangish: '#fdc001',
  blue: '#3174fa',
  darkGrey: '#212121',
  grey: '#474747',
  lightGrey: '#757575',
  lightFadedGrey: '#989A9F',
  white: '#ffffff',
  veryLightGrey: '#dfdfe4',
  liveItemBorder:'#e0e0e0',
  borderGrey: '#d8d8d8',
  postBlue:'#0091ff',
  backgroundGrey: 'rgba(246,246,246,0.6)',
  errorRed: '#e22727',
  warningYellow: '#f5a623',
  green: '#27ae60',
  red: '#e42e2e',
  pink: '#ff4d6b',
  black: '#000000',
  lightGreen: '#41ae5d',
  greenishBlue: '#00a9a6',
  darkBlack: '#292F3A',
  lightGreenishBlue: '#A2E0DF',
  dodgerBlue: '#1E90FF',
  secondaryBlue: '#279eff',
  secondaryColor: '#ff7f00',
  lightOrange: '#FFE0D0',
  orange: '#fc7e42',
  screenbackground: '#eeeeee',
  golderLetter:'#feda02',
  taskListBackground:'#d6d6d6',
  orangeTextCommision:'#fa6400',
  pinkTextColor:'#ec3d5a',
  meheroonText:'#6b1a63',
  greyishBlack:'#222222',
  creamyWhite:'#dadada',
  voiletColorText:'#5f45b8',
  redishVoiletText:'#a41d1d'
  // themeColor: '#419391'
};

const styles = StyleSheet.create({
  ...flattenToStyleSheetFormat({}),
  ...{
    blue: {
      color: Constants.blue,
    },
    green: {
      color: Constants.green,
    },
    black: {
      color: Constants.black,
    },
    darkGrey: {
      color: Constants.darkGrey,
    },
    red: {
      color: Constants.red,
    },
    pink: {
      color: Constants.pink,
    },
    grey: {
      color: Constants.grey,
    },
    lightGrey: {
      color: Constants.lightGrey,
    },
    greenishBlue: {
      color: Constants.greenishBlue,
    },
    veryLightGrey: {
      color: Constants.veryLightGrey,
    },
    white: {
      color: Constants.white,
    },
    secondaryColor: {
      color: Constants.secondaryColor,
    },
    errorRed: {
      color: Constants.errorRed,
    },
    warningYellow: {
      color: Constants.warningYellow,
    },
    stdSidePadding: {
      paddingLeft: Constants.stdSpacingValue,
      paddingRight: Constants.stdSpacingValue,
    },
    stdPadding: {
      padding: Constants.stdSpacingValue,
    },
    stdSideMargin: {
      marginRight: Constants.stdSpacingValue,
      marginLeft: Constants.stdSpacingValue,
    },
    stdMargin: {
      margin: Constants.stdSpacingValue,
    },
    bgBlue: {
      backgroundColor: Constants.blue,
    },
    bgWhite: {
      backgroundColor: Constants.white,
    },
    row: {
      flexDirection: 'row',
    },
    bottomGreyBorder: {
      borderBottomColor: Constants.borderGrey, // remember to add borderBottomWidth
    },
    centerContent: {
      flex: 0, // the component is sized according to width and height and it is inflexible
      alignItems: 'center',
      justifyContent: 'center',
    },
    absolute: {
      position: 'absolute',
    },
  },
});

export default styles;
export { Constants };
