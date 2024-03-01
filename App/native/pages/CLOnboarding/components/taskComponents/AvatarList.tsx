import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Avatar, Accessory } from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {Constants} from '../../../../../styles';
import {AppText} from '../../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../../utils';
import {Images} from '../../../../../../assets/images/index';

const colors = ['#2c8cc9', '#7e3a77', '#3da78b', '#fa6400'];
const AvatarList = ({t, actionData, data,activeIndex,onPress}) => {
  if(!data)
  return null;
  
  return (
    <View style={styles.container}>
     {data.map((item, index) => {
         return (
          <TouchableOpacity style={{ width: widthPercentageToDP(18) }} onPress={() => onPress(index)}>
          {actionData && actionData.includes(item.id) ? 
          <View style={{ marginLeft: widthPercentageToDP(1), alignItems: 'center', justifyContent: 'center'}}> 
            <View
              style={styles.circleView}>
            <Icon
                  name="done"
                  type="material"
                  color={Constants.white}
                  size={widthPercentageToDP(4.5)}
                  containerStyle={{
                    alignSelf: 'center',
                    top: heightPercentageToDP(0.5)
                  }}
                />
            </View>
          </View> :
          <View style={{ marginLeft: widthPercentageToDP(1), alignItems: 'center', justifyContent: 'center'}}> 
              <View style={styles.whatsappCircle}>
                <Icon
                  name="whatsapp"
                  type="font-awesome"
                  color={Constants.white}
                  size={widthPercentageToDP(4.5)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
              </View>
              </View>}
              <View style={styles.circleContainer}>
              <AppText style={{width: widthPercentageToDP(15), alignSelf: 'center'}} black bold size="XS">{t(`Share with #NAME#`, { NAME: item.name } )}</AppText>
                </View> 
        </TouchableOpacity>
         )
     })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  circleContainer: {
    position: 'absolute',
    left: 20,
    top: 25
  },
  doneBox: {
    alignSelf:'center',
    borderColor:Constants.primaryColor,
    borderRadius:widthPercentageToDP(0.5),
    borderWidth:widthPercentageToDP(0.5),
    padding:widthPercentageToDP(0.5),
    margin: widthPercentageToDP(0.5)
  },
  emptyBox: {
    alignSelf:'center',
    padding:widthPercentageToDP(0.5),
    margin: widthPercentageToDP(0.5)
  },
  iconStatus: {
    width: 20, 
    height: 16, 
    resizeMode: 'contain',
  },
  whatsappCircle: {
    marginHorizontal: widthPercentageToDP(3),
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(26),
    height: scaledSize(26),
    borderRadius: 28 / 2,
  },
  circleView: {
    width: scaledSize(25),
    height: scaledSize(25),
    borderRadius: 27 / 2,
    borderWidth: 1,
    elevation: 5,
    marginHorizontal: widthPercentageToDP(3),
    borderColor: Constants.white,
    backgroundColor: Constants.green
  },
});
export default withTranslation()(AvatarList);
