import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import DataListItemCoin from './DataListItemCoin';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events} from '../../Events';
import {AppText} from '../Texts';
import NavigationService from '../../utils/NavigationService';
import {GetLiveOfferList} from '../../native/pages/ShopgLive/redux/actions';
import { Image } from 'react-native-elements';
import { showToastr } from '../../native/pages/utils';

export class DataListCoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(1),
      hasScrollingStarted: false
    };
  }

  componentDidMount() {
    const {
      selectedTag,
      category,
      widgetId,
      position,
      widgetType,
      page,
    } = this.props;
    // this.props.getOffers(selectedTag.slug, 1);
    
    LogFBEvent(Events.OFFER_LIST_IMPRESSION, {
      slug: selectedTag.slug,
      category: category,
      widgetId: widgetId,
      position: position,
      page: page,
      widgetType: widgetType,
    });
  }

  onLoadMore = () => {
    const {offerList} = this.props;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    }

    let pageSize = 5;
    if(listToShow.length>=pageSize){
    const page = Math.ceil(listToShow.length / 5) + 1;
    this.props.getOffers(this.props.selectedTag.slug, page);
    }
  };

  fadeOut = () => {
    if (!this.state.hasScrollingStarted) {
      this.setState({ 
        animation: this.state.animation,
        hasScrollingStarted: true
      });
    }
  }
        

  headerComponent = () => {
    let {offerList,samplingUrl, widgetType, leftPadding} = this.props;
    const {hasScrollingStarted} = this.state;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    }
    if ((listToShow && listToShow.length && listToShow.length == 1) || (widgetType === 'samplingRelevance' || widgetType === 'coinSampleRelevance') && (samplingUrl && !hasScrollingStarted)) {
      return (
        <View
          style={[styles.imageView, {width: widthPercentageToDP(leftPadding)}]}>
        </View>
      );
    } else {
      return null;
    }
  };

  handleOtherItemClick = item => {
    const {
      dispatch,
      widgetId,
      position,
      page,
      category,
      widgetType,
    } = this.props;
    LogFBEvent(Events.OFFER_LIST_CLICK_PDP, {
      offerId: item.offerinvocations.offerId,
      widgetId: widgetId,
      position: position,
      page: page,
      category: category,
      widgetType: widgetType,
    });
    dispatch({
      type: 'booking/SET_STATE',
      payload: {
        refreshScreen: true,
        booking: item,
        quantity: 1,
        sourceComponent:'ClaimCoins'
      },
    });
    NavigationService.navigate('Booking');
  };

  videoClick = index => {
    const {offerList, dispatch} = this.props;
    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];
        }
      });
    }

    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {
        videoShowOfferList: listToShow,
        selectedVideoIndex: index,
      },
    });

    NavigationService.navigate('VerticleVideoList', {
      selectedTagSlug: this.props.selectedTag.slug,
    });
  };

  render() {
    const {
      offerList,
      screenName,
      widgetId,
      widgetType,
      category,
      position,
      page,
      dispatch,
      viewStyle,
      language, 
      imageWidth, 
      endItemPress,
    } = this.props;

    let listToShow = [];
    if (offerList && offerList.length && offerList.length > 0) {
      offerList.map(offer => {
        if (offer.tag == this.props.selectedTag.slug) {
          listToShow = [...offer.data];

          dispatch({
          type: 'shopglive/SET_STATE',
          payload: {
            productName: listToShow[0].mediaJson.title.text,
          },
        });
        }
      });
    }

    return (
      <View style={[styles.dataContainer, viewStyle]}>
        <View style={styles.listInner}>
          <FlatList
            horizontal={true}
            onEndReached={() => this.onLoadMore()}
            onEndReachedThreshold={0.01}
            data={listToShow}
            extraData={listToShow}
            onScroll={this.fadeOut}
            ListHeaderComponent={this.headerComponent}
            renderItem={({item, index}) => {
              return(
                <DataListItemCoin
                  showViewAll={listToShow.length && (listToShow.length>1) && (listToShow.length == index + 1)}
                  imageWidth={imageWidth}
                  widgetId={widgetId}
                  category={category}
                  position={position}
                  page={page}
                  widgetType={widgetType}
                  screenName={screenName}
                  item={item}
                  onPress={() => this.handleOtherItemClick(item)}
                  index={index}
                  language={language}
                  videoClick={() => this.videoClick(index)}
                  endItemPress={endItemPress}
                />
                )
              }
            }
            keyExtractor={item => item.refId}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    dataContainer: {
      justifyContent: 'center',
      height:heightPercentageToDP(35),
      alignItems:'center',
      //backgroundColor:'white',
      borderRadius:scaledSize(5),
    },
    dataListContainer:{
      height:heightPercentageToDP(26),
      width:widthPercentageToDP(39),
      alignSelf:'center',
      alignItems:'center',
      justifyContent:'center'
    },
    listInner:{
      width:widthPercentageToDP(97),
      paddingHorizontal:widthPercentageToDP(0.8)
    },
    imageView: {
      marginRight: widthPercentageToDP(2),
      justifyContent: 'center',
    }
});

const mapStateToProps = state => ({
    offerList: state.ShopgLive.liveOfferList,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    getOffers: (tag,page) => {
      dispatch(GetLiveOfferList(tag,page));
    },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(DataListCoins))
);