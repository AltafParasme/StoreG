import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../Events';
import {liveAnalytics} from '../ShopgLive/redux/actions';

export class VerticalVideo extends Component {

  constructor(props) {
    super();
    this.state = {
      startValue: new Animated.Value(0),
      endValue: 10,
      duration: 2000,
      startVideo: false,
      loader:true,
      isVideoRelevance: props.isVideoRelevance
    };
    this.startTimeM = '';
    this.durationM = '';
  }

  static getDerivedStateFromProps(nextProps, prevProps){
    if((nextProps.listIndex===nextProps.activeIndex) 
    && nextProps.shouldStartVideo && nextProps.isVideoRelevance === prevProps.isVideoRelevance){
      return { startVideo: true };
   }
   else {
    return { startVideo: false};
   }
 }

  toggleVideo = () => {
    this.setState({startVideo: !this.state.startVideo});
  }

  videoError = e => {
    // console.log('11-> e', e);
  };

  onBuffer = () => {
    // console.log('14-> onBuffer');
  };

  componentWillMount() {
    this.startTimeM = new Date().getTime();
  }

  componentDidMount() {
    const {item} = this.props;
    this.durationM = new Date().getTime() - this.startTimeM;
    SetScreenName(Events.VERTICAL_VIDEO_SCREEN.eventName());
    LogFBEvent(Events.VERTICAL_VIDEO_SCREEN, {video: (item && item.video) ? item.video : undefined,image : (item && !item.video) ? item : undefined, timeTaken: this.durationM});
  }

  componentDidUpdate(previousProps, previousState) {
    if(previousProps.selectedLanguage !== this.props.selectedLanguage) {
      this.forceUpdate();
    }
  }

  render() {
    const {t,item, isVideoRelevance} = this.props;
    const {startVideo,loader} = this.state;
    
    return (
        <View style={styles.container}>

            <View style={styles.behind}>
            {
                (startVideo && item.video)
                ?
                <Video
                controls={false}
                source={{uri: item.uri}}
                resizeMode={'contain'}
                ref={ref => {
                    this.player = ref;
                }}
                autoplay={true}
                onBuffer={this.onBuffer}
                onLoadStart={e => this.setState({loader: true})}
                onError={this.videoError}
                onReadyForDisplay={e => this.setState({loader: false})}
                style={styles.componentContainer}
                onEnd={this.toggleVideo}
                />
                :
                (!item.video && !isVideoRelevance)
                ?
                <View style={styles.componentContainer}>
                <Image
                    resizeMethod = {'resize'}
                    resizeMode = {'contain'} 
                    source={{uri: item}} 
                    style={styles.componentContainer} />
                </View> : null
            }
            </View>

            {
              (loader && item.video)
              ?
              <View style={styles.front}>
                <ActivityIndicator
                  color="black"
                  size="large"
                />
              </View>
              : null
            }            
            
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
  front: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    height:'100%',
    width:'100%',
  },
  behind:{
    flex:1,
    width: '100%', 
    height: '100%'
  },
  container: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  language: state.home.language,
  cart: state.home.cart,
  hasCart: state.home.hasCart,
  userPref: state.login.userPreferences,
  totalCartItems: state.home.totalCartItems,
  groupSummary: state.groupSummary,
  liveLoading: state.ShopgLive.liveLoading,
});

const mapDipatchToProps = dispatch => ({
  dispatch,
  onAnalytics: (eventName, eventData, userPrefData) => {
    dispatch(liveAnalytics(eventName, eventData, userPrefData));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(VerticalVideo)
);