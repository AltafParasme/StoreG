import React, {PureComponent} from 'react';
import idx from 'idx';
import {View, StyleSheet, TouchableOpacity,Linking} from 'react-native';
import {withTranslation} from 'react-i18next';
import {scaledSize} from '../../../../utils';
import {Colors} from '../../../../../assets/global';
import {AppText} from '../../../../components/Texts';
import {LogFBEvent, Events} from '../../../../Events';

class UserTaskStrip extends PureComponent {
  constructor(props) {
    super(props);
  }

  onClickCLWhatsAppGroupLink = () => {
    const {whatsAppLink,userId} = this.props;
    
    if(whatsAppLink) {
      Linking.openURL(whatsAppLink);
      this.props.onCompleteTask(null, Events.CL_WHATSAPPGROUPLINK_CLICK);
    }
      
    LogFBEvent(Events.CL_WHATSAPPGROUPLINK_CLICK, {
      whatsAppLink: whatsAppLink,
      userId:userId
    });
      
  };

  render() {
    const {t, mallName, whatsAppLink, userMode} = this.props;
    const isStripVisible = whatsAppLink && whatsAppLink != '' && userMode === 'CU';
    if(isStripVisible) {
    return (
      <TouchableOpacity onPress={this.onClickCLWhatsAppGroupLink}>
        <View style={styles.container}>
          <View style={styles.centerView}>
            <View style={styles.centerViewSection}>
                <AppText size="S" bold style={styles.alphaTextStyle}>
                  {t('Get exciting offers and products')}
                </AppText>
            </View>
            <View style={styles.centerViewSection}>
                <AppText size="XS" style={styles.gamaTextStyle}>
                  {t('Join #MALLNAME#\'s Mart Whatsapp Group',{MALLNAME:mallName && mallName.name})}
                </AppText>
            </View>
          </View>
          <View style={styles.rightView}>
            <View style={styles.rightInnerView}>
              <AppText white size="XS" bold>
                {t('JOIN NOW')}
              </AppText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
    }
    else {
    return <View style={styles.centerView}><AppText size="S" black>{t(`Sorry, your group link is not generated`)}</AppText></View>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: scaledSize(10),
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scaledSize(10),
  },
  centerViewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightInnerView: {
    backgroundColor: Colors.fullOrange,
    paddingVertical: scaledSize(10),
    paddingHorizontal: scaledSize(6),
    borderRadius: scaledSize(2),
  },
  rightView: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphaTextStyle: {
    color: Colors.greenishBlue,
  },
  beetaTextStyle: {
    color: Colors.blue,
  },
  gamaTextStyle: {
    color: Colors.darkishBlue,
  },
  roundView: {
    width: scaledSize(3),
    height: scaledSize(3),
    borderRadius: scaledSize(3),
    backgroundColor: Colors.white,
    marginHorizontal: scaledSize(5),
  },
});

export default withTranslation()(UserTaskStrip);