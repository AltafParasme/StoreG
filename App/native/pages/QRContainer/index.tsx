import React, {Component} from 'react';
import {View,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { RNCamera } from "react-native-camera";
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import {scaledSize,widthPercentageToDP, heightPercentageToDP} from '../../../utils';
import { showToastr } from '../utils';
import { SaveGroup } from '../Home/redux/action';
import {GET_ENTITY_BARCODEID} from '../Booking/redux/actions';
import {GetShippingListGroup,GetShippingList} from '../ShippingList/redux/actions';
import BarcodeMask from 'react-native-barcode-mask';
import {Header} from '../../../components/Header/Header';
import {Support} from '../../../components/Support/Support';
import {LogFBEvent, Events, SetScreenName} from '../../../Events';
import idx from 'idx';
import { Constants } from '../../../styles';
import {changeField} from '../Login/actions';

class QRContainerBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showClDetail: false,
      clName:'',
      groupCode:'',
    };
    this.onScanBarCode = this.onScanBarCode.bind(this);
  }

  componentDidMount = () => {
    SetScreenName(Events.LOAD_QR_CODE_SCREEN.eventName());
    LogFBEvent(Events.LOAD_QR_CODE_SCREEN, null);
  };

  backToScan = () => {
    this.setState({showClDetail:false,clName:'',groupCode:''})
    LogFBEvent(Events.QRCODE_BACK_TOSCAN, null);
  }

  addToGroup = () => {
    const {groupCode} = this.state;
    if(groupCode){
      this.props.saveGroup(groupCode);
      LogFBEvent(Events.QRCODE_CHANGE_GROUP, {
        groupCode: groupCode
      });
    } 
    
  }

  onScanBarCodeCallback = (barcodes) => {
    LogFBEvent(Events.QRCODE_SCAN_RESULT, {
              scan_result: barcodes
            });

            const qrCode = barcodes[0];
            const url = (qrCode && qrCode.rawData) ? qrCode.rawData : undefined;

            if((this.props.fromSearch || this.props.fromShippingList) && qrCode.type!='UNKNOWN_FORMAT'){
              const {dispatch} = this.props;
              dispatch({
                type: 'booking/GET_ENTITY_BARCODEID',
                data: {
                  searchBarCodeId: url
                } ,
              });
            } 
            else {
              // this code extract request parameter from url { name, groupCode, offerID }
              let regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match
              while ((match = regex.exec(url))) {
                params[match[1]] = match[2]
              }
              const { name, groupCode, offerID } = params
              if(offerID && (offerID!='')){
                NavigationService.navigate('Booking', {actionId: offerID});
              } else if(groupCode && (groupCode!='')){
                if(userMode == 'CL'){
                  this.setState({showClDetail:true,clName:'CL cannot change groups',groupCode:'invalid'})
                } else if(_groupCode==groupCode){
                  this.setState({showClDetail:true,clName:'You are already part of this group',groupCode:'invalid'})
                } else {
                  this.setState({showClDetail:true,clName:name,groupCode:groupCode})
                }
              }
            }
  }

  onScanBarCode = (barcodes) => {
    const { isLoggedIn } = this.props;
    if(!isLoggedIn) {
      this.props.onChangeField('loginInitiatedFrom', 'QRContainer');
      NavigationService.navigate('Login', {callback: () => {
        this.onScanBarCodeCallback(barcodes) 
      }});
    }
    else {
      this.onScanBarCodeCallback(barcodes);
    }
  }

  render() {

    const {dispatch} = this.props;
    if(this.props.scanApiCall){

      if(!this.props.scanApiNoShipmentFound){
        if(this.props.toBarcodeFromGroup){
          dispatch({
            type: 'shippingList/SET_STATE',
            payload: {
              selectedShipping: this.props.groupList[0],
              groupShippingDetail: true,
            },
          });
        } else {
          dispatch({
            type: 'shippingList/SET_STATE',
            payload: {
              selectedShipping: this.props.list[0],
              groupShippingDetail: false,
            },
          });
        }

        NavigationService.navigate('ShipmentDetails');      
      } else {
        showToastr(this.props.t('Invalid Token, no shipment found'))
      }
      dispatch({
        type: 'shippingList/SET_STATE',
        payload: {
          scanApiCall: false
        },
      });
    }

    const {t,groupSummary,login,qrCodeLoading} = this.props;
    const userMode = idx(login, _ => _.userPreferences.userMode);
    const _groupCode = idx(groupSummary, _=>_.groupDetails.info.groupCode);
    if(qrCodeLoading){
      <View style={styles.container}>
          <ActivityIndicator color="black" style={{margin: 15}} />
      </View>
    }

    const {clName,showClDetail} = this.state;
    if(showClDetail){
      return(
        <View style={styles.mainContainer}>
          
          <Header
            t={t}
            title={t('QR code details')}
            rightComponent={<Support t={t} />}
          />

          <View style={styles.container}>
            {
              (this.state.groupCode=='invalid')
              ?
              <AppText black bold size="M">
                {t(clName)}
              </AppText>
              :
              <AppText black bold size="M">
                {t('Group Leader Name : #CLNAME#',{CLNAME:clName})}
              </AppText>
            }


            <View style={styles.shareContainer}>
              {
                (this.state.groupCode=='invalid')
                ?
                null
                :
                <TouchableOpacity
                  onPress={() => {this.addToGroup()}}>
                  <View style={styles.textContainer}>
                    <AppText grey bold size="S">
                        {t('Add to this group')}
                    </AppText>
                  </View>
                </TouchableOpacity>
              }


              <TouchableOpacity
                onPress={this.backToScan}>
                <View style={styles.textContainer}>
                  <AppText grey bold size="S">
                      {t('Back to scan')}
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      );
    }

    return(
      <View style={{flex:1}}>

        <Header
          t={t}
          title={(this.props.fromShippingList || this.props.fromSearch) ? t('Scan barcode') : t('QR code details')}
          rightComponent={<Support t={t} />}/>

        <RNCamera
          style={styles.mainContainer}
          ref={ref => {
            camera = ref
          }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            this.onScanBarCode(barcodes)            
          }}>
              {
                (!this.props.fromShippingList && !this.props.fromSearch)
                ?
                <View style={{backgroundColor: Constants.red, marginTop: heightPercentageToDP(8), alignSelf: 'center'}}>
                <AppText size='S' white style={{padding: heightPercentageToDP(2)}}>{t('Join mart by scanning QR code')}</AppText>
                </View>
                :null
              }

            <BarcodeMask /> 
            
        </RNCamera>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  textContainer:{
    borderWidth:scaledSize(1),
    borderColor:'grey',
    borderRadius:scaledSize(5),
    justifyContent:'center',
    alignItems:'center',
    margin:scaledSize(5),
    padding:scaledSize(5),
  },
  shareContainer:{
    marginTop:scaledSize(10),
    flexDirection:'row',
    width:widthPercentageToDP(100),
    justifyContent:'center',
    alignItems:'center'
  },
});

