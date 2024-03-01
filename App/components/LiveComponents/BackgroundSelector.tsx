import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {Constants} from '../../styles';
import {AppText} from '../Texts';

export class BackgroundSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
    render() {
        const {t,
          backgroundImage,
          backgroundColor,
          children,
          style,
          imageBackgroundStyle,
          backgroundEndColor} = this.props;
        const {loading} = this.state;
        if(backgroundImage && backgroundImage!=''){
          return (
            <View style={[styles.container,imageBackgroundStyle]}>
              <ImageBackground 
                onLoad={(e) => this.setState({loading: true})}
                source={{uri:backgroundImage}}
                style={{flex:1}}>
                  {children}
              </ImageBackground>
              {(!loading) ? <View style={[styles.behind,imageBackgroundStyle]}>{children}</View> : null}
            </View>
          );
        } else {
            return (
                <LinearGradient colors={[((backgroundColor && backgroundColor!='') ? backgroundColor:Constants.primaryColor),backgroundEndColor ? backgroundEndColor : 'white']} style={[styles.container,style]}>
                    {children}
                </LinearGradient>
              );       
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height:'100%',
    backgroundColor:Constants.primaryColor
  },
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(BackgroundSelector))
);
