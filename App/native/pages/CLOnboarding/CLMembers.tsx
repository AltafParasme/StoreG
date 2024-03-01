import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {AppText} from '../../../components/Texts';
import { Dropdown } from 'react-native-material-dropdown';
import {LogFBEvent, Events} from '../../../Events';
import idx from 'idx';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../utils';
import {Constants} from '../../../styles';
import {processTextAndAppendElipsis} from '../../../utils/misc';
import {groupMemberLimit} from '../../../Constants';
import {getGroupSummary} from '../OrderConfirmation/actions';
import {getGroupMembers} from './actions';
import {memberContactWhatsapp, invokeDialler} from '../utils';
import {getFormattedDateFromNumberofDays} from '../OrderConfirmation/utils';

let data = [{
  value: 'Last 7 days',
  days: '7'
}, {
  value: 'Last 14 days',
  days: '14'
}, {
  value: 'Last 30 days',
  days: '30'
}];

class CLMembers extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let currentDate = moment.utc(new Date());
    let endDate = currentDate.local().format('YYYY-MM-DD HH:mm');
    let startDate = getFormattedDateFromNumberofDays(7);
    this.props.onGetGroupMembers(groupMemberLimit, startDate, endDate);
  }

  activityContent = (valueItem, index) => {
    
    let name = valueItem.name;
    let clNumber = valueItem.phoneNumber;
    let totalPrice = valueItem.totalPrice;
    if (valueItem.phoneNumber.length === 10) {
      clNumber = '91'.concat(clNumber);
    }
    let first = name
      && name
      .split(' ')
      .slice(0, 1)
      .join(' ');
    let initial =
      first &&
      first
        .split(' ')
        .map(function(s) {
          return s.charAt(0);
        })
        .join('');
    let colors = ['#123456', '#654321', '#8B008B', '#abcdef'];
    let distance = valueItem.roadDistance ? valueItem.roadDistance : (valueItem.airDistance ? valueItem.airDistance : null);
    
    let eventProps = {
      memberName: name,
      memberNumber: clNumber,
      distanceFromCL: distance
    };

    return (
      <View style={styles.flatlistRenderView}>
        <View style={styles.feedContainer}>
          <View
            style={[
              styles.circleUserView,
              {backgroundColor: colors[index % colors.length]},
            ]}>
            <AppText white style={{textAlign: 'center'}}>
              {initial}
            </AppText>
          </View>

          <View style={styles.flatListTextInfoView}>
            <AppText size="S" style={{textAlign: 'left'}}>
              <AppText bold>{processTextAndAppendElipsis(name, 17)}</AppText>{distance ? (
              <AppText size="S" style={{textAlign: 'left', color: '#646464'}}>{` - ${distance}m away`}</AppText>) : null}
            </AppText>
            {totalPrice ? (
            <AppText size="S" style={{textAlign: 'left', color: '#646464'}}>{`Purchased for ₹${totalPrice}`}</AppText>) : null}
          </View>
          <View>
          </View>
        </View>

        <View style={styles.whatsappIconView}>
          <TouchableOpacity
            onPress={() => invokeDialler(clNumber, eventProps)}
            style={{marginRight: widthPercentageToDP(2), marginBottom: heightPercentageToDP(0.5)}}>
            <Icon
              name={'phone'}
              size={25}
              containerStyle={{
                alignSelf: 'center',
              }}
              color={Constants.greenishBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            elevation={2}
            onPress={() => memberContactWhatsapp(clNumber, eventProps)}
            style={styles.whatsappCircleGroupDeal}>
            <Icon
              type="font-awesome"
              name="whatsapp"
              color={Constants.white}
              size={widthPercentageToDP(6)}
              containerStyle={{
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {t, clUsers, loadingMembersData} = this.props;
    
    let userInfo = clUsers.map(data => {
      return {name: data.name, phoneNumber: data.phoneNumber, roadDistance: data.roadDistance, airDistance: data.airDistance, totalPrice: data.totalPrice };
    });

    return (
      <View style={{flex: 1}}>
        <View style={styles.filter}>
          <Dropdown
            label=''
            value={data[0].value}
            containerStyle={{ flex: 0.4, justifyContent: 'flex-end'}}
            data={data}
            onChangeText={(value, index, data) => {
              let currentDate = moment.utc(new Date());
              let endDate = currentDate.local().format('YYYY-MM-DD HH:mm');
              let startDate = getFormattedDateFromNumberofDays(data[index].days);
              this.props.onGetGroupMembers(groupMemberLimit, startDate, endDate);
            }}
          />
        </View>
        {loadingMembersData ? (<View style={styles.activityIndicator}>
          <ActivityIndicator
            color="black"
            size="large"
          />
        </View>) :
        (<View style={[styles.flatlistView]}>
          <FlatList
            data={userInfo}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: heightPercentageToDP(2)}}
            renderItem={value => this.activityContent(value.item, value.index)}
            scrollEnabled={true}
          />
        </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filter: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: widthPercentageToDP(4)
  },
  flatlistView: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(6),
  },
  feedContainer: {
    flexDirection: 'row',
    marginTop: heightPercentageToDP(1),
    padding: heightPercentageToDP(1),
    flex: 1,
    height: heightPercentageToDP(5),
  },
  circleUserView: {
    width: scaledSize(40),
    height: scaledSize(40),
    borderRadius: 40 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  flatListTextInfoView: {
    //alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPercentageToDP(3),
    //flexDirection: 'row'
  },
  flatlistRenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthPercentageToDP(96),
    marginTop: heightPercentageToDP(2),
  },
  whatsappIconView: {
    alignItems: 'flex-end',
    flex: 0.35,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: widthPercentageToDP(2),
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
    elevation: 6,
  },
  activityIndicator: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  clUsers: state.clOnboarding.clUsers,
  loadingMembersData: state.clOnboarding.loadingMembersData
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onGetGroupMembers: (limit: any, startDate: string, endDate: string) => {
    dispatch(getGroupMembers(limit, startDate, endDate));
  }
});
export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CLMembers),
);
