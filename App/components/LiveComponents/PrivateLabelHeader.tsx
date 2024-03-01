import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {AppText} from '../Texts';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import { Constants } from '../../styles';

export class PrivateLabelHeader extends Component {


  render() {
    const {t,logo,banner,headerText,headerColor} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.headerContainer,{backgroundColor:headerColor}]}>

          <Image source={{uri:logo}} style={styles.logoContainer} />
          <View style={styles.saperator}>

          </View>
          
          <AppText white bold size="M">
            {t(headerText)}
          </AppText>
        </View>
        <Image source={{uri:banner}} style={styles.imageContainer} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: heightPercentageToDP(19),
    width:widthPercentageToDP(100),
  },
  headerContainer: {
    height: heightPercentageToDP(6),
    width:widthPercentageToDP(100),
    backgroundColor:'#86ad4b',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  logoContainer: {
    height: heightPercentageToDP(4),
    width:widthPercentageToDP(20),
  },
  saperator: {
    height: heightPercentageToDP(3),
    width:1,
    backgroundColor:Constants.screenbackground,
    marginHorizontal:widthPercentageToDP(3)
  },
  imageContainer: {
    height: heightPercentageToDP(13),
    width:widthPercentageToDP(100),
  },
});

const mapStateToProps = state => ({});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(PrivateLabelHeader)),
);