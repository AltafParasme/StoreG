import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../../utils/index';
import CommunityBanner from '../Components/CommunityBanner';
import NavigationService from '../../../../utils/NavigationService';

export class TypeImageRiddle extends Component {

  videoClick = (index, isVideo) => {
    const {dispatch, video, widgetId, widgetType, page, item} = this.props;
    let title=item ? item.widgetData.title : '';
    let listToShow = [];
    if (isVideo) {
      listToShow = [isVideo]
    }
   
    dispatch({
      type: 'shopglive/SET_STATE',
      payload: {
        videoShowOfferList: listToShow,
        selectedVideoIndex: index
      },
    });

   let isVideoRelevance = isVideo ? true : false;
   if(item && item.widgetData && item.widgetData.tags && item.widgetData.tags.length && item.widgetData.tags[0].slug){
    NavigationService.navigate('VerticleVideoList', {
      selectedTagSlug:  item.widgetData.tags[0].slug,
      isVideoRelevance: isVideoRelevance,
      title:title,
      noCart: true,
      widgetId: widgetId,
      widgetType: widgetType,
      page: page,
      category: 'Shop_G_Community'
    });     
   }

  }

  render() {
    const {t,item,language,lastComment} = this.props;
    const widgetId = item && item.widgetId;
    const widgetType = item && item.widgetType;
    const widgetData = item && item.widgetData;
    const correctAnswer = widgetData && widgetData.communityActionAnswer;
    const beforeText = widgetData && widgetData.beforeText;
    const beforeMediaJson = widgetData && widgetData.beforeMediaJson;
    const afterMediaJson = widgetData && widgetData.afterMediaJson;
    return (
      <View style={styles.contaierStyle}>
          <CommunityBanner
             correctAnswer={correctAnswer} 
             comment={(lastComment.postId == item.postId) ? lastComment.comment : ''}
             widgetId={widgetId}
             widgetType={widgetType}
             category={'Shop_G_Community'}
             beforeText={beforeText}
             beforeMediaJson={beforeMediaJson}
             afterMediaJson={afterMediaJson}
             language={language}
             videoClick={this.videoClick}
             />
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  contaierStyle:{
    backgroundColor:'white',
    flex:1
  }
});

const mapStateToProps = state => ({
  language: state.home.language,
  lastComment:state.community.lastComment
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(TypeImageRiddle)
);