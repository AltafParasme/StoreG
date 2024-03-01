import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../utils';
import NavigationService from '../../utils/NavigationService';
import Markdown from 'react-native-simple-markdown';
import {Card, Icon} from 'react-native-elements';
import {shareToWhatsAppCLTasks} from '../../native/pages/utils';
import {withTranslation} from 'react-i18next';
import {Colors, Fonts} from '../../../assets/global';
import VideoModal from '../../components/VideoModal/VideoModal';
import {Constants} from '../../styles';
import {AppText} from '../../components/Texts';
import {Images} from '../../../assets/images';
import ImageModal from '../../components/ImageModal/ImageModal';

let originalIndexClicked = '';
let MySlideComponent = ({
  t,
  index,
  data,
  navigateTo,
  toggle,
  dataLength,
  showWhatsappButton,
  isModalOpen,
  isCLOnboard,
  isCLTask,
  whatsappClick,
  eventName,
  markDownTextEnabled,
  videoIconImage,
  restData,
  innerTextStyle,
  enableImageZooming,
  carouselImageStyle,
  showTagsRelevance,
  carouselViewStyle,
  playIconStyle,
  valId,
}) => {
  let eventData = null;
  let dataIndex =
    index + 1 >= dataLength ? (index + 1) % dataLength : index + 1;
  if (data.action === 'forward/whatsapp') {
    eventData = {
      id: valId,
      url: data.url,
      type: eventName,
    };
  }

  if (
    enableImageZooming &&
    isModalOpen &&
    originalIndexClicked == index &&
    !data.isVideo
  ) {
    NavigationService.navigate('ImageView', {
      url: data.url,
      index: dataIndex,
      restData: restData,
    });
    toggle(dataIndex);
  }

  return (
    <View removeClippedSubviews={true}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          originalIndexClicked = index;
          navigateTo(data.action, dataIndex, data.isVideo);
        }}>
        {data.isVideo ? (
          <View style={[styles.playIcon, playIconStyle]}>
            <Image
              source={Images.youtube}
              style={[styles.iconImage, videoIconImage]}
            />
          </View>
        ) : null}
        {isCLOnboard ? (
          <View style={innerTextStyle}>
            <AppText white size="M" bold>
              {t('Community Leader, Earn upto ₹15,000')}
            </AppText>
            <AppText size="M" bold style={{color: '#ffd734'}}>
              {t('Zero Investment')}
            </AppText>
            <AppText
              white
              size="S"
              style={{paddingTop: heightPercentageToDP(2)}}>
              {data.name}
            </AppText>
          </View>
        ) : markDownTextEnabled ? (
          <View style={innerTextStyle}>
            <Markdown>{data.text}</Markdown>
          </View>
        ) : null}

        {/** 
    The following props are send during CL activities in order to show carousel images on right way & added
    to that, whatsapp icons are used here for customer's further activity purposes

      - isCLOnboard is the props which determines the that the component being called from the CL Traning as well as 
      CL first time onboarding;
      -  clBusiness is the similar props difference is that the prop is passed during CL training; 
      - isCLStep same reason called from CL task ;
  */}
        <View
          style={[
            {
              height: heightPercentageToDP(35),
              alignItems: 'center',
              borderRadius: 5,
            },
            carouselViewStyle,
          ]}>
          <Image
            source={{uri: data.url}}
            resizeMethod="resize"
            style={[
              {
                height: heightPercentageToDP(35),
                resizeMode: 'contain',
                width: widthPercentageToDP(100),
              },
              carouselImageStyle,
            ]}
          />
        </View>
      </TouchableOpacity>

      {/**
        Whatsapp & the ShopG Icon on CL Task screen as well as ShopG Live screen;
       */}
      {showWhatsappButton ? (
        <View style={styles.clTasksView}>
          {data.action === 'forward/whatsapp' ? (
            <View style={styles.whatsappIconView}>
              <TouchableOpacity
                elevation={2}
                onPress={() => {
                  whatsappClick(
                    data.whatsappText,
                    data.whatsappvideolink,
                    data.whatsappimagelink,
                    data.url
                  );
                }}
                style={styles.whatsappCircleGroupDeal}>
                <Icon
                  type="font-awesome"
                  name="whatsapp"
                  color={Constants.white}
                  size={widthPercentageToDP(6)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : null}
      {isModalOpen && originalIndexClicked == index && data.isVideo ? (
        <VideoModal
          isCLOnboard={isCLOnboard}
          visible={isModalOpen}
          toggleModal={toggle}
          videoUri={{
            video: {
              url: data.videoUrl,
            },
          }}
          header={data.text}
          onClose={() => {
            toggle(dataIndex);
          }}
        />
      ) : null}

      {!enableImageZooming &&
      isModalOpen &&
      originalIndexClicked == index &&
      !data.isVideo ? (
        <ImageModal
          visible={isModalOpen}
          toggleModal={() => {
            toggle(dataIndex);
          }}
          images={data.url}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  countdown: {
    paddingRight: 5,
  },
  whatsappIconView: {
    paddingLeft: widthPercentageToDP(76),
    paddingTop: heightPercentageToDP(1),
    flex: 0.15,
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
    elevation: 6,
  },
  clTasksView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.8,
    position: 'absolute',
    bottom: heightPercentageToDP(3.5),
    width: widthPercentageToDP(92),
    paddingHorizontal: widthPercentageToDP(3.4),
  },
  iconImage: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(12),
    resizeMode: 'contain',
  },
  playIcon: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(4),
    bottom: 0,
    left: widthPercentageToDP(35),
    right: 0,
  },
});

export default withTranslation()(React.memo(MySlideComponent));
