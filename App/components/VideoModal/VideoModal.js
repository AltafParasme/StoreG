import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import {Colors} from '../../../assets/global';
import {Icon} from 'react-native-elements';
import {
  scaledSize,
  heightPercentageToDP,
  width,
  getYoutubeVideoIDFromURL,
  AppWindow,
} from '../../utils';
import {ApiConstants} from '../../Constants';
import {withTranslation} from 'react-i18next';
import YouTube from 'react-native-youtube';
import {LogFBEvent, Events} from '../../Events';

class VideoModal extends PureComponent {
  state = {
    loader: true,
  };

  componentDidMount() {
    if (this.props.isCLOnboard) {
      LogFBEvent(Events.CL_VIDEO_CLICK, null);
    }
  }

  videoError = e => {
    console.log('11-> e', e);
  };

  onBuffer = () => {
    console.log('14-> onBuffer');
  };

  render() {
    const {
      header,
      visible,
      toggleModal,
      videoUri,
      onClose,
      t,
      videoCompleteUrl,
    } = this.props;
    return (
      <Modal
        presentationStyle="overFullScreen"
        hasBackdrop={true}
        isVisible={visible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerView}>
            <View style={styles.headerInnerView}>
              <Text numberOfLines={1} style={styles.headerText}>
                {t(header)}
              </Text>
              <Icon
                onPress={() => {
                  //toggleModal();
                  if (onClose) {
                    onClose();
                  }
                }}
                type={'feather'}
                name={'x'}
                fontSize={50}
              />
            </View>
          </View>
          <View style={styles.videoView}>
            {videoUri &&
            videoUri.video &&
            videoUri.video.url &&
            videoUri.video.url.toLowerCase().indexOf('youtube') >= 0 ? (
              <YouTube
                apiKey={ApiConstants.youtubeAPIKey}
                videoId={getYoutubeVideoIDFromURL(videoUri.video.url)} // The YouTube video ID
                play // control playback of video with true/false
                onReady={e => this.setState({loader: false})}
                onChangeState={e => this.setState({status: e.state})}
                onChangeQuality={e => this.setState({quality: e.quality})}
                onError={e => this.setState({error: e.error})}
                style={styles.backgroundVideo}
              />
            ) : (
              <Video
                controls={true}
                source={{
                  uri:
                    (videoUri && videoUri.video && videoUri.video.url) ||
                    videoCompleteUrl,
                }} // Can be a URL or a local file.
                resizeMode={'contain'}
                ref={ref => {
                  this.player = ref;
                }}
                onBuffer={this.onBuffer}
                onError={this.videoError}
                onReadyForDisplay={e => this.setState({loader: false})}
                style={styles.backgroundVideo}
                onEnd={() => {
                  if (onClose) {
                    toggleModal();
                    onClose();
                  }
                }}
                onProgress={({
                  currentTime,
                  playableDuration,
                  seekableDuration,
                }) => {
                  if (currentTime === seekableDuration) {
                    if (onClose) {
                      toggleModal();
                      onClose();
                    }
                  }
                }}
              />
            )}
            {this.state.loader && (
              <View
                style={{
                  position: 'absolute',
                  top: scaledSize(250),
                  right: scaledSize(150),
                }}>
                <ActivityIndicator
                  color="black"
                  style={{margin: 15}}
                  size="large"
                />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modalView: {
    borderRadius: 10,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  headerView: {
    height: 40,
    width: '100%',
    backgroundColor: Colors.blue,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
  },
  headerInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: scaledSize(16),
    width: AppWindow.width / 2 + 20,
  },
  videoView: {
    height: heightPercentageToDP(85),
    position: 'relative',
  },
  backgroundVideo: {
    height: heightPercentageToDP(85),
    backgroundColor: Colors.white,
  },
});
export default withTranslation()(VideoModal);
