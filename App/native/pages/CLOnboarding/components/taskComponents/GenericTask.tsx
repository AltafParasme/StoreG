import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import { heightPercentageToDP, widthPercentageToDP } from '../../../../../utils';
import {shareToWhatsAppCLTasks} from '../../../utils';
import TaskShareWhatsapp from './TaskShareWhatsapp';

class GenericTask extends Component {

    shareWhatsapp = async (message) => {
        const {t, userPref, data, widgetId } = this.props;
        
        let imageUrlArr = [];
        let currentDate = moment.utc(new Date());
        let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
        let eventProps = {
            taskId: widgetId,
            widgetType: data.widgetType,
          }

          let userPrefData = {
            userId: userPref.uid,
            sid: userPref.sid,
          };
          
        try {
            /** to ensure the permission being granted, if granted then sharing images/ texts are confirmed */
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'ShopG wants to store images, media contents and files',
                message: 'ShopG wants to store images, media contents and files',
                buttonNegative: 'Deny',
                buttonPositive: 'Allow',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              
             imageUrlArr.push(`${data.imageUrl}`)
              shareToWhatsAppCLTasks(
                eventProps,
                t,
                message,
                null,
                'CL_TASK',
                imageUrlArr,
                this.props.onCompleteTask,
                userPrefData,
              );
             
            } else {
              console.log('permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
    }
  render() {
    let {data, t} = this.props;

      return (
        <View
          style={styles.mainView}>
          <Image
            source={{uri: data.imageUrl}}
            resizeMethod="resize"
            style={styles.imageStyle}
          />
          { data.shareKey ? (
        <TouchableOpacity onPress={() => {
            this.shareWhatsapp(data.shareMessage);
        }}
        style={{}}
        >
          <TaskShareWhatsapp shareKey={data.shareKey} t={t} />
        </TouchableOpacity>) : null}
        </View>
      );
  }
}


const styles = StyleSheet.create({
    mainView: {
        height: heightPercentageToDP(23),
        marginRight: widthPercentageToDP(2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        height: heightPercentageToDP(18),
        resizeMode: 'contain',
        width: widthPercentageToDP(50),
        borderRadius: 5,
    }
})

export default withTranslation()(GenericTask);
