import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {withTranslation} from 'react-i18next';
import {connect, Dispatch} from 'react-redux';
import moment from 'moment';
import idx from 'idx';
import {GetLiveOfferList} from '../../ShopgLive/redux/actions';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {shareOfferOnWhatsApp, showToastr} from '../../utils';
import {getRewards} from '../actions';
import {liveAnalytics} from '../../ShopgLive/redux/actions';
import ProductShareItem from './ProductShareItem';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images/index';
import {Events} from '../../../../Events';

class ProductShareBase extends PureComponent {
  constructor(props) {
    super(props);
    this.shareOffer = this.shareOffer.bind(this);
    this.state = {
      shareLoading:false,
      selectedProductId:''
    };
  }

  componentDidMount = () => {
      this.props.getOffers(this.props.data.tag, 1, 21);
  }

  shareOffer = (item) => {
    const {t, widgetId, pointsPerTask, groupSummary, userPref, clMediumLogoImage} = this.props;
   
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };

    let eventProps = {
     widgetId: widgetId,
     taskId: widgetId,
     component: 'EARN_COINS'
    };

    this.setState({shareLoading:true})
    this.setState({selectedProductId:item.id})

    shareOfferOnWhatsApp(clMediumLogoImage,this.props.screen,'ProductShare',t, groupSummary, item, eventProps, null, pointsPerTask, userPrefData,
      callback = () => {
        this.setState({shareLoading:false})
        this.props.onCompleteTask(item.id)
      });
   
  }

  render() {
    
    const {t, data, offerList, pointsPerTask} = this.props;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.data.tag) {
          listToShow = [...offer.data];
        }
      });
    }

    const {shareLoading,selectedProductId} = this.state;
    
    return (
      <View style={{flex: 1}}>
        <View style={styles.cardStyle}>
        <FlatList
          horizontal={true}
          refreshing={false}
          data={listToShow}
          renderItem={({item, index}) => (
            <ProductShareItem
              shareLoading={shareLoading}
              item={item}
              selectedProductId={selectedProductId}
              index={index}
              shareOffer={this.shareOffer}
              pointsPerTask={pointsPerTask}
            />
          )}
          keyExtractor={item => item.id}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <AppText style={{ color: '#7a7a7a'}}>{t(`Coins credited when link opened`)}</AppText>
        </View>
        </View>
       </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1, 
    height: heightPercentageToDP(46), 
    marginLeft: widthPercentageToDP(2),
    marginVertical: heightPercentageToDP(1),
  },
  
});

const mapStateToProps = state => ({
  rewards: state.rewards,
  userPref: state.login.userPreferences,
  offerList: state.ShopgLive.liveOfferList,
  groupSummary: state.groupSummary,
  clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    getOffers: (tag,page,size) => {
        dispatch(GetLiveOfferList(tag,page,size));
    },
    onAnalytics: (eventName, eventData, userPrefData) => {
        dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
    onGetRewards: (getCashback, getCoins, getScratchDetails ,history,page, size) => {
        dispatch(getRewards(getCashback, getCoins, getScratchDetails ,history,page, size));
    },
});

const ProductShare = withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(ProductShareBase)
);

export default ProductShare;
