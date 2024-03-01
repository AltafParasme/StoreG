import moment from 'moment';

export function flattenToStyleSheetFormat(unflattenedStyles:object) {
  const styleObj = {};
  Object.keys(unflattenedStyles).forEach(property => {
    Object.keys(unflattenedStyles[property]).forEach(key => {
      styleObj[`${property}-${key}`] = {
        [property]: unflattenedStyles[property][key],
      };
    });
  });
  return styleObj;
}

export function isObject(obj) {
  return obj === Object(obj);
}

export function capitalize(str:string = '', type:string = '') {
  if (type.toUpperCase() == 'ALL') return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const processTextAndAppendElipsis = (text:string, max:number):string => {
  let result;
  if (text.length > max) {
    result = `${text.substring(0, max - 3)}...`;
  } else {
    result = text;
  }
  return result;
};

export const getFormattedDateTimeWithTime = timestampInMillis => {
  if (timestampInMillis === undefined) return 'NA';

  // var timeStamp = timestampInMillis + 19800000;
  const todayTime = new Date(timestampInMillis);
  const content = todayTime.toUTCString().split(' ');
  let time;
  if (content && content.length && content[4]) {
    time = content[4].split(':');
  } else {
    return 'NA';
  }
  const x = {
    minutes: time[1],
    hours: time[0],
    dayNum: content[1],
    month: content[2],
    year: content[3],
    day: content[0],
  };
  return `${x.dayNum} ${x.month} ${x.year} ${x.hours}:${x.minutes}`;
};
