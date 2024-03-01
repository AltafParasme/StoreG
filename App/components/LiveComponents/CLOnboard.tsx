import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image, ImageBackground} from 'react-native';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import DataList from './DataList';
import ShareComponent from './ShareComponent';
import NavigationService from '../../utils/NavigationService';
import {LogFBEvent, Events} from '../../Events';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Constants } from '../../styles';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';

class CLOnboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTag: false,
      currentData: null,
    };
    this.onOverlayPress = this.onOverlayPress.bind(this);
  }

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType,page} = this.props;
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      page: page,
      widgetType:widgetType
    });
  }

  onOverlayPress = (component) => {
    const {
      itemData,
      category,
      widgetId,
      listItemIndex,
      page,
      widgetType,
    } = this.props;
    
    LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
      slug: this.state.currentData,
      category: category,
      widgetId: widgetId,
      position: listItemIndex,
      page: page,
      widgetType: widgetType,
      component:component
    });

    NavigationService.navigate('TagsItems', {
      screen: 'ActiveFlashSales',
      title: itemData.title ? itemData.title : itemData.description,
      selectedtagSlug: this.state.currentData && this.state.currentData.slug ? this.state.currentData.slug : itemData.bannerJson.english[0].tags[0].slug,
      withoutData: this.state.currentData ? false : true
    });
  };

 

  onClickBanner = () => {
    const {category,widgetId,index,listItemIndex,widgetType,page, itemData} = this.props;
    let action = null;
    itemData.bannerJson[language] && itemData.bannerJson[language].map(item => {
      action = item.action ? item.action : null
  })
    if (action === 'clOnboard') {
      NavigationService.navigate('CLOnboarding');
    } else {
      if (itemData.tags.length) {
        this.setState({
                currentTag: true,
               })
      }
    }
    LogFBEvent(Events.SHOPG_LIVE_CL_ONBOARD_CLICK,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      page: page,
      widgetType:widgetType
    });
  }

  render() {
    const {
      t,
      userPref,
      selectedTagName,
      itemData,
      widgetId,
      page,
      category,
      widgetType,
      index,
      isCLMode,
      language,
      liveLoading,
      userComponentData,
      listItemIndex,
    } = this.props;
    let carouselPropsEvents = {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      index: index,
      position: listItemIndex,
    };
    //let description = itemData.description;
    let message = itemData.message;
    let title = itemData.title;
    const imageBackground = itemData.backgroundImage;
    const backgroundColor = itemData.backgroundColor;
    let shareMsg = itemData.shareMsg;
    let shareKey = itemData.shareKey;
    let name =  userComponentData && userComponentData.userName;
    let members = userComponentData && userComponentData.groupMembers;
    let mssg = t(message)
    let url = '';
    itemData.bannerJson[language] && itemData.bannerJson[language].map(item => {
        url = item.url
    })
    const tag = itemData.tags[0];

    return !isCLMode ? (
      <BackgroundSelector
          backgroundImage={imageBackground}
          backgroundColor={'#ffff'}
          style={styles.dealContainer}>
          <View style={styles.mainContainer}>
            
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {message ? (
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP(2),
                    marginBottom: heightPercentageToDP(2),
                  }}>
                  <AppText bold style={{textAlign: 'center'}}>{mssg}</AppText>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{alignItems: 'center'}}>
            {
              this.state.currentTag ? (
                <View style={styles.dataContainer}>
    
                    <View style={styles.middleComponent}>
                      <DataList
                        heightDP={36}
                        selectedTag={tag}
                        position={this.props.listItemIndex}
                        widgetType={widgetType}
                        category={category}
                        page={page}
                        language={this.props.language}
                        widgetId={widgetId}
                        screenName="relevance"
                        endItemPress={() => this.onOverlayPress('dataList')}
                      />
                      
                      {
                        (liveLoading && (selectedTagName==tag.slug))
                        ?
                        <View style={[styles.behind,styles.activityIndicator]}>
                          <ActivityIndicator
                            color="black"
                            size="large"
                          />
                        </View>
                        :null
                      }
          
                    </View>
                </View>
              ) : (
                <TouchableOpacity onPress={this.onClickBanner}>
                <ImageBackground
                  source={{uri: url}}
                  style={styles.mainView}
                  imageStyle={{ borderRadius: 4}}
                >
                  {/* {title ? (
              <View 
                style={[styles.titleButtonStyle, {backgroundColor: backgroundColor}]
               }>
                <AppText white size="L">{title}</AppText>
                </View>
              ) : null} */}
                </ImageBackground>
              </TouchableOpacity>
              )
            }
            </View>
          </View>
          {shareKey ? 
          <ShareComponent t={t} shareKey={shareKey} shareMsg={shareMsg} widgetType={widgetType}
          category={category}
          page={page}
          widgetId={widgetId}/> : null}
        </BackgroundSelector>
    ) : null;
  }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
  },
  mainContainer: {},
  dataContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: heightPercentageToDP(1),
    borderRadius: 3,
  },
  mainView: {
    height: heightPercentageToDP(21),
    justifyContent: 'flex-end',
    width: widthPercentageToDP(100),
    resizeMode: 'contain',
    alignItems: 'center',
},
imageStyle: {
    height: heightPercentageToDP(22),
    resizeMode: 'contain',
    width: widthPercentageToDP(96),
    borderRadius: 5,
},
titleButtonStyle: {
  marginVertical: heightPercentageToDP(2), 
  marginLeft: widthPercentageToDP(2),
  padding: heightPercentageToDP(0.6),
  width: widthPercentageToDP(50),
  alignItems: 'center',
  borderRadius: 5
},
  descriptionView: {
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: 7,
    alignSelf: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row'
  },
  playIconStyle: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(7),
    bottom: 0,
    left: widthPercentageToDP(39),
    right: 0,
  },
  iconCLImage: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(6.5),
    resizeMode: 'contain',
  },
  middleComponent:{
    width: '100%',
    height:heightPercentageToDP(34),
    justifyContent: 'center',
    alignItems:'center',
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: widthPercentageToDP(97),
    height:'100%',
    borderRadius:scaledSize(5),
  }
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language
});

export default withTranslation()(connect(mapStateToProps)(CLOnboard));
