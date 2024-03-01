import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import ShareComponent from './ShareComponent';
import NavigationService from '../../utils/NavigationService';
import DataListCoins from './DataListCoins'
import {LogFBEvent, Events} from '../../Events';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import BackgroundSelector from './BackgroundSelector';
import {withTranslation} from 'react-i18next';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { Constants } from '../../styles';

class CoinSampleRelevance extends Component {
    onOverlayPress = (component) => {
      const {
        itemData,
        category,
        widgetId,
        listItemIndex,
        page,
        widgetType, 
        selectedTagName,
      } = this.props;
      
      LogFBEvent(Events.SHOPG_LIVE_WIDGET_HEADER_CLICK, {
        slug: selectedTagName,
        category: category,
        widgetId: widgetId,
        position: listItemIndex,
        page: page,
        widgetType: widgetType,
        component:component
      });

      NavigationService.navigate('TagsItems', {
        screen: 'ActiveFlashSales',
        title: itemData.title,
        selectedtagSlug: selectedTagName,
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
      userComponentData,
      listItemIndex,
      language,
      productName
    } = this.props;

    let title = itemData.title;
    const imageBackground = itemData.backgroundImage;
    let leftPadding = itemData.leftPadding;
    const backgroundColor = itemData.backgroundColor;
    let timerReplaceText = itemData.rightComponentText;
    let shareMsg = itemData.shareMsg;
    let shareKey = itemData.shareKey;
    const titleStyle = itemData.titleStyle;
    const tag = itemData.tags[0];
    const descriptionStyle = itemData.descriptionStyle;
    let url = '';
    itemData.bannerJson[language] && itemData.bannerJson[language].map(item => {
        url = item.url
    })

    return (
      <View style={{borderBottomColor: '#dcdcdc', borderBottomWidth: 1}}>
      <BackgroundSelector
        t={t}
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        imageBackgroundStyle={{height: heightPercentageToDP(39)}}
        style={styles.dealContainer}>

        {
          (!imageBackground && productName)
          ?
          <View style={styles.textOnLeft}>
            <AppText white bold size="M">
              {t(productName)}
            </AppText>
          </View>
          : null
        }


        {tag && (
          <View style={[styles.middleComponent,styles.behind]}>
            <DataListCoins 
                language={language}
                selectedTag={tag} 
                screenName={'CoinSampleRelevance'} 
                widgetId={widgetId}
                page={this.props.page}
                position={this.props.listItemIndex}
                widgetType={this.props.widgetType}
                category={category}
                leftPadding={leftPadding}
                samplingUrl={url}
                endItemPress={() => this.onOverlayPress('dataList')}
                viewStyle={{height:heightPercentageToDP(38)}}
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
        )}
      </BackgroundSelector>
      {shareKey ? (
          <ShareComponent
            t={t}
            shareKey={shareKey}
            viewStyle={{
              backgroundColor: Constants.white, 
              width: widthPercentageToDP(100),
            }}
            shareMsg={shareMsg}
            widgetType={widgetType}
            category={category}
            page={page}
            widgetId={widgetId}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textOnLeft:{
    flex:1,
    justifyContent:'center',
    width:widthPercentageToDP(40)
  },
  dealContainer: {
    flexDirection: 'row',
    height: heightPercentageToDP(39),
    justifyContent:'center',
    alignItems:'center'
  },
  mainContainer: {},
  dataContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginTop: heightPercentageToDP(2),
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
  titleButtonStyle: {
    marginVertical: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(2),
    padding: heightPercentageToDP(0.6),
    width: widthPercentageToDP(50),
    alignItems: 'center',
    borderRadius: 5,
  },
  descriptionView: {
    marginHorizontal: heightPercentageToDP(3),
    padding: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(2),
    borderRadius: 7,
    alignSelf: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
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
  middleComponent: {
    width: '100%',
    height: heightPercentageToDP(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF80',
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: scaledSize(5),
  },
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  liveLoading: state.ShopgLive.liveLoading,
  productName: state.ShopgLive.productName,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language,
});

export default withTranslation()(connect(mapStateToProps)(CoinSampleRelevance));
