import React from 'react';
import {View, Text, Image} from 'react-native';
import {scaledSize} from '../../../utils';
import {fontsStyle, colors} from '../../../assets/styles/Variable';
import {arrowDown, calendarFull} from '../../../assets';
import Button from './Button';
import {Fonts} from '../../../assets/global';
import {AppText} from '../Texts';

const DropdownButton = ({
  onPress,
  withIcon = false,
  label,
  height,
  width,
  icon,
}) => {
  return (
    <View>
      <Button
        onPress={onPress}
        styleContainer={{
          width: width || scaledSize(210),
          height: height || scaledSize(40),
          backgroundColor: '#454545',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 5,
          borderRadius: 2,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: scaledSize(5),
              marginRight: scaledSize(5),
            }}>
            {withIcon && (
              <Image
                source={icon}
                style={{
                  height: scaledSize(15),
                  width: scaledSize(15),
                  resizeMode: 'contain',
                  marginHorizontal: scaledSize(8),
                }}
              />
            )}
            <AppText
              style={{
                fontSize: scaledSize(14),
                fontFamily: Fonts.roboto,
                color: colors.white_100,
              }}>
              {label}
            </AppText>
          </View>
          <View style={{flex: 0.1, alignItems: 'flex-end'}}>
            <Image
              source={arrowDown}
              style={{
                height: 15,
                width: 15,
                resizeMode: 'contain',
                marginHorizontal: 5,
              }}
            />
          </View>
        </View>
      </Button>
    </View>
  );
};
export default DropdownButton;
