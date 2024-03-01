import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, ActivityIndicator, BackHandler} from 'react-native';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import {connect} from 'react-redux';
import VerticleVideoListItem from './VerticleVideoListItem';
import RBSheet from 'react-native-raw-bottom-sheet';
import LangSheet from './LangSheet';
import {GetLiveOfferList} from '../ShopgLive/redux/actions';
import ViewPager from '@react-native-community/viewpager';
import {LogFBEvent, Events} from '../../../Events';
import NavigationService from '../../../utils/NavigationService';
import { scaledSize, heightPercentageToDP, widthPercentageToDP } from '../../../utils';
import { language } from 'i18next';

class VerticleVideoList extends Component {
  constructor(props) {
    super(props);
    let selectedLanguage;
    if(this.props.i18n.language==='english') {
      selectedLanguage = this.props.login.userPreferences.areaLanguage ? this.props.login.userPreferences.areaLanguage : this.props.i18n.language;
    } else  {
      selectedLanguage = this.props.i18n.language;
    }
    this.state = {
      activeIndex: 0,
      isLoading:false,
      selectedTagSlug:'',
      selectedLanguage: selectedLanguage,
      currentTime:0,
      playableDuration:0,
      seekableDuration:0,
      playOfferId:0,
      activeId: 0,
      height: heightPercentageToDP(81)
    };
  }

