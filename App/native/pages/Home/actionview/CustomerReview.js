import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Picker,
  Linking,
} from 'react-native';
import {Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AirbnbRating, Header, CheckBox} from 'react-native-elements';
import {AppText} from '../../../../components/Texts';
import Button from '../../../../components/Button/Button';
import {SetFeedBack} from '../../Home/redux/action';
import {LogFBEvent, Events} from '../../../../Events';
import {appStoreURL} from '../../../../Constants';
import {widthPercentageToDP, heightPercentageToDP} from '../../../../utils';

class CustomerReviewBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingC: null,
      //posCheckboxes: props.feedBack.positiveOptions.map((x, index) => ({id: index, name: x, isChecked: false, type: 'pos'})),
      negCheckboxes:
        props.feedBack &&
        props.feedBack.improvementOptions.map((y, index) => ({
          id: index,
          name: y,
          isChecked: false,
        })),
      isCheckedOthers: false,
      comments: '',
    };
  }

  componentDidMount() {
    LogFBEvent(Events.LOAD_CSAT_POPUP, null);
  }

  toggleNegCheckbox(name) {
    let negCheckboxes = this.state.negCheckboxes;
    const index = negCheckboxes.findIndex(i => i.name === name);
    const allTrueChecks = negCheckboxes.filter(j => j.isChecked);
    if (allTrueChecks.length) {
      let id = allTrueChecks[0].id;
      negCheckboxes[id].isChecked = false;
    }
    negCheckboxes[index].isChecked = !negCheckboxes[index].isChecked;
    this.setState(negCheckboxes);
    if (negCheckboxes[index].name === 'Others') {
      this.setState({
        isCheckedOthers: negCheckboxes[index].isChecked,
      });
    } else {
      this.setState({
        isCheckedOthers: false,
      });
    }
  }

  onPressButton = skip => {
    let userId = this.props.userId;
    let entityType = 'ORDER EXPERIENCE';
    let entityId = this.props.feedBack
      ? this.props.feedBack.entityId
      : this.props.entityId;
    let {comments, ratingC} = this.state;
    const negFeedbackArr =
      this.state.negCheckboxes &&
      this.state.negCheckboxes.filter(j => j.isChecked);
    const negFeedback = negFeedbackArr && negFeedbackArr.map(x => x.name)[0];
    let feedback = this.state.ratingC < 4 && negFeedback ? negFeedback : '';
    let rating = skip === 'skip' ? (ratingC > 3 ? ratingC : 0) : ratingC;
    let feedBackPayload = {
      userId,
      entityId,
      entityType,
      rating,
      feedback,
      comments,
    };

    this.props.setFeedBack(feedBackPayload);
    if (skip === 'skip') {
      if (ratingC > 3) {
        LogFBEvent(Events.CSAT_PLAYSTORE_CLICK, null);
        Linking.openURL(appStoreURL);
      } else {
        LogFBEvent(Events.CSAT_SKIP_CLICK, null);
      }
    } else {
      LogFBEvent(Events.CSAT_CONTINUE_CLICK, null);
    }
    this.props.isVisible(false);
  };

  ratingCompleted = rating => {
    this.setState({
      ratingC: rating,
    });
  };

  render() {
    const {t, feedBack, customFeedBack, entityId} = this.props;
    const checkList = ({item, index}) => {
      return (
        <View style={{flex: 0.9}}>
          <CheckBox
            title={item.name}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={item.isChecked}
            size={20}
            containerStyle={{paddingVertical: 0, borderWidth: 0}}
            textStyle={{fontSize: 12}}
            onPress={() => this.toggleNegCheckbox(item.name)}
          />
        </View>
      );
    };
    return (
      <View
        style={[
          styles.topContainer,
          this.state.ratingC && this.state.ratingC < 4
            ? customFeedBack
              ? {height: heightPercentageToDP(45)}
              : {height: heightPercentageToDP(58)}
            : {height: heightPercentageToDP(35)},
        ]}>
        <Header
          containerStyle={{
            backgroundColor: Colors.blue,
            height: heightPercentageToDP(8),
          }}
          centerComponent={
            <View style={{paddingBottom: heightPercentageToDP(4)}}>
              <AppText white bold style={{textAlign: 'center'}}>
                {t('Your Latest Order Feedback For OrderId : #ORDERID#', {
                  ORDERID: customFeedBack ? entityId : feedBack.entityId,
                })}
              </AppText>
            </View>
          }
        />
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View
            style={{
              flex: 0.95,
              paddingTop: heightPercentageToDP(3),
              justifyContent: 'center',
            }}>
            <View
              style={[
                {flex: 0.3, justifyContent: 'center'},
                this.state.ratingC && this.state.ratingC < 4
                  ? {marginTop: heightPercentageToDP(2)}
                  : {},
              ]}>
              {!this.state.isCheckedOthers ? (
                <AppText
                  size="L"
                  style={{
                    textAlign: 'center',
                    paddingBottom: heightPercentageToDP(3),
                  }}>
                  {t('Rate your overall experience')}
                </AppText>
              ) : null}
              <AirbnbRating
                count={5}
                reviews={[]}
                onFinishRating={this.ratingCompleted}
                defaultRating={0}
                reviewSize={15}
                size={23}
                starContainerStyle={
                  customFeedBack
                    ? {bottom: heightPercentageToDP(6)}
                    : {bottom: heightPercentageToDP(5)}
                }
              />
            </View>
            {!customFeedBack && this.state.ratingC && this.state.ratingC < 4 ? (
              <View
                style={{
                  flex: 0.96,
                  justifyContent: 'center',
                }}>
                <AppText
                  size="M"
                  style={{
                    textAlign: 'center',
                    paddingBottom: heightPercentageToDP(2),
                  }}>
                  {t('How can we improve?')}
                </AppText>
                <FlatList
                  data={this.state.negCheckboxes}
                  extraData={this.state}
                  renderItem={checkList}
                />
              </View>
            ) : null}

            {this.state.ratingC &&
            this.state.ratingC < 4 &&
            (this.state.isCheckedOthers || customFeedBack) ? (
              <TextInput
                style={{
                  borderColor: '#e3e3e3',
                  borderWidth: 1,
                  marginTop: heightPercentageToDP(1),
                  width: widthPercentageToDP(75),
                  alignSelf: 'center',
                }}
                onChangeText={comments => this.setState({comments})}
                placeholder={'How can we help?'}
                value={this.state.comments}
                placeholderTextColor="#B9BBBF"
                editable={true}
                maxLength={500}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
            }}>
            <Button
              styleContainer={[
                styles.supportBtn,
                {backgroundColor: Colors.white},
              ]}
              onPress={() => this.onPressButton('skip')}>
              <AppText greenishBlue bold size="S" style={{textAlign: 'center'}}>
                {this.state.ratingC > 3
                  ? t('Rate Us on Google Play')
                  : t('Skip')}
              </AppText>
            </Button>
            <Button
              onPress={this.onPressButton}
              styleContainer={[
                styles.supportBtn,
                {
                  paddingRight: widthPercentageToDP(4),
                  backgroundColor: Colors.greenishBlue,
                },
              ]}>
              <AppText white bold size="M">
                {t('Continue')}
              </AppText>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    width: widthPercentageToDP(90),
    shadowOffset: {width: 10, height: 10},
    alignSelf: 'center',
    shadowColor: Colors.black,
    backgroundColor: '#f8f8ff',
    shadowOpacity: 1.0,
  },
  supportBtn: {
    paddingLeft: widthPercentageToDP(4),
    backgroundColor: Colors.blue,
    flex: 0.5,
    height: 44,
    color: Colors.blue,
    textAlign: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setFeedBack: feedBackPayload => {
    dispatch(SetFeedBack(feedBackPayload));
  },
});

const CustomerReview = connect(null, mapDispatchToProps)(CustomerReviewBase);

export default withTranslation()(CustomerReview);
