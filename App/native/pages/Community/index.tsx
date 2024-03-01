import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Platform,
  Dimensions,
  BackHandler
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../utils/index';
import {Icon, Header, ButtonGroup} from 'react-native-elements';
import {Fonts, Colors} from '../../../../assets/global';
import {Constants} from '../../../styles';
import {Images} from '../../../../assets/images/index';
import {AppText} from '../../../components/Texts';
import {TabView, TabBar} from 'react-native-tab-view';
import {GetCommunityData,GetCurrentCommunityData} from './redux/actions';
import CommunityWidgetContainer from './CommunityWidgetContainer';
import AddPost from './Components/AddPost';
import Modal from 'react-native-modal';
import CreatePost from './CommunityWidgets/CreatePost';
import {specialCaseWidgets} from '../../../Constants';
import {getLiveOfferListInBulk} from '../Home/redux/action';
import NavigationService from '../../../utils/NavigationService';
import {changeField} from '../Login/actions';

const NAVBAR_HEIGHT = heightPercentageToDP(8);
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 0});

const initialLayout = {width: Dimensions.get('window').width};
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-community/voice';
import { showToastr } from '../utils';

export class Community extends Component {

  constructor(props) {
    super();
    this.state = {
      activeIndex:0,
      categoryObj:[],
      showCreatePost:false
    };
    this.renderScene = this.renderScene.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.openCreatePost = this.openCreatePost.bind(this);
    this.closeCreatePost = this.closeCreatePost.bind(this);
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    Voice.destroy().then(Voice.removeAllListeners);
  }

  _startRecognizing = async () => {
    try {
      let voiceAvailable = await Voice.isAvailable();
      if(voiceAvailable) await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    // this.setState({
    //   postComment: e.value,
    // });
    showToastr(''+e.value)
  };

  handleBackButtonClick() {
    NavigationService.navigate('Home');
    return true;
  }

  updateIndex = index => {
    this.setState({
      activeIndex: index,
    });

    const {categoryObj} = this.state;
    const {dispatch,getCurentComunityData} = this.props;
    const communityId = categoryObj[index].CommunityId;
    LogFBEvent(Events.CHANGE_COMMUNITY_CLICK, {communityId:communityId});
    getCurentComunityData(communityId,1,10,callback = () => {
      this.getAllTagsItems()
    });
    dispatch({
      type: 'comunity/SET_STATE',
      payload: {
        selectedCommunityId:communityId
      },
    });
  };

  renderTabBar = (props) => {
    const {t} = this.props;
    const {categoryObj} = this.state;
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: Constants.orange}}
        getLabelText={({ route }) => route.CommunityName}
        style={{
          backgroundColor: Constants.white,
        }}
        tabStyle={{width: widthPercentageToDP(35), height: heightPercentageToDP(7)}}
        labelStyle={{fontSize: 14}}
        inactiveColor={Constants.grey}
        scrollEnabled={true}
        pressColor={Constants.orange}
        renderLabel={({ route, focused, color }) => (
          <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',width:widthPercentageToDP(35),height:heightPercentageToDP(7)}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <AppText style={{ color:focused ? Constants.orange : 'black',textAlign:'center' }} bold size="XS">{route.CommunityName}</AppText>
                <AppText style={{ color:Constants.primaryColor,textAlign:'center' }} bold size="XS">{t('Community ')}</AppText>
              </View>
              <View style={{marginLeft:widthPercentageToDP(1),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Image
                    style={styles.memberIndicator}
                    source={focused ? Images.community_member_focused : Images.community_member}
                  />
                  <AppText style={{ marginLeft:widthPercentageToDP(1),color:focused ? Constants.orange : 'black',textAlign:'center' }} size="XXS">{route.CoummunityMembersCount}</AppText>
              </View>
          </View>
        )}
        activeColor={Constants.orange}
        onTabPress={({ route, preventDefault }) => {
          preventDefault();
          this.updateIndex(route ? categoryObj.indexOf(route) : 0)
        }}
      />
    );
  }

  renderScene = ({route}) => {
    return <CommunityWidgetContainer route={route} _startRecognizing={this._startRecognizing}/>;
  };

  getAllTagsItems = () => {
    const {offerList,currentComunityWidgetList,getOffersListInBulk} = this.props;
    if (currentComunityWidgetList.length > 0 && currentComunityWidgetList.length) {
      let tags = '';
      currentComunityWidgetList.map(widgets => {
        let tag = '';
        let isWidgetPresent = widgets.page.find(element => element === 'community');
          if (isWidgetPresent) {
            if(widgets.widgetType == 'bannerRelevance') {
              tag = `${widgets.widgetData.bannerJson['english'][0].tags[0].slug}`;
            }else if(specialCaseWidgets.includes(widgets.widgetType)){
              //do nothing
            }else if(widgets.widgetData && widgets.widgetData.tags && widgets.widgetData.tags.length)
              tag = `${widgets.widgetData.tags[0].slug}`;
          }
          let isAlreadyPresent = false;
          offerList.map(offer => {
            if (offer.tag == tag && !isAlreadyPresent) {
              isAlreadyPresent = true;
            }
          });
          if(tag !='') {
            if(!isAlreadyPresent){
              tags += `${tag},`
            }
          } 
      })

      if (tags) {
        tags = tags.substring(0, tags.length - 1);
        getOffersListInBulk(tags, 1, 5);
      }
    }
  }

