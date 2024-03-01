import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts} from '../../../assets/global';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';

const DataEndListItem = ({t,endItemPress,datalistContainerProps, isHorizontal, isCommmunityRelevance}) => {
    return (
    <TouchableOpacity onPress={endItemPress} style={styles.mainContainer}>
        <View style={[styles.datalistContainer,datalistContainerProps,
        isHorizontal ? {
          height:heightPercentageToDP(17)
        } : isCommmunityRelevance 
        ?  {height:heightPercentageToDP(30)}
        :
          {height:heightPercentageToDP(32.5)}
        ]}>
            <View style={styles.textContainer}>
                <AppText white size="XS" bold>
                    {t('VIEW ALL')}
                </AppText>
            </View>
        </View>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  mainContainer:{
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
  datalistContainer: {
    justifyContent:'center',
    alignItems:'center',
    //height:heightPercentageToDP(32.5),
    width:heightPercentageToDP(18),
    marginHorizontal:widthPercentageToDP(0.8),
    backgroundColor: Colors.grey,
    borderRadius:widthPercentageToDP(0.8),
  },
  textContainer:{
    backgroundColor: Colors.fullOrange,
    paddingVertical: scaledSize(10),
    paddingHorizontal: scaledSize(6),
    borderRadius: scaledSize(2),
  }
});


export default DataEndListItem