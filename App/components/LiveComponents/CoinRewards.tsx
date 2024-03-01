import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector'
import DataListCoins from './DataListCoins'
import ShareComponent from './ShareComponent'
import HeaderComponent from './HeaderComponent';
import {LogFBEvent, Events} from '../../Events';
import NavigationService from '../../utils/NavigationService';

export class CoinRewards extends Component {

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

  onOverlayPress = () => {
    const {
      itemData,
      category,
      page,
      widgetId,
      widgetType,
      index,
    } = this.props;

    const title=itemData ? itemData.title : '';

    const selectedTag=itemData ? itemData.tags[0] : '';

    const selectedSlug = (selectedTag && selectedTag.slug) ? selectedTag.slug : '';

    LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
      slug: selectedSlug,
      category: category,
      widgetId: widgetId,
      position: index,
      widgetType: widgetType,
      page: page,
      component:'CoinRewards'
    });

    NavigationService.navigate('TagsItems', {
      screen: 'ActiveFlashSales',
      title: title,
      selectedtagSlug: selectedSlug,
      coinRewards:true,
    });
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
      widgetType,
      listItemIndex
    } = this.props;

    const shareMsg=(itemData && itemData.shareMsg) ? itemData.shareMsg : '';
    const bannerJson = (itemData && itemData.bannerJson) ? itemData.bannerJson: null;
    const title = (itemData && itemData.title) ? itemData.title : null;
    const titleStyle = (itemData && itemData.titleStyle) ? itemData.titleStyle : null;
    const backgroundImage = (itemData && itemData.backgroundImage) ? itemData.backgroundImage : '';
    const backgroundColor = (itemData && itemData.backgroundColor) ? itemData.backgroundColor : '#86ad4b';
    const description = (itemData && itemData.description) ? itemData.description : '';
    const selectedTag = (itemData && itemData.tags && itemData.tags.length) ? itemData.tags[0] : '';
    const shareKey = (itemData && itemData.shareKey) ? itemData.shareKey : '';

    let timerReplaceText = (itemData && itemData.rightComponentText) ? itemData.rightComponentText : '';
    if(!selectedTag) return(<View />);


    let screenName = 'ActiveFlashSales';
      return (
          <BackgroundSelector backgroundImage={backgroundImage} backgroundColor={backgroundColor} style={styles.dealContainer}>
          
          {title ? (
          <HeaderComponent
            t={t}
            title={title}
            titleStyle={titleStyle}
            index={listItemIndex}
            category={category}
            page={page}
            widgetType={widgetType}
            widgetId={widgetId}
            selectedtagSlug={selectedTag.slug}
            timerReplaceText={timerReplaceText}
            parentMainStyle={{
              height: heightPercentageToDP(9.4),
              marginTop: heightPercentageToDP(0.6),
            }}
            parentIconStyle={{marginLeft: widthPercentageToDP(30)}}
            onOverlayPress={() => this.onOverlayPress()}
          />
        ) : <View style={{width:'100%',height:heightPercentageToDP(5.5)}}/>}
          <View style={styles.mainView}>
            
            <View style={[styles.dataHeading,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue}]}>
                <AppText white bold size="XXS">
                {t('#DESCRIPTION#',{DESCRIPTION:description})}
                </AppText>
            </View>

          <View style={styles.middleComponent}>
              <DataListCoins 
                language={language}
                selectedTag={selectedTag} 
                screenName={screenName} 
                widgetId={widgetId}
                page={this.props.page}
                position={this.props.listItemIndex}
                widgetType={this.props.widgetType}
                category={category}
                endItemPress={() => this.onOverlayPress('dataList')}
                viewStyle={{height:heightPercentageToDP(38)}}
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

          </View>

          {shareKey ?   
          <ShareComponent t={t} shareKey={shareKey} shareMsg={shareMsg} bannerJson={bannerJson} widgetType={widgetType}
            category={category}
            page={page}
            position={index}
            widgetId={widgetId}/> 
            : null}

          </BackgroundSelector>
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
    width:widthPercentageToDP(80),
    borderTopLeftRadius:scaledSize(5),
    borderTopRightRadius:scaledSize(5),
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
  middleComponent:{
    height:heightPercentageToDP(38),
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'white',
    borderRadius: scaledSize(3)
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  },
});

const mapStateToProps = state => ({
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(CoinRewards)
);