import * as React from 'react';
import {AppText} from '../../../../components/Texts';
import {connect} from 'react-redux';
import {COMMUNITY_RELEVANCE_EMOTICONS} from '../../../../Constants';
import { changeField } from '../../ShopgLive/redux/actions';
import { View , StyleSheet, TouchableOpacity, ImageBackground, Text, FlatList, TextInput, Image} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from '../../../../utils';



function CommunityModal ({onPressReaction}) {

  

    const renderIcons = (item, index, onPressReaction) => {
        let isFirstIndex = index == 0 ? true : false;
        return(
            <TouchableOpacity
            onPress={() => onPressReaction(item.emoji)}
            style={{
                marginTop: heightPercentageToDP(1.6),
                marginLeft: isFirstIndex ? widthPercentageToDP(0) : widthPercentageToDP(4)
            }}
            >
              <AppText size='XL'>{item.emoji}</AppText>
              </TouchableOpacity>
        );
    }


    return(
        <View style={{
            height: heightPercentageToDP(7),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 6,
            paddingHorizontal: widthPercentageToDP(4),
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <FlatList 
          horizontal
          data={COMMUNITY_RELEVANCE_EMOTICONS}
          renderItem={({item, index}) => renderIcons(item, index, onPressReaction)}
          />
          </View>
    );
};


const mapDipatchToProps = dispatch => ({
    dispatch,
    onChangeField: (fieldName: string, value: any) => {
        dispatch(changeField(fieldName, value));
      }
  });

export default connect(null, mapDipatchToProps)(CommunityModal)
  

