import React from 'react';
import {withTranslation} from 'react-i18next';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import CommonInput from '../../../../components/Input/Input';
import {Fonts, Colors} from '../../../../../assets/global';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AppText} from '../../../../components/Texts';
import DropdownWithSearch from '../../../../components/DropdownWithSearch';
import {FriendListComponent} from '../../ShippingList/component/FriendListComponent';
import {Constants} from '../../../../styles';
import {SizeComponent} from '../Component/SizeComponent';
import {showToastr} from '../../utils';

const AddressForm = ({
  handleChange,
  form: {name, pincode, streetAddress, addressLine1, city, state},
  errors,
  validation,
  isLoading,
  takeToEditPinCode,
  localityData,
  localityError,
  dispatch,
  t,
}) => {
  const [labelColor, setLabelColor] = React.useState(Constants.lightFadedGrey);
  const [locality, setLocality] = React.useState({areaName: 'Select Locality'});
  const [friendsArray, setFriendsArray] = React.useState([]);
  const [oldFriendsArray, setOldFriendsArray] = React.useState([]);
  const [filterList, setFilterList] = React.useState(['LOCALITY', 'LANDMARK']);
  const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(-1);

  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    setFriendsArray(localityData);
    setOldFriendsArray(localityData);
    dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedLocality: {}},
    });
  }, []);

  const onSearch = val => {
    if (val && val != '') {
      let _friendsArray = [];
      if (friendsArray && friendsArray.length > 0) {
        friendsArray.map(el => {
          if (el.areaName.toUpperCase().includes(val.toUpperCase())) {
            _friendsArray.push(el);
          }
        });

        if (_friendsArray && _friendsArray.length > 0) {
          setFriendsArray(_friendsArray);
        }
      }
    } else {
      setSelectedSizeIndex(-1);
      setFriendsArray(oldFriendsArray);
    }
  };

  const onSelectLocality = (index, item, onClick) => {
    onClick();
    setLocality(item);
    setLabelColor('black');
    dispatch({
      type: 'booking/SET_STATE',
      payload: {selectedLocality: item},
    });
  };

  const onFilterPress = (index, filter) => {
    setSelectedSizeIndex(index);
    let _friendsArray = [];
    if (localityData && localityData.length > 0) {
      localityData.map(el => {
        if (el.type.toUpperCase() == filter.toUpperCase()) {
          _friendsArray.push(el);
        }
      });

      if (_friendsArray && _friendsArray.length > 0) {
        setFriendsArray(_friendsArray);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <CommonInput
              name="pincode"
              label={t('Pin Code')}
              value={pincode}
              handleChange={handleChange}
              placeholder={t('Your pincode')}
              errors={errors}
              isRequired={validation.pincode}
              loading={isLoading}
              maxLength={6}
              keyboardType="numeric"
            />
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={takeToEditPinCode}
              style={styles.editBtn}>
              <AppText greenishBlue size="L">
                {t(`Edit`)}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <CommonInput
          name="name"
          label={t('Name')}
          value={name}
          handleChange={handleChange}
          placeholder={t('Your name')}
          errors={errors}
          isRequired={validation.name}
        />
        <CommonInput
          name="addressLine1"
          label={t('House/flat/block number')}
          value={addressLine1}
          handleChange={handleChange}
          placeholder={t('Eg. 502, Sector A, Pocket B')}
          errors={errors}
          isRequired={validation.addressLine1}
        />
        {localityData && localityData.length && localityData.length > 0 ? (
          <View style={styles.listWrapper}>
            <DropdownWithSearch
              label={t('Nearest Locality')}
              placeholderName={t('Select Nearest Locality')}
              style={{
                borderColor: Constants.lightFadedGrey,
                borderBottomWidth: heightPercentageToDP(0.05),
              }}
              labelStyle={{color: Constants.lightFadedGrey}}
              valueStyle={[styles.valueStyle, {color: labelColor}]}
              data={
                friendsArray &&
                friendsArray.length &&
                friendsArray.length > 0 &&
                localityData.length > 0
                  ? friendsArray
                  : localityData
              }
              value={locality.areaName}
              onSearch={onSearch}
              showArrow={true}
              showFilter={true}
              filterComponent={
                <View style={styles.pickerStyle}>
                  <FlatList
                    horizontal={true}
                    data={filterList}
                    extraData={selectedSizeIndex}
                    renderItem={({item, index}) => (
                      <SizeComponent
                        index={index}
                        item={item}
                        t={t}
                        selectedIndex={selectedSizeIndex}
                        onPress={index => onFilterPress(index, item)}
                      />
                    )}
                    keyExtractor={item => item.refId}
                  />
                </View>
              }
              listComponent={({key, data, onClick}) => (
                <View style={{marginVertical: heightPercentageToDP(0.5)}}>
                  <FriendListComponent
                    index={key}
                    showText={data.areaName}
                    t={t}
                    onPress={() => onSelectLocality(key, data, onClick)}
                  />
                </View>
              )}
              keyExtractor={item => item.refId}
            />
            {localityError && locality.areaName == 'Select Locality' ? (
              <AppText style={styles.errorText}>
                {t('Please select locality')}
              </AppText>
            ) : null}
          </View>
        ) : (
          <CommonInput
            name="streetAddress"
            label={t('Locality & Landmark')}
            value={streetAddress}
            handleChange={handleChange}
            placeholder={t('Eg. Koramangala , Near Forum Mall')}
            errors={errors}
            isRequired={validation.streetAddress}
          />
        )}

        <CommonInput
          name="state"
          label={t('State')}
          value={state}
          handleChange={handleChange}
          placeholder={t('Your state')}
          errors={errors}
          isRequired={validation.state}
          disabled={true}
        />
        <CommonInput
          name="city"
          label={t('City')}
          value={city}
          handleChange={handleChange}
          placeholder={t('Your city')}
          errors={errors}
          isRequired={validation.city}
          disabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  form: {
    paddingBottom: 10,
  },
  inputStyle: {
    marginTop: 5,
    height: 58,
  },
  deliveryTitle: {
    fontSize: 18,
    color: '#292f3a',
    fontWeight: '600',
    fontFamily: Fonts.roboto,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  changeText: {
    fontSize: scaledSize(14),
    color: Colors.blue,
  },
  editBtn: {
    width: widthPercentageToDP(18),
    marginTop: 25,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.greenishBlue,
    borderWidth: scaledSize(1),
    borderRadius: scaledSize(8),
  },
  listWrapper: {
    flexDirection: 'column',
    marginVertical: scaledSize(5),
    backgroundColor: 'white',
  },
  pickerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: heightPercentageToDP(6),
    flexDirection: 'row',
  },
  valueStyle: {
    marginVertical: heightPercentageToDP(1),
    marginLeft: widthPercentageToDP(1),
  },
  errorText: {
    color: 'red',
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: Fonts.roboto,
    // textTransform: 'capitalize',
  },
});

const mapStateToProps = state => ({
  localityData: state.booking.localityData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddressForm)
);
