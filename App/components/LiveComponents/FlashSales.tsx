import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
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
import moment from 'moment';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector'
import DataList from './DataList'
import ShareComponent from './ShareComponent'
import HeaderComponent from './HeaderComponent'
import TagsContainer from './TagsContainer'
import {LogFBEvent, Events} from '../../Events';
import NavigationService from '../../utils/NavigationService';
import { Constants } from '../../styles';

export class FlashSales extends Component {

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

  onOverlayPress = (component) => {
    const {
      itemData,
      category,
      page,
      widgetId,
      widgetType,
      index,
    } = this.props;

    const title=itemData ? itemData.title : 'Flash Sales';

    const selectedTag=itemData ? itemData.tags[0] : '';

    const selectedSlug = (selectedTag && selectedTag.slug) ? selectedTag.slug : '';

    const diffCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment((selectedTag.startTime && selectedTag.startTime!='') ? selectedTag.startTime : '03:00:00 PM','HH:mm:ss a'))).valueOf();
    const dealCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment(new Date(),'HH:mm:ss a'))).valueOf();

    let flashSalesState = (dealCounter<0) ? 'past' : (dealCounter>diffCounter) ? 'future' : 'present'; 
    let screenName = (flashSalesState=='past' || flashSalesState=='future') ? 'InactiveFlashSales' : 'ActiveFlashSales';

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
      screen: screenName,
      title: title,
      selectedtagSlug: selectedSlug,
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
      widgetType
    } = this.props;

    const shareMsg=itemData ? itemData.shareMsg : '';
    const bannerJson = itemData ? itemData.bannerJson: null;
    const overlaycolor=itemData ? itemData.overlayColor : '#00000080';
    const title=itemData ? itemData.title : 'Flash Sales';
    const backgroundImage=itemData ? itemData.backgroundImage : '';
    const backgroundColor=itemData ? itemData.backgroundColor : '';
    const description=itemData ? itemData.description : '';
    const selectedTag=itemData ? itemData.tags[0] : '';
    const tags=itemData ? itemData.tags: '';
    const FutureH1=itemData ? itemData.FutureH1: '';
    const FutureH2=itemData ? itemData.FutureH2: '';
    const FutureH3=itemData ? itemData.FutureH3: '';
    const PastH1=itemData ? itemData.PastH1: '';
    const PastH2=itemData ? itemData.PastH2: '';
    const PastH3=itemData ? itemData.PastH3: '';
    const FutureTimerText=itemData ? itemData.FutureTimerText : '';
    const PastTimerText=itemData ? itemData.PastTimerText : '';
    const shareKey=itemData ? itemData.shareKey : 'Share With Friends';

    if(!selectedTag) return(<View />);

    const tagsList = [];
    tags.map(tag => {
      tagsList.push(tag.slug);
    })

    const diffCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment((selectedTag.startTime && selectedTag.startTime!='') ? selectedTag.startTime : '03:00:00 PM','HH:mm:ss a'))).valueOf();
    const dealCounter = moment.duration(moment((selectedTag.endTime && selectedTag.endTime!='') ? selectedTag.endTime : '06:00:00 PM','HH:mm:ss a').diff(moment(new Date(),'HH:mm:ss a'))).valueOf();

    let flashSalesState = (dealCounter<0) ? 'past' : (dealCounter>diffCounter) ? 'future' : 'present'; 
    let dealH1 = (flashSalesState=='past') ? PastH1 : (flashSalesState=='future') ? FutureH1 : '';
    let dealH2 = (flashSalesState=='past') ? PastH2 : (flashSalesState=='future') ? FutureH2 : '';
    let dealH3 = (flashSalesState=='past') ? PastH3 : (flashSalesState=='future') ? FutureH3 : '';
    let timerReplaceText = (flashSalesState=='past') ? PastTimerText : (flashSalesState=='future') ? FutureTimerText : '';
    let screenName = (flashSalesState=='past' || flashSalesState=='future') ? 'InactiveFlashSales' : 'ActiveFlashSales';
      return (
        <BackgroundSelector backgroundImage={backgroundImage} backgroundColor={backgroundColor} style={styles.dealContainer}>

          <HeaderComponent
            t={t}
            index={index}
            selectedtagSlug={selectedTag.slug} 
            title={title} 
            page={page}
            widgetType={widgetType}
            diffCounter={diffCounter} 
            dealCounter={dealCounter}
            flashSalesState={flashSalesState}
            timerReplaceText={timerReplaceText}
            widgetId={widgetId}
            category={category}
            onOverlayPress={() => this.onOverlayPress('header')}
          />

          {
            (tagsList.length && tagsList.length>1)
            ?
            <TagsContainer t={t} tagsList={tagsList}/>
            :
            null
          }
          
          <View style={[styles.dataHeading,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue}]}>
              <AppText white bold size="XS">
                {t('#DESCRIPTION#',{DESCRIPTION:description})}
              </AppText>
          </View>

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


            {
              (flashSalesState!='present')
              ?
              <TouchableOpacity activeOpacity={1} style={[styles.behind,{backgroundColor:overlaycolor}]}>

                <View style={[styles.dealsH1,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue}]}>
                  <AppText black bold size="L">
                  {t('#DEALH1#',{DEALH1:dealH1})}
                  </AppText>
                </View>

                <View style={[styles.dealsH2,{backgroundColor:'black'}]}>
                  <AppText white bold size="XS">
                  {t('#DEALH2#',{DEALH2:dealH2})}
                  </AppText>
                </View>

                <View style={[styles.dealsH3,{backgroundColor:(backgroundColor && backgroundColor!='') ? backgroundColor : Colors.greenishBlue}]}>
                  <AppText black bold size="XS">
                  {t('#DEALH3#',{DEALH3:dealH3})}
                  </AppText>
                </View>

              </TouchableOpacity> : null
            }
          </View>

          {shareKey ?   
          <ShareComponent t={t} shareKey={shareKey} shareMsg={shareMsg} bannerJson={bannerJson} widgetType={widgetType}
          category={category}
          page={page}
          position={index}
          widgetId={widgetId}/> 
          : <View style={{width:'100%',height:heightPercentageToDP(1)}}/>}

          </BackgroundSelector>
      );
    }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
    padding: scaledSize(3),
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
    width: '100%',
    height:heightPercentageToDP(34),
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'white',
    borderRadius: scaledSize(3),
  },
  activityIndicator:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF80'
  }
});

const mapStateToProps = state => ({
  liveLoading: state.ShopgLive.liveLoading,
  selectedTagName: state.ShopgLive.selectedTag,
  language: state.home.language
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(FlashSales)
);