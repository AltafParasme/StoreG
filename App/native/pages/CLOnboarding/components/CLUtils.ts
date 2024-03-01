import moment from 'moment';

export const setStartDate = month => {
  let first = moment(month)
    .startOf('month')
    .format('DD-MMM-YYYY');
  let firstWeeknumber = moment(first).week();
  let firstDate = moment()
    .week(firstWeeknumber)
    .startOf('week')
    .add(1, 'day')
    .local()
    .format('YYYY-MM-DD');

  let last = moment(month)
    .endOf('month')
    .format('DD-MMM-YYYY');
  let lastWeeknumber = moment(last).week();

  let lastDate = moment()
    .week(lastWeeknumber)
    .endOf('week')
    .add(1, 'day')
    .local()
    .format('YYYY-MM-DD');
    
  let retObj = {
    firstDate: firstDate,
    lastDate: lastDate,
  };
  return retObj;
};

export const getRouteTab = (firstDate, lastDate) => {
  
  let diff = moment(lastDate, 'YYYY-MM-DD').diff(
    moment(firstDate, 'YYYY-MM-DD'),
    'days',
  );
  let dateArray = [];
  let end = '';
  let endWeekDate = '';
  let count = 0;
  let tab = 0;

  while (diff >= 0) {
    end = moment(firstDate, 'YYYY-MM-DD').add(6, 'days');
    let startDayWeek = moment(firstDate).week();
    let currentDate = moment.utc(new Date());
    let currentDateLocal = currentDate.local().format('YYYY-MM-DD HH:mm');
    let currentWeek = moment(currentDateLocal).week();
    
    if (startDayWeek === currentWeek) {
      let lastDate =  moment(firstDate, 'YYYY-MM-DD')
      .subtract(1, 'days').format('YYYY-MM-DD') === currentDateLocal.split(' ')[0];
      if (moment(firstDate).month() === moment(new Date()).month()) {
         if (lastDate) {
            tab = count - 1
         } else {
            tab = count
         }
      }
    }
    let startWeekDate = moment(firstDate).format('MMM DD'), endWeekDateTitle;
    let startDateForApi = moment(firstDate).format('DD');
    if (moment(firstDate).format('MMM') === moment(end).format('MMM')) {
      endWeekDate = moment(end).format('DD');
      //endWeekDateTitle = moment(end).format('DD MMM');
      endWeekDateTitle = endWeekDate
    } else {
      endWeekDateTitle = moment(end).format('MMM DD');
      //startDateForApi = moment(firstDate).format('DD MMM');
      endWeekDate = moment(end).format('DD MMM');
    }
   
    dateArray.push({
      key: `w${count + 1}`,
      title: `${startWeekDate}-${endWeekDateTitle}`,
      startDate: startDateForApi+'-'+moment(end).format('DD MMM YYYY')
    });
    firstDate = moment(end).add(1, 'days');
    diff = moment(lastDate, 'YYYY-MM-DD').diff(
      moment(firstDate, 'YYYY-MM-DD'),
      'days',
    );
    count += 1;
  }
  let retObj = {
    dateArray: dateArray,
    tab: tab,
  };
  return retObj;
};