  componentWillMount = () => {
    BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );  
  }
  
  componentDidMount() {
      if(this.props.navigation 
        && this.props.navigation.state
        && this.props.navigation.state.params
        && this.props.navigation.state.params.selectedTagSlug){
          this.setState({
            selectedTagSlug:this.props.navigation.state.params.selectedTagSlug,
          })
      }

      this.props.dispatch({type: 'home/SET_STATE', 
        payload: {
          isVerticalVideoScreen: true
      }});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!nextProps.isVerticalVideoScreen && this.props.isVerticalVideoScreen) return false;  
    if(!nextProps.isVerticalVideoScreen && !this.props.isVerticalVideoScreen) return false;  
    return true;
  }
  

  componentDidUpdate(nextProps) {
    const {liveLoading,offerList,dispatch,videoShowOfferList} = this.props;
    let isVideoRelevance = this.props.navigation.getParam('isVideoRelevance')
    const {isLoading,selectedTagSlug} = this.state;
    if(liveLoading && !isLoading){
      this.setState({isLoading:true})
    } else if(!liveLoading && isLoading ){
      
      let listToShow = [];
      if(offerList && offerList.length && offerList.length>0){
        offerList.map(offer => {
          if(offer.tag==selectedTagSlug){
            listToShow = [...offer.data];
          }
        })
      }
     
      if(videoShowOfferList.length != listToShow.length){
        this.setState({isLoading:false,})
        dispatch({
          type: 'shopglive/SET_STATE',
          payload: {videoShowOfferList : isVideoRelevance ? videoShowOfferList : listToShow},
        });
      }
      
    } 

    if (nextProps.navigation.getParam('isVideoRelevance') !== this.props.navigation.getParam('isVideoRelevance')) {
      this.setState({activeId: this.props.selectedVideoIndex})
    }
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );  
  }

  handleBackButtonClick() {
      NavigationService.goBack();
      return true;
  }

  onLoadMore = () => {
    const {selectedTagSlug} = this.state;
    const {offerList,videoShowOfferList} = this.props;
    if(videoShowOfferList.length>1){
      let listToShow = [];
      if(offerList && offerList.length && offerList.length>0){
        offerList.map(offer => {
          if(offer.tag==selectedTagSlug){
            listToShow = [...offer.data];
          }
        })
      }
      
      const page = Math.ceil(listToShow.length / 5) + 1;
      this.props.getOffers(selectedTagSlug,page)
    }
  };

  onPageSelected = (e: PageSelectedEvent) => {
    const {videoShowOfferList} = this.props;
    const page = e.nativeEvent.position;
    this.setState({activeIndex: page})
    if(page==(videoShowOfferList.length-1)){
      this.onLoadMore()
    }

    this.sendVideoPlayEvent();
  };

  sendVideoPlayEvent = () => {
    const {currentTime,playableDuration,seekableDuration,playOfferId} = this.state;
    if(playOfferId!=0){
      LogFBEvent(Events.SHOPG_VIDEO_PLAYTIME, 
        { offerId:playOfferId,
          videoPlayTime:currentTime,
          videoBufferedTime:playableDuration,
          videoTotalLength:seekableDuration
        });
    }

  }

  closeWindow = () => {
    this.props.dispatch({type: 'home/SET_STATE', 
      payload: {
        isVerticalVideoScreen: false
    }});
    this.sendVideoPlayEvent();
    NavigationService.goBack();
  } 

  handleBottomAction = () => {
    this.RBSheet && this.RBSheet.open();
  };

  changeVideoLanguage = (language) => {
    this.setState({
      selectedLanguage: language
    })
    this.handleCloseBottomSheet();
  }

  handleCloseBottomSheet = () => {
    this.RBSheet && this.RBSheet.close();
  };

  onProgress = (id,currentTime,playableDuration,seekableDuration) => {
    this.setState({playOfferId:id,currentTime:currentTime,playableDuration:playableDuration,seekableDuration:seekableDuration});
  }

  onError = () => {
    this.setState({})
  }

  render() {
    const {t, videoShowOfferList,selectedVideoIndex, login, selectedTag} = this.props;
    let parentNavigation = this.props.navigation.dangerouslyGetParent().state.routes[0];
    let prevRoute =
      parentNavigation &&
      parentNavigation.routes &&
      parentNavigation.routes[parentNavigation.index] &&
      parentNavigation.routes[parentNavigation.index].routeName;
    let type = prevRoute;
    let isVideoRelevance = this.props.navigation.getParam('isVideoRelevance')
    let  widgetId = this.props.navigation.getParam('widgetId');
    let title =  this.props.navigation.getParam('title');
    let widgetType = this.props.navigation.getParam('widgetType');
    let noCart = this.props.navigation.getParam('noCart');
    let page = this.props.navigation.getParam('page');
    let category = this.props.navigation.getParam('category');

    return (
      <View style={styles.container} key={''+this.state.activeId}>
        <ViewPager 
          key={''+this.state.activeId}
          style={styles.container}
          //initialPage={selectedVideoIndex}
          onPageSelected={this.onPageSelected}
          initialPage={(videoShowOfferList.length && videoShowOfferList.length>1) ? selectedVideoIndex : 0} 
          orientation='vertical'>
          {videoShowOfferList.map((item,index) => {
              return (
                <View key={''+item}>
                  <VerticleVideoListItem 
                    activeIndex={this.state.activeIndex}
                    listIndex={index}
                    widgetId={widgetId}
                    widgetType={widgetType}
                    noCart={noCart}
                    page={page}
                    title={title}
                    category={category}
                    selectedVideoIndex={selectedVideoIndex}
                    listLength={videoShowOfferList.length} 
                    item={item}
                    type={type}
                    selectedTag={this.state.selectedTagSlug}
                    selectedLanguage={this.state.selectedLanguage}
                    isVideoRelevance={isVideoRelevance}
                    closeWindow={this.closeWindow}
                    horizontalIndex={(videoShowOfferList.length && videoShowOfferList.length==1) ? selectedVideoIndex : 0}
                    changeVideoLanguage={this.handleBottomAction}
                    onProgress={(id,currentTime,playableDuration,seekableDuration) => this.onProgress(id,currentTime,playableDuration,seekableDuration)}
                    />
                </View>
              );
          })}
        </ViewPager>
        <RBSheet
          key={'Language'}
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={250}
          duration={250}
          closeOnDragDown={true}
          customStyles={{
            container: {
              alignItems: 'center',
              borderRadius: 10,
            },
          }}>
          <LangSheet selectedLanguage={this.state.selectedLanguage} changeVideoLanguage={this.changeVideoLanguage} closeAction={this.handleCloseBottomSheet} />
        </RBSheet>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
});

const mapStateToProps = state => ({
  videoShowOfferList: state.ShopgLive.videoShowOfferList,
  selectedVideoIndex: state.ShopgLive.selectedVideoIndex,
  offerList: state.ShopgLive.liveOfferList,
  selectedTag: state.ShopgLive.selectedTag,
  liveLoading: state.ShopgLive.liveLoading,
  login: state.login,
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  isVerticalVideoScreen: state.home.isVerticalVideoScreen,
  totalCartItems: state.home.totalCartItems,
  groupSummary: state.groupSummary,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getOffers: (tag,page) => {
    dispatch(GetLiveOfferList(tag,page));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(VerticleVideoList),
);