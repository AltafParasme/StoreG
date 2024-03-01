import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import DataList from './DataList';
import ShareComponent from './ShareComponent';
import CarouselBanner from '../CarouselBanner/CarouselBanner';
import {Icon} from 'react-native-elements';
import HeaderComponent from './HeaderComponent';
import NavigationService from '../../utils/NavigationService';
import {LogFBEvent, Events} from '../../Events';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Constants } from '../../styles';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';

class BannerLive extends Component {
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

  componentDidUpdate = () => {
    let {bannerTags, widgetId} = this.props;
    if (!this.state.currentTag && bannerTags.length) {
      bannerTags.map((tags) => {
         if (tags.widgetId === widgetId) {
           this.setState({
            currentTag: true,
            currentData: tags.data
           })
         }
      } )
    }
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

  render() {
    const {
      t,
      itemData,
      widgetId,
      page,
      category,
      widgetType,
      index,
      liveLoading,
      selectedTagName,
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
    let description = itemData.description;
    let title = itemData.title;
    let shareMsg = itemData.shareMsg;
    let shareKey = itemData.shareKey;
    let timerReplaceText = itemData.rightComponentText;
    let tagClicked = this.props.bannerTags;
    const imageBackground = itemData.backgroundImage;
    const backgroundColor = itemData.backgroundColor;
   
    return (
      <BackgroundSelector
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        style={styles.dealContainer}>
        <View style={styles.mainContainer}>
          {title ? (
            <HeaderComponent
              t={t}
              title={title}
              index={listItemIndex}
              category={category}
              page={page}
              widgetType={widgetType}
              widgetId={widgetId}
              isNotTimer={!this.state.currentTag}
              selectedtagSlug={tagClicked && tagClicked.slug}
              iconViewStyle={{left: widthPercentageToDP(12)}}
              parentMainStyle={{
                height: heightPercentageToDP(7),
                paddingTop: heightPercentageToDP(0.2),
              }}
              timerReplaceText={timerReplaceText}
              onOverlayPress={() => this.onOverlayPress('header')}
            />
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          {description ? (
            <View
              style={[
                styles.descriptionView,
                {backgroundColor: backgroundColor},
              ]}>
              <AppText white bold style={{textAlign: 'center'}}>
                {t(description)}
              </AppText>
            </View>
          ) : null}
          <TouchableOpacity onPress={this.onOverlayPress}>
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end',}}>
              <AppText white bold>{timerReplaceText}</AppText>
              <View style={{ marginLeft: widthPercentageToDP(1)}}>
                <Icon
                  name={'chevron-right'}
                  type={'font-awesome'}
                  color={Constants.white}
                  size={20}
                />
              </View>
              </View>
          </TouchableOpacity>
          </View>    
        </View>
        <View style={{flex: 1, marginBottom: heightPercentageToDP(1.3)}}>
          {this.state.currentTag ? (
            <View style={styles.dataContainer}>

                <View style={styles.middleComponent}>
                  <DataList
                    heightDP={36}
                    selectedTag={this.state.currentData}
                    position={this.props.listItemIndex}
                    widgetType={widgetType}
                    category={category}
                    page={page}
                    language={this.props.language}
                    widgetId={widgetId}
                    screenName="bannerRelevance"
                    endItemPress={() => this.onOverlayPress('dataList')}
                  />
                  
                  {
                    (liveLoading && (selectedTagName==this.state.currentData.slug))
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
            <View style={{ alignItems: 'center'}}>
              <CarouselBanner
                categories={itemData}
                language={this.props.language}
                dispatch={this.props.dispatch}
                carouselViewStyle={{height: heightPercentageToDP(20)}}
                videoIconImage={styles.iconCLImage}
                carouselImageStyle={{
                  height: heightPercentageToDP(20),
                  borderRadius: 9,
                  resizeMode: 'contain',
                }}
                carouselPropsEvents={carouselPropsEvents}
                playIconStyle={styles.playIconStyle}
                isShopgLive
                itemWidthProps={widthPercentageToDP(100)}
                widgetId={widgetId}
                showWhatsappButton
              />
            </View>
          )}
        </View>
        {shareKey ? 
        <ShareComponent t={t} shareKey={shareKey} shareMsg={shareMsg} widgetType={widgetType}
        category={category}
        page={page}
        widgetId={widgetId}/> : null}
      </BackgroundSelector>
    );
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
    // width: widthPercentageToDP(98),
    backgroundColor: 'white',
    //marginTop: heightPercentageToDP(2),
    padding: heightPercentageToDP(1),
    borderRadius: 3,
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
    //top: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
  middleComponent:{
    width: '100%',
    height:heightPercentageToDP(35),
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
  bannerTags: state.ShopgLive.bannerTags,
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language
});
export default withTranslation()(connect(mapStateToProps)(BannerLive));
