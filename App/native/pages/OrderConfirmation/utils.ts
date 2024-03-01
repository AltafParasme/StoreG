import {Constants} from "../../Constants"
import {Alert, ToastAndroid, Linking} from 'react-native';
import moment from 'moment';
import idx from 'idx';
import {
  LogFBEvent,
  Events,
  ErrEvents,
} from '../../Events';
import {AppConstants} from '../../Constants';


export const getFormattedDateFromNumberofDays = (days) => {
  if(!days)
  return '';

  let date = new Date();
  let last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
  let formattedDate = moment(last).format('YYYY-MM-DD HH:mm')
  return formattedDate;
}
