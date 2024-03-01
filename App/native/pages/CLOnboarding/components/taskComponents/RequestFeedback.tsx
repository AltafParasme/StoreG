import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {AppText} from '../../../../../components/Texts';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  GetShippingListGroup,
  SetDelivered,
} from '../../../ShippingList/redux/actions.js';
import {Icon} from 'react-native-elements';
import {changeField} from '../../actions';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
  ShineOverlay,
} from 'rn-placeholder';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../../utils';
import { Constants } from '../../../../../styles';

class RequestFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
  }

  renderItemList = (value, index) => {
    const {t} = this.props;
    return (
      <View
      style={styles.mainViewStyle}>
    </View>
    );
  }


  render() {
   return(
     <View></View>
    )
   }
}

const styles = StyleSheet.create({
  mainViewStyle:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(3.3),
    borderBottomWidth: 0.5,
    borderBottomColor: '#d6d6d6',
  },
  circleView: {
    width: scaledSize(25),
    height: scaledSize(25),
    borderRadius: 27 / 2,
    borderWidth: 1,
    elevation: 5,
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(2),
    borderColor: Constants.white,
    backgroundColor: Constants.green
  },
  taskGroupShare: {
    backgroundColor: Constants.primaryColor,
    borderRadius: 6,
    elevation: 5,
  },
  rightInnerView: {
    backgroundColor: Constants.orange,
    marginTop: heightPercentageToDP(2),
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(4.5),
    padding: heightPercentageToDP(1.4),
    justifyContent: 'center',
    borderRadius: scaledSize(2),
  },
  straightLineView: {
    borderWidth: 0.5,
    borderColor: '#d6d6d6',
    marginVertical: heightPercentageToDP(1),
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    marginVertical: heightPercentageToDP(2),
  },
  placeHolderMainView: {
    marginVertical: 6,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  placeHolderMediaStyle: {
    width: widthPercentageToDP(28),
    height: heightPercentageToDP(3),
    marginRight: widthPercentageToDP(5),
  },
  placeHolderLineStyle: {
    paddingBottom: heightPercentageToDP(5),
    marginLeft: widthPercentageToDP(14),
  }
});

const mapStateToProps = state => ({
  userPref: state.login.userPreferences,
  markDeliver: state.ShippingList.markDeliver,
  shipmentsToBeDelivered: state.clOnboarding.shipmentsToBeDelivered
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(RequestFeedback),
);
