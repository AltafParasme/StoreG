import React, {Component} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {LogFBEvent, Events, ErrEvents, SetScreenName} from '../../../../Events';
import {
  noop,
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
  AppWindow,
} from '../../../../utils/index';
import SliderList from '../Components/SliderList';
import Modal from 'react-native-modal';
import CommunityAction from '../../../../components/LiveComponents/CommunityAction';

export class TypeSlider extends Component {

  constructor() {
    super();
    this.state = {
      isCommunityActionPressed:false,
      indexCarousel:0
    };
  }

  closeCommunityActionModal = () => {
    this.setState({isCommunityActionPressed: false});
  };

  openCommunityModal = (index) => {
    this.setState({isCommunityActionPressed: true, indexCarousel: index});
  }

  render() {
    const {t,item} = this.props;
    const {isCommunityActionPressed,indexCarousel} = this.state;
    const widgetId = item && item.widgetId;
    const widgetType = item && item.widgetType;
    const widgetData = item && item.widgetData;
    const communityActionData = widgetData.communityActionData;
    const dataBackgroundColor = widgetData.dataBackgroundColor;
    const communityActionCoins = widgetData.communityActionCoins;
    const shareMessage = '';
    return (
      <View style={styles.contaierStyle}>
          <SliderList 
            t={t} 
            data={communityActionData}
            dataBackgroundColor={dataBackgroundColor}
            onPressItems={this.openCommunityModal}/>
            <Modal
              isVisible={isCommunityActionPressed}
              onBackButtonPress={this.closeCommunityActionModal}>
                <CommunityAction 
                  indexCarousel={indexCarousel}
                  closeCommunityActionModal={this.closeCommunityActionModal}
                  communityActionData={communityActionData}
                  communityActionCoins={communityActionCoins}
                  shareMessage={shareMessage}/>
            </Modal>
      </View>
    
    );
  }
}

const styles = StyleSheet.create({
  contaierStyle:{
    backgroundColor:'white',
    flex:1
  }
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(TypeSlider)
);