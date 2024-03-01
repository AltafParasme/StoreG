import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {AppText} from '../../../../components/Texts';
import { widthPercentageToDP, heightPercentageToDP } from '../../../../utils';
import UsersDetails from './UsersDetails';
import {Icon} from 'react-native-elements';

const WidgetHeader = ({
    t,
    title,
    currentComunityWidgetList,
    postId,
    detail,
    onbackpress,
    onEditPress,
    showEditable
    }) => {

    let comments = [];
    let item = undefined;
    currentComunityWidgetList.map(widgetItem => {
        if (widgetItem.postId == postId) {
            comments = widgetItem.data.comments;
            item = widgetItem;
        }
    });

    const summaryActions = item && item.summary && item.summary.action;
    const sharesCount = summaryActions && summaryActions.share && summaryActions.share.total ? summaryActions.share.total : 0;
    const reactionsCount = summaryActions && summaryActions.reaction && summaryActions.reaction.total ? summaryActions.reaction.total : 0;
    const commentsCount = summaryActions && summaryActions.comments && summaryActions.comments.total ? summaryActions.comments.total : 0;
    const totalReactions = sharesCount + reactionsCount + commentsCount;

    let UniqueComments = [];
    comments.map((item, index) => {
        if (!UniqueComments.some(o => o.name === item.name)) {
            UniqueComments.push(item);
        }
    });
  
    return (
        <View style={{paddingHorizontal: widthPercentageToDP(4)}}>
            {
                (title)
                ?
                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                    <View style={{flex:0.7,flexDirection:'row',alignItems:'center'}}>
                        {
                            (detail)
                            ?
                            <TouchableOpacity
                                onPress={onbackpress ? onbackpress : ()=>{}}>
                                <Icons
                                name={'arrow-back'}
                                size={widthPercentageToDP(6)}
                                color="black"
                                style={{marginRight: '3%', top: '3%'}}
                                />
                            </TouchableOpacity> : null
                        }
                        <AppText black bold size="M">
                            {title}
                        </AppText>
                    </View>
                    {
                        (showEditable)
                        ?
                        <TouchableOpacity onPress={() => onEditPress(item,item.userId,null,"POST")} style={{flex:0.3,height:heightPercentageToDP(3),justifyContent:'center'}}>
                            <Icon
                            name={'align-right'}
                            type={'font-awesome'}
                            size={widthPercentageToDP(3)}/>
                        </TouchableOpacity> : null
                    }

                </View>
                : null
            }

            {
                (UniqueComments.length>0)
                ?
                <UsersDetails 
                    comments={UniqueComments} 
                    t={t}
                    totalReactions={totalReactions} 
                />
                :
                <View style={{height:heightPercentageToDP(1),width:widthPercentageToDP(100)}}/>
            }

        
      </View>
    )
}

export default WidgetHeader;