const mapStateToProps = (state) => ({
  qrCodeLoading: state.home.qrCodeLoading,
  groupSummary: state.groupSummary,
  login: state.login,
  fromShippingList: state.ShippingList.fromShippingList,
  fromSearch: state.ShippingList.fromSearch,
  groupList: state.ShippingList.groupList,
  list: state.ShippingList.list,
  scanApiCall:state.ShippingList.scanApiCall,
  scanApiNoShipmentFound:state.ShippingList.scanApiNoShipmentFound,
  toBarcodeFromGroup:state.ShippingList.toBarcodeFromGroup,
  isLoggedIn: state.login.isLoggedIn
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  saveGroup: (groupCode) => {
    dispatch(SaveGroup(groupCode));
  },
  getShippingListGroup: (page, group, phone,status,awb,shipmentId,shouldShowLoading) => {
    dispatch(GetShippingListGroup(page, group, phone,status,awb,shipmentId,shouldShowLoading));
  },
  getShippingList: (page,status,shipmentId,awb) => {
    dispatch(GetShippingList(page,status,shipmentId,awb));
  },
  getOfferUsingBarCodeId: (searchBarCodeId) => {
    dispatch(GET_ENTITY_BARCODEID(searchBarCodeId));
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  }
});

const QRContainer = connect(
  mapStateToProps,
  mapDipatchToProps
)(QRContainerBase);

export default withTranslation()(QRContainer);
