import React, { Component, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {AppText} from '../Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../utils';
import {Card, Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import { Images } from '../../../assets/images';

function CommunityAction ({
  communityActionData, 
  closeCommunityActionModal, 
  indexCarousel, 
  t, 
  communityActionCoins,
  shareMessage
}) {

    let [activeDotIndex, setActiveDotIndex] = useState(indexCarousel)

    const pagination = () => {
        return (
            <Pagination
              dotsLength={
                communityActionData.length
              }
              activeDotIndex={activeDotIndex}
              containerStyle={{backgroundColor: 'transparent'}}
              dotContainerStyle={{marginHorizontal: 0}}
              dotStyle={[
                {
                  width: 15,
                  height: 15,
                  top: heightPercentageToDP(10),
                  borderRadius: 15,
                  marginHorizontal: 3,
                  backgroundColor: 'white',
                }
              ]}
              inactiveDotStyle={{}}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          );
    }

    const renderItem = (item, index) => {
        return (
          <View>  
            <View style={styles.topView}>
                <View style={[styles.secondViewStyle, {backgroundColor: item.backgroundColor}]}>
                <AppText>{item.predictions}</AppText>
                </View>
                 <AppText size='M' style={{marginVertical: heightPercentageToDP(4)}}>{item.zodiacSign}</AppText>
            </View>
          </View>
        );
    }

    return(
        <View>
            <TouchableOpacity
            onPress={closeCommunityActionModal}
              style={{
               marginBottom: heightPercentageToDP(2)
              }}>
              <Icon
                name={'x'}
                type={'feather'}
                color={'white'}
                size={22}
                style={{
                    right: widthPercentageToDP(37)
                }}
              />
            </TouchableOpacity>
            <Carousel
              data={communityActionData}
              firstItem={indexCarousel}
              onSnapToItem={index => setActiveDotIndex(index)}
              renderItem={({item, index}) => renderItem(item, index)}
              sliderWidth={widthPercentageToDP(90)}
              itemWidth={widthPercentageToDP(55)}
            />
             <View
              style={styles.paginationViewStyle}>
              {pagination()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: heightPercentageToDP(2),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(46),
    backgroundColor: '#00dc0b'
  },
  secondViewStyle: {
    marginVertical: heightPercentageToDP(2), 
    paddingVertical: heightPercentageToDP(3),
    paddingHorizontal: widthPercentageToDP(2),
    
  },
  coinImageStyle: {
    height: scaledSize(12),
    width: scaledSize(12),
    top: heightPercentageToDP(0.1),
    marginHorizontal: widthPercentageToDP(2)
  },
  topView: {
    backgroundColor: 'white', 
    paddingHorizontal: widthPercentageToDP(2),
    borderRadius: 6
  },
  paginationViewStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    paddingTop: 10,
    marginTop: 20,
  }
})

export default withTranslation()(CommunityAction);