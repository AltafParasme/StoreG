import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import {AppText} from '../../../../components/Texts';
import {shareToWhatsAppCLTasks, buildDeepLink} from '../../utils';
import {LogFBEvent, Events} from '../../../../Events';
import {connect} from 'react-redux';
import {Constants} from '../../../../styles';
import NavigationService from '../../../../utils/NavigationService';
import TaskImagesRender from '../../../pages/CLOnboarding/components/taskComponents/TaskImagesRender';
import TaskShareWhatsapp from '../../../pages/CLOnboarding/components/taskComponents/TaskShareWhatsapp';
import {
  widthPercentageToDP,
  scaledSize,
  heightPercentageToDP,
} from '../../../../utils';

class CoinShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: new Array(props.data.imageQuantity).fill({}),
      activeAvatar: 0,
      shareLoading:false
    };
    this.shareWhatsapp = this.shareWhatsapp.bind(this);
    this.takeToImageViewer = this.takeToImageViewer.bind(this);
  }

  shareWhatsapp = async () => {
    const {t, userPref, data, widgetId, groupSummary, clBigLogoImage} = this.props;

    let imageUrlArr = [];
    let currentDate = moment.utc(new Date());
    let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
    let eventProps = {
      taskId: widgetId,
      widgetType: data.widgetType,
    };
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };
    const inviteToken = idx(groupSummary, _ => _.groupDetails.info.inviteToken);
    const link = await buildDeepLink('MyRewards','Earn_Coins',inviteToken,userPref.uid,widgetId);
    let message = t(
      `${data.shareMessage}#NL##NL##DEEPLINKURL##NL##NL#Limited stocks only`,
      {
        DEEPLINKURL: link || '',
        NL: '\n',
      },
    );
    try {
      /** to ensure the permission being granted, if granted then sharing images/ texts are confirmed */
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'ShopG wants to store images, media contents and files',
          message: 'ShopG wants to store images, media contents and files',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.state.data.map((item, index) => {
          imageUrlArr.push(
            `${data.imageUrl}/${currentDateLocal}-${index + 1}.png`
          );
        });
        // this.setState({shareLoading:true})
        // setTimeout(() => {
        //   this.setState({shareLoading:false})
        // }, 4000)
      
        shareToWhatsAppCLTasks(
          clBigLogoImage,
          eventProps,
          t,
          message,
          null,
          'EARN_COINS',
          imageUrlArr,
          this.props.onCompleteTask,
          userPrefData
        );
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  takeToImageViewer = index => {
    const {data} = this.props;

    let currentDate = moment.utc(new Date());
    let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
    let imageUrlArr = [];
    this.state.data.map((item, index) => {
      imageUrlArr.push({
        url: `${data.imageUrl}/${currentDateLocal}-${index + 1}.png`,
      });
    });
    if (imageUrlArr && imageUrlArr.length > 0 && imageUrlArr[index]) {
      NavigationService.navigate('ImageView', {
        url: imageUrlArr[index].url,
        index: index,
        restData: imageUrlArr,
      });
    }
  };

  render() {
    const {t, data, pointsPerTask} = this.props;
    const {shareLoading} = this.state;

    return (
      <View
        style={{
          //width: widthPercentageToDP(96),
          marginTop: heightPercentageToDP(2),
        }}>
        <FlatList
          data={this.state.data}
          horizontal
          renderItem={({item, index}) => (
            <TaskImagesRender
              data={item}
              index={index + 1}
              imageUrl={data.imageUrl}
              onPress={this.takeToImageViewer}
            />
          )}
        />
        {
          (shareLoading)
          ?
          <View style={styles.loaderStyle}>
            <ActivityIndicator color="black" size="small" />
          </View>
          :
          (data.shareKey)
          ?
          <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.shareWhatsapp} style={{}}>
              <TaskShareWhatsapp shareKey={data.shareKey} t={t} pointsPerTask={pointsPerTask}/>
            </TouchableOpacity>
            <AppText style={{ color: '#7a7a7a'}}>{t(`Coins credited when link opened`)}</AppText>
          </View>
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whatsappCircle: {
    marginHorizontal: widthPercentageToDP(3),
    backgroundColor: Constants.green,
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(35),
    height: scaledSize(35),
    borderRadius: 35 / 2,
  },
  taskSubstepsStyle: {
    color: '#222222',
    lineHeight: 21,
    paddingBottom: heightPercentageToDP(1),
    paddingRight: widthPercentageToDP(4),
  },
  horizontalLine: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    paddingTop: widthPercentageToDP(2.2),
    width: widthPercentageToDP(90),
  },
  shareData: {
    flexDirection: 'row',
    height: heightPercentageToDP(8),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(80),
  },
  activityView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderStyle:{
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  groupSummary: state.groupSummary,
  clBigLogoImage: state.clOnboarding.clBigLogoImage,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CoinShare)
);
