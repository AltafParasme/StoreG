/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, PureComponent} from 'react';
import {
  Dimensions,
  View,
  Image,
  Animated,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  FlatList,
  Modal,
} from 'react-native';
import {State, PinchGestureHandler} from 'react-native-gesture-handler';
import {Header} from '../../../components/Header/Header';
import {currentUser} from '../UserProfile/actions';
import {connect, Dispatch} from 'react-redux';
import moment from 'moment';
import {Colors, Fonts} from '../../../../assets/global';
import {Images} from '../../../../assets/images';
import {withTranslation} from 'react-i18next';
import NavigationService from '../../../utils/NavigationService';
import {Constants} from '../../../styles';
import {AppText} from '../../../components/Texts';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import {widthPercentageToDP, heightPercentageToDP} from '../../../utils';

const scale = new Animated.Value(1);

const onZoomEvent = Animated.event(
  [
    {
      nativeEvent: {scale: scale},
    },
  ],
  {
    useNativeDriver: true,
  },
);

class ImageView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: props.navigation.getParam('url'),
      isModalOpen: false,
      activeIndex: props.navigation.getParam('index'),
    };
  }

  restImages = (item, index) => {
    let uri = item.url;
    let activeUrl = this.state.currentUrl === item.url;
    return (
      <TouchableOpacity
        style={[
          {
            marginHorizontal: widthPercentageToDP(2),
            marginVertical: heightPercentageToDP(1),
          },
          activeUrl
            ? {borderWidth: 2, borderColor: Constants.red}
            : {borderWidth: 0},
        ]}
        onPress={() =>
          this.setState({
            currentUrl: uri,
            activeIndex: index
          })
        }>
        <Image
          style={[{width: 70, height: 70}, activeUrl ? {} : {borderWidth: 0}]}
          source={{
            uri: uri,
          }}
          resizeMethod="resize"
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  onChangeImageView = (index, bannerJson) => {
    this.setState({
      currentUrl: bannerJson[index].url,
      activeIndex: index
    });
  }

  handleBackButtonClick() {
    NavigationService.goBack();
    return true;
  }

  navigateTo = () => {
    const {dispatch} = this.props;
    NavigationService.navigate('Home');
  };

  render() {
    const {t, navigation } = this.props;
    const restData = navigation.getParam('restData');
    let bannerJson = restData;
    const item = this.state.currentUrl;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={t('Image Viewer')} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: Constants.white,
          }}>
          <ImageViewer
            backgroundColor={Constants.white}
            imageUrls={bannerJson}
            saveToLocalByLongPress={false}
            index={this.state.activeIndex}
            onChange={(index) => {
              this.onChangeImageView(index, bannerJson)
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: '#A9A9A9',
            alignItems: 'center',
            flex: 0.17,
            justifyContent: 'center',
          }}>
          <FlatList
            horizontal
            removeClippedSubviews={true}
            data={bannerJson}
            renderItem={value => this.restImages(value.item, value.index)}
            extraData={this.state}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default withTranslation()(ImageView);
