import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {LogFBEvent, Events} from '../../Events';
import {connect} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {
  SaveLocation,
  getPincodeFromLocation,
} from '../../native/pages/Home/redux/action';
import {withTranslation} from 'react-i18next';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {AppText} from '../../components/Texts';
import {widthPercentageToDP, heightPercentageToDP} from '../../utils/index';
import NavigationService from '../../utils/NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import idx from 'idx';

let apiCalled = false;
export class LocationComponent extends Component {
  componentDidMount = () => {
    this.gpsActivity(false);
  };

  gpsActivity = requested => {
    // check geolocation permission
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            LogFBEvent(Events.LOCATION_PERMISSION_UNAVAILIBLE, null);
            // showAlert('This feature is not available (on this device / in this context)');
            NavigationService.navigateAndReset('Tab');
            break;
          case RESULTS.DENIED:
            // showAlert('The permission has not been requested / is denied but requestable');
            LogFBEvent(Events.LOCATION_PERMISSION_DINIED, null);
            if (!requested && this.props.shouldAskPermission) {
              // here request permission
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
                // …
                this.gpsActivity(true);
              });
            } else {
              //NavigationService.navigateAndReset('Tab');
              this.getLocation(false);
            }

            break;
          case RESULTS.GRANTED:
            LogFBEvent(Events.LOCATION_PERMISSION_GIVEN, null);
            // showAlert('The permission is granted');
            this.getLocation(true);

            break;
          case RESULTS.BLOCKED:
            LogFBEvent(Events.LOCATION_PERMISSION_DINIED_PERMANENT, null);
            // showAlert('The permission is denied and not requestable anymore');
            NavigationService.navigateAndReset('Tab');
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  getLocation = (isLocationGranted) => {
    // get current location
    const {dispatch, userPreferences} = this.props;
    const prefPinCode = idx(userPreferences, _ => _.prefPinCode);
    if(!prefPinCode) {
      if(isLocationGranted) {
        Geolocation.getCurrentPosition(
          position => {
            const gpsData = JSON.stringify(position);
            //const {page} = this.props;
            //const userId = idx(this.props.login, _ => _.userPreferences.uid);
            // this.props.saveLocation(
            //   userId,
            //   page,
            //   position.coords.latitude,
            //   position.coords.longitude,
            //   gpsData
            // );
            if (!apiCalled) {
              this.props.getPincodeFromLocation(
                position.coords.latitude,
                position.coords.longitude
              );
              apiCalled = true;
            }
            dispatch({
              type: 'home/SET_STATE',
              payload: {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  gpsData: position,
                },
              },
            });
          },
          error => {
            NavigationService.navigateAndReset('Tab');
          },
          {enableHighAccuracy: true, timeout: 6000, maximumAge: 1000}
        );
      } else  {
        if (!apiCalled) {
          this.props.getPincodeFromLocation(
            null,
            null
          );
          apiCalled = true;
        }
      }
    }
    else {
      NavigationService.navigateAndReset('Tab');
    }
  };

  render() {
    const {t} = this.props;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            width: widthPercentageToDP(1),
            height: heightPercentageToDP(100),
          }}
        />
        <ActivityIndicator animating size="large" />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    //login: state.login,
    userPreferences:  state.login.userPreferences
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  getPincodeFromLocation: (lat, long) => {
    dispatch(getPincodeFromLocation(lat, long));
  },
  saveLocation: (userId, page, lat, lng, obj) => {
    dispatch(SaveLocation(userId, page, lat, lng, obj));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(LocationComponent)
);
