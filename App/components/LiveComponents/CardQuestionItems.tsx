import React, {Component} from 'react';
import {AirbnbRating, CheckBox, Card} from 'react-native-elements';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import {AppText} from '../Texts';
import {widthPercentageToDP, heightPercentageToDP} from '../../utils';
import {Constants} from '../../styles';
import {LogFBEvent, Events} from '../../Events';
import {FlatList} from 'react-native-gesture-handler';

export default class CardQuestionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: false,
      currentId: null,
      currentQId: null,
    };
  }

  checkList = ({item, index}) => {
    let selectedConditions = !(
      this.state.currentId !== item.id ||
      this.state.currentQId !== this.props.data.qId
    );
    return (
      <View
        style={{
          marginHorizontal: widthPercentageToDP(2),
          width: widthPercentageToDP(40),
        }}>
        <TouchableOpacity
          style={[
            styles.button,
            item.color ? {flexDirection: 'row'} : {},
            selectedConditions && this.state.selectedOption
              ? {borderColor: '#00a9a6', backgroundColor: '#e2fcfc'}
              : {borderColor: '#e8e8e8'},
          ]}
          onPress={() => {
            this.setState({
              selectedOption: true,
              currentId: item.id,
              currentQId: this.props.data.qId,
            });
            let {eventProps} = this.props;
            eventProps.optionId = item.id;
            eventProps.qId = this.props.data.qId;
            this.props.feedbackTaken(this.props.index, item);
            LogFBEvent(Events.SHOPG_LIVE_QUESTIONNARE_CLICK, eventProps);
          }}>
          {item.color ? (
            <View
              style={[styles.colorContainer, {backgroundColor: item.color}]}
            />
          ) : null}
          {item.images ? (
            <Image style={styles.tinyLogo} source={{uri: item.images}} />
          ) : null}
          <View
            style={[
              item.color || item.images
                ? {
                    justifyContent: 'center',
                    paddingHorizontal: heightPercentageToDP(2),
                  }
                : {padding: heightPercentageToDP(3)},
            ]}>
            <AppText style={{textAlign: 'center'}}>{item.label}</AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {data, index, t, length} = this.props;
    let firstOptions = [];
    let secondOptions = [];

    data.options.map((d, index) => {
      d.qId = `${this.props.index + 1}`;
      if (
        index < Math.ceil(data.options.length / 2) ||
        data.options.length < 3
      ) {
        firstOptions = firstOptions.concat(d);
      } else {
        secondOptions = secondOptions.concat(d);
      }
    });

    return (
      <View>
        <Card containerStyle={styles.cardContainerStyle}>
          <View style={{alignItems: 'center'}}>
            {length > 1 ? (
              <AppText
                size="XS"
                bold
                style={{color: Constants.primaryColor, textAlign: 'center'}}>
                {t('#INDEX# OF #TOTAL#', {INDEX: index + 1, TOTAL: length})}
              </AppText>
            ) : null}
          </View>
          <View style={{alignItems: 'center'}}>
            <AppText bold size="L">
              {data.title}
            </AppText>
          </View>
          <View>
            <FlatList
              data={firstOptions}
              horizontal
              listKey={(item, index) => index.toString()}
              extraData={this.state}
              renderItem={item => this.checkList(item)}
              showsHorizontalScrollIndicator={false}
            />
            <FlatList
              data={secondOptions}
              horizontal
              listKey={(item, index) => index.toString()}
              extraData={this.state}
              renderItem={item => this.checkList(item)}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  colorContainer: {
    width: widthPercentageToDP(14),
    height: heightPercentageToDP(7.6),
    // borderTopRightRadius: 3,
    // borderBottomRightRadius: 3,
    borderRadius: 3,
    marginRight: widthPercentageToDP(2),

    alignSelf: 'center',
  },
  button: {
    borderWidth: 1,
    marginVertical: heightPercentageToDP(2),
    justifyContent: 'space-between',
    borderRadius: 3,
  },
  colorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(8),
  },
  selectedButton: {
    borderColor: Constants.primaryColor,
    borderWidth: 2,
    borderRadius: 6,
    backgroundColor: '#e8f8f5',
  },
  tinyLogo: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(18),
    alignSelf: 'center',
    marginTop: heightPercentageToDP(2),
    resizeMode: 'contain',
  },
  secondListButton: {
    marginBottom: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: 3,
    borderWidth: 1,
  },
  firstListButton: {
    margin: heightPercentageToDP(2),
    borderRadius: 3,
    borderWidth: 1,
  },
  cardContainerStyle: {
    width: widthPercentageToDP(98),
    backgroundColor: Constants.white,
    borderRadius: 6,
  },
});
