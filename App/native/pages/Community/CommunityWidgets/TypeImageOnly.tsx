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
import VideoComponent from '../../../../components/LiveComponents/VideoComponent';
import NavigationService from '../../../../utils/NavigationService';

export class TypeImageOnly extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

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
    NavigationService.navigate('VerticleVideoList', {
      selectedTagSlug:  item.widgetData.tags && item.widgetData.tags[0].slug,
      isVideoRelevance: isVideoRelevance,
      title:title,
      noCart: true,
      widgetId: widgetId,
      widgetType: widgetType,
      page: page,
      category: 'Shop_G_Community'
    });
  }

  render() {
    const {item,language} = this.props;
    const widgetId = item && item.widgetId;
    const widgetType = item && item.widgetType;
    const widgetData = item && item.widgetData;
    const mediaJson = widgetData && widgetData.mediaJson;
    let _mediaJson = '';
    mediaJson && Object.keys(mediaJson).length && mediaJson[language] && mediaJson[language].map(item => {
      _mediaJson = item
      })
    return (
      <View style={styles.contaierStyle}>
        <VideoComponent
            video={_mediaJson}
            parentMainStyle={styles.videoComponentStyle}
            iconStyle={{top: heightPercentageToDP(10)}}
            widgetId={widgetId}
            category={'Shop_G_Community'}
            position={24}
            page={1}
            widgetType={widgetType}
            videoClick={this.videoClick}
            language={language}
        />
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  contaierStyle:{
    backgroundColor:'white',
    flex:1
  },
  videoComponentStyle: {
    height: widthPercentageToDP(45),
    width: widthPercentageToDP(100),
    alignSelf: 'center'
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(TypeImageOnly)
);