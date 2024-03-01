import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import {Constants} from '../../../styles';
import {
  scaledSize,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../utils';
import ProfileFormContainer from './form/ProfileFormContainer';
import Button from '../../../components/Button/Button';
import NavigationService from '../../../utils/NavigationService';
import {withTranslation} from 'react-i18next';
import {Images} from '../../../../assets/images';

class EditUserProfile extends Component {
  navigateTo() {
    NavigationService.navigate('Home');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollBox}>
          <Header
            containerStyle={styles.header}
            leftComponent={
              <Button
                hitslop={{bottom: heightPercentageToDP(5), left: 5, right: 5}}
                onPress={() => NavigationService.goBack()}>
                <Icon
                  name={'arrow-left'}
                  type={'feather'}
                  color={Constants.black}
                  size={28}
                />
              </Button>
            }
            rightComponent={
              <TouchableOpacity onPress={this.navigateTo}>
                <Image style={styles.imageContent} source={Images.logo} />
              </TouchableOpacity>
            }
          />
          <View style={styles.innerView}>
            <ProfileFormContainer t={this.props.t} />
          </View>
          <View style={{height: 100}}></View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollBox: {
    flex: 1,
    paddingBottom: heightPercentageToDP(10),
  },
  header: {
    backgroundColor: Constants.white,
    height: heightPercentageToDP(9),
    paddingBottom: heightPercentageToDP(4),
  },
  imageContent: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(30),
    resizeMode: 'contain',
  },
  headerLeft: {
    flexDirection: 'row',
  },
  iconStyle: {
    color: Constants.white,
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  innerView: {
    flex: 1,
  },
});
export default withTranslation()(EditUserProfile);
