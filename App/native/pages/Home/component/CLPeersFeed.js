import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Avatar} from 'react-native-elements';
import {AppText} from '../../../../components/Texts';
import {Images} from '../../../../../assets/images';
import {Colors} from '../../../../../assets/global.js';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {Constants} from '../../../../styles';

class CLPeersFeed extends Component {
  render() {
    const {t, data} = this.props;
    if (!data) return null;
    let {superSale} = data;
    let feedData = superSale && superSale.substeps ? superSale.substeps : [];
    const colors = ['#123456', '#654321', '#fdecba', '#abcdef'];
    return (
      <View style={styles.container}>
        <View style={styles.titleStrip}>
          <AppText white bold style={{fontSize: 8, letterSpacing: 0.5}}>
            {t('100% COMPLETION RATE')}
          </AppText>
        </View>

        {feedData.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                marginTop: heightPercentageToDP(1),
              }}>
              <View style={{flex: 0.1}}>
                <Avatar
                  rounded
                  title={item.heading}
                  overlayContainerStyle={{
                    backgroundColor: colors[index % colors.length],
                  }}
                  icon={{color: 'red'}}
                />
              </View>
              <View
                style={{
                  flex: 0.9,
                  justifyContent: 'center',
                  paddingLeft: widthPercentageToDP(2),
                }}>
                <AppText black size="XS">
                  {t(item.text)}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e7f7f7',
    width: widthPercentageToDP(96),
    height: heightPercentageToDP(21),
    paddingVertical: heightPercentageToDP(2),
    paddingHorizontal: scaledSize(10),
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  titleStrip: {
    backgroundColor: Constants.primaryColor,
    bottom: heightPercentageToDP(19.5),
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 4,
    padding: heightPercentageToDP(0.5),
    paddingVertical: heightPercentageToDP(0.3),
  },
});

export default withTranslation()(CLPeersFeed);
