import React, { PureComponent } from 'react';
import {  View, ImageBackground, Image , TouchableOpacity, StyleSheet,Linking} from 'react-native';
import {Images} from '../../../../../assets/images';
import NavigationService from '../../../../utils/NavigationService';
import {AppText} from '../../../../components/Texts';
import {withTranslation} from 'react-i18next';
import {LogFBEvent, Events} from '../../../../Events';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import TrustMarker from '../../CartDetail/Component/TrustMarker';
import { Constants } from '../../../../styles';
import {connect} from 'react-redux';
import idx from 'idx';

class ClProfileShow extends PureComponent {

    viewChanelClick = () => {
        LogFBEvent(Events.VIEW_MY_COMMUNITY_CLICK, null);
        NavigationService.navigate('Community');
    }

    render() {
      const {t,clDetails, communityName} = this.props;
      const clInfo = idx(clDetails, _ => _.user);
      const name = (clInfo && clInfo.name) ? clInfo.name : '';
      const pictureUrl =  (clInfo && clInfo.pictureUrl) ? clInfo.pictureUrl : '';
      const mallInfoType = idx(clDetails, _ => _.mallInfo.type);
      const displayName = mallInfoType == 'CL' ? t(`#NAME#’s Glowfit Store`,{NAME:name}) : t(`#NAME#’s Community`,{NAME:communityName});
        return (
            <View style={styles.container}>
                <View style={styles.backView}>
                    <Image
                        source={Images.cl_profile_bg}
                        style={styles.topbackImage} />
                </View>
                <View style={styles.frontView}>
                    <View style={styles.frontMiddleView}>
                        <Image
                            source={pictureUrl == '' ? Images.clSheet : {uri: pictureUrl}}
                            style={styles.profileImage} />
                    </View>
                    <View style={styles.frontBottomView}>
                        {/* <AppText black bold size="M">
                            {displayName}
                        </AppText> */}
                        <View style={styles.emptyView}/>
                        <View style={{flexDirection:'row'}}>
                            <TrustMarker />
                        </View>
                        <View style={styles.emptyView}/>
                        {/* <TouchableOpacity onPress={this.viewChanelClick}>
                            <LinearGradient style={styles.chanelButtonStyle} colors={[Constants.voiletColorText, Constants.redishVoiletText]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <AppText white bold size="M">
                                    {t('View My Community')}
                                </AppText>
                            </LinearGradient>
                        </TouchableOpacity> */}

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      height: heightPercentageToDP(25), 
      width: widthPercentageToDP(100),
      alignItems:'center',
      justifyContent:'center',
    },
    backView:{
      flex:1
    },
    frontView:{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height:'100%',
    },
    profileImage:{
        height:widthPercentageToDP(20),
        width:widthPercentageToDP(20),
        borderRadius:widthPercentageToDP(10)
    },
    frontTopView:{
        flex:0.1,
    },
    frontBottomView:{
        flex:0.6,
        width:widthPercentageToDP(100),
        alignItems:'center',
        justifyContent:'space-around'
    },
    frontMiddleView:{
        flex:0.4,
        justifyContent:'center',
        alignItems:'center'
    },
    topbackImage:{
        flex:0.2,
    },
    emptyView:{
        height:widthPercentageToDP(1),
        width:widthPercentageToDP(1)
    },
    iconImages:{
        height:widthPercentageToDP(7),
        width:widthPercentageToDP(7)
    },
    badgeContainer:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    textColor:{
        textAlign: 'center',
        color:Constants.voiletColorText
    },
    chanelButtonStyle:{
        width:widthPercentageToDP(85),
        height:heightPercentageToDP(6),
        borderRadius:widthPercentageToDP(1),
        justifyContent:'center',
        alignItems:'center'
    }
});

const mapStateToProps = state => {
    return {
      clDetails:state.login.clDetails,
    };
  };
  
  const mapDispatchToProps = dispatch => ({
    dispatch,
  });
  
const ClProfileShowScreen = connect(mapStateToProps, mapDispatchToProps)(ClProfileShow);
export default withTranslation()(ClProfileShowScreen);