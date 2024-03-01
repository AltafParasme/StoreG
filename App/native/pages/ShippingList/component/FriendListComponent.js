import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {scaledSize, heightPercentageToDP} from '../../../../utils';
import {AppText} from '../../../../components/Texts';

export class FriendListComponent extends Component {
  render() {
    const {t, showText, onPress} = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <AppText
            style={{borderColor: 'black', borderBottomWidth: 1}}
            grey
            bold
            size="S">
            {t(showText)}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 10,
  },
});