  componentDidMount = () => {
    SetScreenName(Events.LAUNCH_COMMUNITY.eventName());
    LogFBEvent(Events.LAUNCH_COMMUNITY, null);
    this.onLoadComponent();
  }

  onLoadComponent = () => {
    const {getCurentComunityData,dispatch} = this.props;
    this.props.getComunity(1,10, callback = (communities) => {
      if(communities){
        const communityId = communities[0].CommunityId;
        this.setState({categoryObj:communities})
        LogFBEvent(Events.CHANGE_COMMUNITY_CLICK, {communityId:communityId});
        getCurentComunityData(communityId,1,10,callback = () => {
          this.getAllTagsItems();
        });
        dispatch({
          type: 'comunity/SET_STATE',
          payload: {
            selectedCommunityId:communityId
          },
        });
      }
    });
  }

  openCreatePost = () => {
    const {isLoggedIn} = this.props;
    if(!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'Community');
      NavigationService.navigate('Login', {callback:  () => {
        this.setState({showCreatePost:true})
      }});
    }
    else {
      this.setState({showCreatePost:true});
    }
  }

  closeCreatePost = () => {
    this.setState({showCreatePost:false});
  }

  render() {
    const {t,comunityLoading} = this.props;
    const {activeIndex,categoryObj} = this.state;
    if(comunityLoading){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('Processing Community Data ... ')}
          </AppText>
          <View style={styles.emptyView}/>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if(!categoryObj || !categoryObj.length){
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AppText size="L" bold black>
            {t('No communitites found for you!')}
          </AppText>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View
          style={styles.headerView}>
          <View style={styles.headerContainerStyle}>
            <View style={{width:widthPercentageToDP(3),height:5}} />
            <Image
              style={styles.mallImageContent}
              source={Images.clGroup}
            />
            <View style={{width:widthPercentageToDP(3),height:5}} />
            <AppText size="M" bold greenishBlue>
              {t(`Your Communities`)}
            </AppText>
            </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.tabContainer}>
            <TabView
              navigationState={{index: activeIndex, routes: categoryObj}}
              renderScene={this.renderScene}
              onIndexChange={this.updateIndex}
              initialLayout={initialLayout}
              renderTabBar={this.renderTabBar}
              lazy
              lazyPreloadDistance={1}
              swipeEnabled={false}
            />
          </View>
          <View style={{flex:0.08}}>
            <AddPost 
              t={t}
              onPress={this.openCreatePost}
              coinValue={(categoryObj && categoryObj[activeIndex] && categoryObj[activeIndex].addPostCoinValue) ? categoryObj[activeIndex].addPostCoinValue : 50}
              containerStyle={styles.addPostContainer}/>
          </View>
        </View>

        <Modal
          isVisible={this.state.showCreatePost}
          onBackButtonPress={this.closeCreatePost}>
            <CreatePost 
              t={t} 
              onClosePress = {this.closeCreatePost}
              onPostCreated={() => this.setState({showCreatePost:false})}/>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  componentContainer: {
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  tabBar: {
    height: heightPercentageToDP(8),
    backgroundColor: "white",
    flexDirection:'row',
    alignItems:'center'
  },
  tabContainer:{
    flex:0.92
  },
  mainContainer:{
    flex:1,
    marginTop:NAVBAR_HEIGHT
  },
  container: {
    flex: 1,
  },
  headerView: {
    paddingTop: STATUS_BAR_HEIGHT,
    height: NAVBAR_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowOffset: {width: 1, height: 1},
    shadowColor: Colors.darkBlack,
    shadowOpacity: 15,
    elevation: 10,
  },
  headerContainerStyle: {
    backgroundColor: Constants.white,
    height: NAVBAR_HEIGHT,
    flexDirection:'row',
    alignItems:'center'
  },
  mallImageContent: {
    width: heightPercentageToDP(4),
    height: heightPercentageToDP(4),
    resizeMode: 'contain',
  },
  memberIndicator: {
    width: heightPercentageToDP(1.5),
    height: heightPercentageToDP(1.5),
    resizeMode: 'contain',
  },
  categoryTabView: {
    marginTop: NAVBAR_HEIGHT,
    marginBottom:heightPercentageToDP(5),
  },
  emptyView:{
    height:heightPercentageToDP(1),
    width:widthPercentageToDP(100)
  },
  addPostContainer:{
    flex:1,
  }
});

const mapStateToProps = state => ({
  language: state.home.language,
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  userPref: state.login.userPreferences,
  totalCartItems: state.home.totalCartItems,
  groupSummary: state.groupSummary,
  liveLoading: state.ShopgLive.liveLoading,
  communityList:state.community.communityList,
  comunityLoading:state.community.comunityLoading,
  currentComunityWidgetList:state.community.currentComunityWidgetList,
  offerList: state.ShopgLive.liveOfferList,
  isLoggedIn: state.login.isLoggedIn
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  getComunity: (page, size,callback) => {
    dispatch(GetCommunityData(page, size,callback));
  },
  getCurentComunityData: (id,page, size,callback) => {
    dispatch(GetCurrentCommunityData(id,page, size,callback));
  },
  getOffersListInBulk: (tags,page,size) => {
    dispatch(getLiveOfferListInBulk(tags,page,size));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  }
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(Community)
);