import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import moment from 'moment';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector'
import DataList from './DataList'
import ShareComponent from './ShareComponent'
import PrivateLabelHeader from './PrivateLabelHeader'
import {LogFBEvent, Events} from '../../Events';
import NavigationService from '../../utils/NavigationService';
import {Icon, Header} from 'react-native-elements';

export class PrivateLabel extends Component {

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType, page} = this.props;
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      widgetType:widgetType, 
      page: page
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {itemCategory, activeCategoryTab} = nextProps;
    if(!itemCategory.includes(activeCategoryTab))
    return false;
    return true;
  }

  onOverlayPress = (component) => {
    const {
      itemData,
      category,
      page,
      widgetId,
      widgetType,
      index,
      language,
    } = this.props;

    let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;

    const title=languageItemData ? languageItemData.title : 'Ohayo Private Label';

    const selectedTag=languageItemData ? languageItemData.tags[0] : '';

    const selectedSlug = (selectedTag && selectedTag.slug) ? selectedTag.slug : '';

    LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
      slug: selectedSlug,
      category: category,
      widgetId: widgetId,
      position: index,
      widgetType: widgetType,
      page: page,
      component:component
    });

    NavigationService.navigate('TagsItems', {
      screen: 'ActiveFlashSales',
      title: title,
      selectedtagSlug: selectedSlug,
    });
  };

  trustMarkerRenderLogo = ({item, index}) => {
    return (
      <View style={{width:widthPercentageToDP(20)}}>
        <Image
          resizeMethod = {'resize'}
          resizeMode = {'contain'}
          source={{
            uri: item,
          }}
          style={styles.markerLogoImage}
        />
      </View>
    );
  };


  render() {
    const {
      t,
      itemData,
      index,
      widgetId,
      liveLoading,
      selectedTagName,
      category,
      language,
      page,
      widgetType
    } = this.props;

    if(!itemData) return(<View />);

    let languageItemData = (itemData && itemData[language]) ? itemData[language] : itemData;

    const shareMsg= languageItemData.shareMsg ? languageItemData.shareMsg : '';
    const bannerJson = languageItemData.bannerJson ? languageItemData.bannerJson: null;
    const title = languageItemData.title ? languageItemData.title : 'Be Attractive, Naturally!';
    const banner = languageItemData.banner ? languageItemData.banner : 'http://cdn.shopg.in/shopg_live/ohayo_banner.png';
    const logo = languageItemData.logo ? languageItemData.logo : 'http://cdn.shopg.in/icon/ohayo_logo.png';
    const backgroundImage = languageItemData.backgroundImage ? languageItemData.backgroundImage : '';
    const headerColor = languageItemData.headerColor ? languageItemData.headerColor : '#86ad4b';
    const backgroundColor = languageItemData.backgroundColor ? languageItemData.backgroundColor : '#86ad4b';
    const description = languageItemData.description ? languageItemData.description : '';
    const selectedTag = (languageItemData.tags && languageItemData.tags.length) ? languageItemData.tags[0] : '';
    const shareKey = languageItemData.shareKey ? languageItemData.shareKey : '';

    const trustMarker = languageItemData.trustMarker ? languageItemData.trustMarker : [];

    const disclaimerText = languageItemData.disclaimerText ? languageItemData.disclaimerText : 'We will return 100% of your money if you find any chemicals in our product*';
    const ratingText = languageItemData.ratingText ? languageItemData.ratingText : 'Asifa Khanum, rated OHAYO glow face pack';

    if(!selectedTag) return(<View />);


    let screenName = 'ActiveFlashSales';
      return (
        <View>
          <PrivateLabelHeader 
            t={t}
            logo={logo}
            banner={banner}
            headerText={title}
            headerColor={headerColor} />
            
          <View style={styles.dataHeadingWraper}>
            <View style={[styles.dataHeading,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue}]}>
                <AppText white bold size="XXS">
                  {t('#DESCRIPTION#',{DESCRIPTION:description})}
                </AppText>
            </View>
          </View>

          <BackgroundSelector backgroundImage={backgroundImage} backgroundColor={backgroundColor} style={styles.dealContainer}>
          
          <View style={styles.mainView}>



          <View style={styles.middleComponent}>
              <DataList 
                heightDP={36}
                language={language}
                selectedTag={selectedTag} 
                screenName={screenName} 
                widgetId={widgetId}
                page={this.props.page}
                position={this.props.listItemIndex}
                widgetType={this.props.widgetType}
                category={category}
                endItemPress={() => this.onOverlayPress('dataList')}
              />
              
              {
                (liveLoading && (selectedTagName==selectedTag.slug))
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

            {(trustMarker && trustMarker.length) ? (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal:widthPercentageToDP(6),
                  marginVertical: heightPercentageToDP(2),
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                <FlatList
                  horizontal
                  data={trustMarker}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.trustMarkerRenderLogo}
                />
              </View>
            ) : null}

            <View style={{justifyContent:'center',alignItems:'center',marginVertical: heightPercentageToDP(1)}}>
              <AppText black bold size="XXS">
                {t(disclaimerText)}
              </AppText>
            </View>
          </View>




          {shareKey ?   
          <ShareComponent t={t} shareKey={shareKey} shareMsg={shareMsg} bannerJson={bannerJson} widgetType={widgetType}
            category={category}
            page={page}
            position={index}
            widgetId={widgetId}/> 
            : null}

          <View style={styles.footerContainer}>
            <AppText white bold size="XXS">
              {t(ratingText)}
            </AppText>
            <View style={{height:1,width:widthPercentageToDP(3)}}/>
            <Icon
              name={'star'}
              type={'font-awesome'}
              color={'#f1c40f'}
              size={widthPercentageToDP(3)}
            />
            
            <View style={{height:1,width:widthPercentageToDP(3)}}/>
            <Icon
              name={'star'}
              type={'font-awesome'}
              color={'#f1c40f'}
              size={widthPercentageToDP(3)}
            />
            
            <View style={{height:1,width:widthPercentageToDP(3)}}/>
            <Icon
              name={'star'}
              type={'font-awesome'}
              color={'#f1c40f'}
              size={widthPercentageToDP(3)}
            />
            
            <View style={{height:1,width:widthPercentageToDP(3)}}/>
            <Icon
              name={'star'}
              type={'font-awesome'}
              color={'#f1c40f'}
              size={widthPercentageToDP(3)}
            />
            
            <View style={{height:1,width:widthPercentageToDP(3)}}/>
            <Icon
              name={'star'}
              type={'font-awesome'}
              color={'#f1c40f'}
              size={widthPercentageToDP(3)}
            />
          </View>

          </BackgroundSelector>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
    padding: 0,
  },
  mainView: {
    flex: 1,
    width: widthPercentageToDP(98),
    alignSelf: 'center',
    marginVertical:heightPercentageToDP(1)
  },
  dataHeading:{
    height:heightPercentageToDP(3),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(94),
    borderTopLeftRadius:scaledSize(5),
    borderTopRightRadius:scaledSize(5),
  },
  dataHeadingWraper:{
    height:heightPercentageToDP(3),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(100),
    margin:-1
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    borderRadius:scaledSize(5),
  },
  dealsH1:{
    height:heightPercentageToDP(5),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(80),
  },
  dealsH2:{
    height:heightPercentageToDP(3),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(80),
  },
  dealsH3:{
    height:heightPercentageToDP(3),
    justifyContent: 'center',
    alignSelf:'center',
    alignItems:'center',
    width:widthPercentageToDP(40),
  },
  middleComponent:{
    height:heightPercentageToDP(36),
    justifyContent: 'center',
    alignItems:'center',
    //backgroundColor: 'white',
    borderRadius: scaledSize(3),
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },  
  markerLogoImage: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(14),
    resizeMode: 'contain',
  },
  footerContainer: {
    height: heightPercentageToDP(5),
    width:widthPercentageToDP(100),
    backgroundColor:'#4a762e',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
});

const mapStateToProps = state => ({
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
  activeCategoryTab: state.home.activeCategoryTab,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(PrivateLabel)
);