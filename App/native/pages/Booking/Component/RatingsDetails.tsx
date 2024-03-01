import * as React from 'react';
import { Component } from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import {
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import ReviewComponent from './ReviewComponent';
import { widthPercentageToDP, heightPercentageToDP } from '../../../../utils';
import {Constants } from '../../../../styles';
import { FlatList } from 'react-native-gesture-handler';

const colors = ['#ec3d5a', '#654321', '#8B008B', '#abcdef'];

class RatingsDetails extends Component{

    renderItem = (item, index) => {
        return (
           <ReviewComponent data={item} color={colors[index % colors.length]}/>
        );
    }
    
    render() { 
        const {t, ratings} = this.props;
        return ( 
            <View style={styles.mainView}>
               <View>
                    <AppText size="M" bold>{t('Ratings & Reviews')}</AppText>
                    <View style={{flexDirection: 'row',  
                            justifyContent: 'space-between'}}>
                        <View style={{
                            flexDirection: 'row', 
                            marginTop: heightPercentageToDP(1.6),
                            }}>
                        <AppText bold style={{fontSize: 24}}>{ratings.rating}<AppText style={{color: '#C0C0C0'}}> / 5 </AppText></AppText>
                        <View style={{marginLeft: widthPercentageToDP(3)}}>
                            <AppText size="XS" bold>{t('Overall rating')}</AppText>
                            <AppText size="XS" style={{color: '#808080'}}>{t(`${ratings.totalRating} ratings received`)}</AppText>
                        </View>
                        </View>
                    </View>
               </View>
               {ratings.topUserRating ? (
               <View style={{marginTop: heightPercentageToDP(2), height: heightPercentageToDP(19)}}>
                   <FlatList
                    horizontal
                    data={ratings.topUserRating}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    showsHorizontalScrollIndicator={false}
                    />
               </View>) : null}
            </View>
         );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1, 
        marginVertical: heightPercentageToDP(2), 
        marginHorizontal: widthPercentageToDP(6)
    },
    buttonStyle: {
        height: heightPercentageToDP(4.8),
        width: widthPercentageToDP(20.5),
        borderRadius: 4,
        borderColor: Constants.primaryColor,
        borderWidth: 1.4,
        justifyContent: 'center',
    },
})
 
export default withTranslation()(RatingsDetails);