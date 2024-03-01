import React, {Component} from 'react';
import {View, Image,TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import { heightPercentageToDP, widthPercentageToDP } from '../../../../../utils';

export default class TaskImagesRender extends Component {
  render() {
    let {imageUrl, data, index, onPress} = this.props;

    if (data) {
      let currentDate = moment.utc(new Date());
      let currentDateLocal = currentDate.local().format('DD-MMM-YYYY');
      imageUrl =
        `${this.props.imageUrl}/${currentDateLocal}-${index}.png`;

      return (
        <TouchableOpacity onPress={() => onPress(index)}>
        <View
          style={styles.mainView}>
          <Image
            source={{uri: imageUrl}}
            resizeMethod="resize"
            style={styles.imageStyle}
          />
        </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}


const styles = StyleSheet.create({
    mainView: {
        height: heightPercentageToDP(23),
        marginRight: widthPercentageToDP(2),
    },
    imageStyle: {
        height: heightPercentageToDP(21.4),
        resizeMode: 'contain',
        width: widthPercentageToDP(50),
        borderRadius: 5,
    }
})
