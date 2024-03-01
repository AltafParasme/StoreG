import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {AppText} from '../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';

const UsersDetails = ({t,comments,totalReactions}) => {
  
  const renderName  = (item, index) => {
    let name = item.name;

    let first = name
      && name
      .split(' ')
      .slice(0, 1)
      .join(' ');
    let initial =
      first &&
      first
        .split(' ')
        .map(function(s) {
          return s.charAt(0);
        })
        .join('');
    let colors = ['#123456', '#654321', '#8B008B', '#abcdef'];
        if (index <= 1) {
          return (
            <View style={[{
              height: scaledSize(22),
              width: scaledSize(22),
              borderRadius: 44 / 2,
              backgroundColor: colors[index % colors.length],
              },
              index != 0 ? {marginLeft: widthPercentageToDP(-2)} : {}
              ]}>

                  <AppText white size='XS' style={{
                      paddingHorizontal: widthPercentageToDP(2),
                      paddingTop: heightPercentageToDP(0.3)
                      
                      }}>{initial}</AppText>
              </View>
          );
        } else return null
    }

    let topText = (comments.length == 1) ? comments[0].name : (comments.length == 2) ? comments[0].name + ' and ' + comments[1].name : (comments.length > 2) ? comments[0].name + ',' + comments[1].name : '';
    topText = topText + ((totalReactions>0) ? (totalReactions > 2) ? ' + ' + totalReactions + ' more engaged' : ' engaged' : '');

    return (
        <View style={{marginVertical: heightPercentageToDP(1.7), flexDirection: 'row',alignItems:'center'}}>
              <View
                style={{flexDirection: 'row', width: comments.length>1 ? widthPercentageToDP(16) : widthPercentageToDP(8)}}>
                {comments.map((item, index) => renderName(item, index) )}
                {
                  (comments.length > 1)
                  ?
                  <View
                    style={{
                      marginLeft: widthPercentageToDP(-2),
                      flexDirection: 'row',
                      height: scaledSize(22),
                      width: scaledSize(22),
                      borderRadius: 44 / 2,
                      backgroundColor: Constants.primaryColor,
                    }}>
                
                    <AppText
                      white
                      size="XS"
                      style={{
                        paddingHorizontal: widthPercentageToDP(2),
                        paddingTop: heightPercentageToDP(0.3),
                      }}>
                      {t('+')}
                    </AppText>
                  </View> : null
                }
            </View>
            <View style={{marginLeft: widthPercentageToDP(1)}}>
              <AppText size='XS' bold>{t('#topText#', {topText: topText})}</AppText>
            </View>
        </View>
    )
}

export default UsersDetails;