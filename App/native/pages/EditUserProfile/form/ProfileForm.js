import React from 'react';
import {withTranslation} from 'react-i18next';
import {View, Text, StyleSheet} from 'react-native';
import CommonInput from '../../../../components/Input/Input';
import {Fonts, Colors} from '../../../../../assets/global';
import {scaledSize} from '../../../../utils';
import RadioButton from '../../../../components/RadioButton/RadioButton';
import {AppText} from '../../../../components/Texts';
import {CheckBox} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {Constants} from '../../../../styles';

const ProfileForm = ({
  handleChange,
  form: {name, phoneNumber, email, gender, age},
  validation,
  isValid,
  error,
  genderList,
  t,
}) => (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.form}>
      <CommonInput
        name="name"
        label={t('Name')}
        value={name}
        handleChange={handleChange}
        placeholder={t('name')}
        isRequired={validation.name}
        onBlur={() => {
          isValid('name');
        }}
        errors={error}
      />
      <CommonInput
        name="phoneNumber"
        label={t('Phone Number')}
        value={phoneNumber}
        handleChange={handleChange}
        placeholder={t('Your phoneNumber')}
        keyboardType="phone-pad"
        isRequired={validation.phone}
        onBlur={() => isValid('phoneNumber')}
        errors={error}
        disabled={true}
      />
      <CommonInput
        name="age"
        label={t('Age')}
        value={age.toString()}
        handleChange={handleChange}
        placeholder={t('Your age')}
        keyboardType="phone-pad"
        onBlur={() => isValid('age')}
        errors={error}
      />
      <View>
        <AppText size="S" style={{color: '#989A9F'}}>
          {t(`Gender`)}
        </AppText>
        <View style={{marginTop: 10}}>
          <RadioButton
            name="gender"
            options={genderList}
            value={gender}
            onChange={handleChange}
          />
        </View>
      </View>
      <CommonInput
        name="email"
        label={t('Email')}
        value={email}
        handleChange={handleChange}
        placeholder={t('Your email')}
        keyboardType="email-address"
        // isRequired={validation.email}
        onBlur={() => isValid('email')}
        errors={error}
      />
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  form: {
    paddingVertical: 10,
    paddingBottom: 20,
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
  changeText: {fontSize: scaledSize(14), color: Colors.blue},
});

export default withTranslation()(ProfileForm);
