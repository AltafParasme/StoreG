import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image, Modal} from 'react-native';
// import Modal from 'react-native-modal';
import {Colors} from '../../../assets/global';
import {scaledSize, heightPercentageToDP, AppWindow} from '../../utils';
import {ApiConstants} from '../../Constants';
import {withTranslation} from 'react-i18next';
import {Images} from '../../../assets/images';
import {ScrollView} from 'react-native-gesture-handler';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {LogFBEvent, Events} from '../../Events';

class ImageModal extends PureComponent {
  pagination = () => {
    // const {data, language} = this.state;
    return (
      <Pagination
        dotsLength={1}
        activeDotIndex={0}
        containerStyle={{backgroundColor: 'transparent', paddingVertical: 5}}
        dotContainerStyle={{marginHorizontal: 0}}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 3,
          backgroundColor: 'white',
        }}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.videoView}>
        <Image key={index} source={{uri: item}} style={styles.imageStyle} />
      </View>
    );
  };

  render() {
    const {visible, toggleModal, images, index} = this.props;
    const mainImageUrl = images.mainImage ? images.mainImage.url : images;

    let imageGallery = images.gallery ? images.gallery.map(img => img.url) : [];
    if(Array.isArray(mainImageUrl))
      imageGallery = mainImageUrl; 
    else 
      imageGallery.unshift(mainImageUrl);

    return (
      <Modal
        presentationStyle="fullScreen"
        isVisible={visible}
        onRequestClose={toggleModal}
        onBackdropPress={toggleModal}
        transparent={true}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}>
        <SafeAreaView style={styles.container}>
          {/* <View style={styles.headerView}>
            <View style={styles.headerInnerView}>
              <Text numberOfLines={1} style={styles.headerText}>
                {t(header)}
              </Text>
              <Icon
                onPress={() => {
                  toggleModal();
                  if (onClose) {
                    onClose();
                  }
                }}
                type={'Feather'}
                name={'x'}
                fontSize={50}
              />
            </View>
          </View> */}
          <View
            style={styles.backdrop}
            onStartShouldSetResponder={toggleModal}
          />
          <View style={styles.imagesView}>
            <Carousel
              data={imageGallery}
              firstItem={index}
              renderItem={this._renderItem}
              onSnapToItem={index => this.setState({activeSlide: index})}
              sliderWidth={AppWindow.width}
              sliderHeight={heightPercentageToDP(40)}
              itemWidth={AppWindow.width - 60}
              layout="default"
            />
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 5,
    height: AppWindow.height - scaledSize(200),
    width: AppWindow.width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  imagesView: {
    height: AppWindow.height - scaledSize(200),
    width: AppWindow.width - 60,
    alignItems: 'center',
    zIndex: 9999,
  },
  backgroundVideo: {
    height: heightPercentageToDP(85),
    backgroundColor: Colors.white,
  },
  imageStyle: {
    height: heightPercentageToDP(80),
    width: '100%',
    resizeMode: 'contain',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
export default withTranslation()(ImageModal);
