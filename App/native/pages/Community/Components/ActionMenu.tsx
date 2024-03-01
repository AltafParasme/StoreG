import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP} from '../../../../utils';
import ActionMenuItem from './ActionMenuItem';

const ActionMenu = ({t,canEdit, canDelete,onPressEdit,onPressDelete,onPressReport}) => {
  
    return (
        <View style={{justifyContent:'center',alignItems:'center'}}>
            
            {canEdit ?  
                <View style={styles.leftAlign}>  
                    <ActionMenuItem t={t} buttonText={'Edit'} onPress={onPressEdit}/>
                    <View style={styles.emptyView}/>
                </View> : null    
            }
            {canDelete ? 
                <View style={styles.leftAlign}>    
                    <ActionMenuItem t={t} buttonText={'Delete'} onPress={onPressDelete}/>
                    <View style={styles.emptyView}/>
                </View>    
            : null}   

            {true ? 
                <View style={styles.leftAlign}>
                    <ActionMenuItem t={t} buttonText={'Report this post'} onPress={onPressReport}/>
                    <View style={styles.emptyView}/>
                </View> 
            : null}
        </View>
    )
}

const styles = StyleSheet.create({
    emptyView:{
        height:heightPercentageToDP(1),
        width:widthPercentageToDP(100)
    },
    leftAlign: {
        paddingLeft: widthPercentageToDP(10)
    }
});

export default ActionMenu;