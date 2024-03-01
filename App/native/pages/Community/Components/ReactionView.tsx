import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AppText} from '../../../../components/Texts';
import ReactionListItem from './ReactionListItem';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';
import {Icon} from 'react-native-elements';

const ReactionView = ({
    t,
    onSharePress,
    onReactionPress,
    onCommentPress,
    shareLoader,
    reactionLoader,
    commentLoader,
    item
    }) => {

    const summaryActions = item && item.summary && item.summary.action;
    const sharesCount = summaryActions && summaryActions.share && summaryActions.share.total ? summaryActions.share.total : 0;
    const shareCoinLimit = summaryActions && summaryActions.share && summaryActions.share.coinValue ? summaryActions.share.coinValue : 0;
    
    const reactionsCount = summaryActions && summaryActions.reaction && summaryActions.reaction.total ? summaryActions.reaction.total : 0;
    const reactionCoinLimit = summaryActions && summaryActions.reaction && summaryActions.reaction.coinValue ? summaryActions.reaction.coinValue : 0;

    const commentsCount = summaryActions && summaryActions.comments && summaryActions.comments.total ? summaryActions.comments.total : 0;
    const commentCoinLimit = summaryActions && summaryActions.comments && summaryActions.comments.coinValue ? summaryActions.comments.coinValue : 0;

  
    return (
        <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:widthPercentageToDP(2)}}>
            <ReactionListItem 
                t={t}
                onPress = {onSharePress}
                outerCircleStyle={styles.outerCircle}
                innerCircleStyle={styles.innerCircle}
                sharesCoinsStyle={styles.sharesCoins}
                count={sharesCount}
                limit={shareCoinLimit}
                isLoading={shareLoader}
                countText={'Shares'}
                iconComponent={
                    <Icon
                        name={'whatsapp'}
                        type={'font-awesome'}
                        color={'white'}
                        size={16}
                    />

                }
            />

            <ReactionListItem 
                t={t}
                onPress = {onReactionPress}
                outerCircleStyle={styles.outerCircle}
                innerCircleStyle={styles.innerCircle}
                sharesCoinsStyle={styles.sharesCoins}
                count={reactionsCount}
                limit={reactionCoinLimit}
                isLoading={reactionLoader}
                countText={'Reactions'}
                iconComponent={
                    <View style={styles.reactionMainView}>
                        <AppText size='M'>{'😍'}</AppText>
                    </View>
                }
            />

            <ReactionListItem 
                t={t}
                onPress = {onCommentPress}
                outerCircleStyle={styles.outerCircle}
                innerCircleStyle={[styles.innerCircle,{backgroundColor:'transparent'}]}
                sharesCoinsStyle={styles.sharesCoins}
                count={commentsCount}
                limit={commentCoinLimit}
                isLoading={commentLoader}
                countText={'Comments'}
                iconComponent={
                    <Icon
                        name={'commenting'}
                        type={'font-awesome'}
                        color={'black'}
                        size={24}
                    /> 
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    outerCircle: {
        height: scaledSize(32),
        width: scaledSize(32),
        borderRadius: 64 / 2,
        backgroundColor: '#e4e4e4',
        alignItems: 'center',
        justifyContent:'center'
    },
    innerCircle: {
        height: scaledSize(22),
        width: scaledSize(22),
        borderRadius: 44 / 2,
        backgroundColor: '#00dc0b',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent:'center'
    },
    sharesCoins: {
        height: scaledSize(12),
        width: scaledSize(12),
        top: heightPercentageToDP(0.2),
        marginHorizontal: widthPercentageToDP(1.5)
    },
    reactionMainView: {
        borderRadius: 60 / 2,
        backgroundColor: Constants.primaryColor,
        alignItems: 'center',
        justifyContent:'center'
    }
});

export default ReactionView;