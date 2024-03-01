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

class TaskMarkDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressedButtonItem: null,
      isLoading: false,
      currentIndex: null,
      taskGroupListCheck: null,
      onLoadMore: false,
      isApiCalled: false,
    };
    this.renderItemList = this.renderItemList.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
  }
 
  componentDidUpdate() {
    let {markDeliver, taskGroupList, userPref, shipmentsToBeDelivered, widgetId, isDone, data, isExpanded, totalTaskGroupListCount} = this.props;
    
    let {taskGroupListCheck, isApiCalled} = this.state;
    let eventProps = {
      taskId: widgetId,
      widgetType: data.widgetType,
    };
    let userPrefData = {
      userId: userPref.uid,
      sid: userPref.sid,
    };

    if (isExpanded && !isApiCalled) {
      this.props.getShippingListGroup(1, true, undefined, 'Received by you', undefined, undefined, undefined, true);
      this.setState({
        isApiCalled: true
      })
    }

    if (taskGroupList.length > 0 && !this.state.taskGroupListCheck) {
      this.setState({
        taskGroupListCheck: taskGroupList.map((y, index) => ({
          id: index,
          item: y,
          isChecked: false
        }))
      })
    }

    
    if (
      this.state.pressedButtonItem &&
      markDeliver &&
      markDeliver.shipmentId === this.state.pressedButtonItem
    ) {
      if (markDeliver.success) {
        taskGroupListCheck[this.state.currentIndex].isChecked = true;
      }
   
      this.setState({
        pressedButtonItem: null,
        currentIndex: null,
        taskGroupListCheck: taskGroupListCheck,
        isLoading: false,
      });
    }

   

    if ((taskGroupList.length > 0 && !isDone) &&  
    (shipmentsToBeDelivered && shipmentsToBeDelivered.length == taskGroupList.length) ) {
      this.props.onCompleteTask(eventProps, userPrefData);
    } else  if (totalTaskGroupListCount == 0 && !isDone)
    {
      this.props.onCompleteTask(eventProps, userPrefData);
    }
  }


  onLoadMore = () => {
    const {totalTaskGroupListCount, taskGroupList} = this.props;
    if (this.state.onLoadMore) {
      
      this.setState({
        taskGroupListCheck: taskGroupList.map((y, index) => ({
          id: index,
          item: y,
          isChecked: false
        }))
      }) 
    }
    if (totalTaskGroupListCount > taskGroupList.length) {
     
      const page = Math.ceil(taskGroupList.length / 10) + 1;
        this.props.getShippingListGroup(
          page,
          true,
          undefined,
          'Received by you',
          undefined,
          undefined,
          undefined,
          true,
        );
        this.setState({
          onLoadMore: true
        })
      } else {
        this.setState({
          onLoadMore: false
        })
      }
  }


  renderItemList = (value, index) => {
    const {t} = this.props;
    return (
      <View
      style={styles.mainViewStyle}>
      <View>
        <AppText bold size="M">
          {t(`Shipment-ID ${value.item.shipmentId}`)}
        </AppText>
        <AppText bold>
          {t(`${value.item.items} item(s)`)}
        </AppText>
        <View style={{width: widthPercentageToDP(45)}}>
        <AppText >
          {t(`${value.item.userName} - ${value.item.phoneNumber}`)}
        </AppText>
        </View>
      </View>
      { 
      value.isChecked ? (
        <View
        style={styles.circleView}>
        <Icon
              name="done"
              type="material"
              color={Constants.white}
              size={widthPercentageToDP(4.5)}
              containerStyle={{
                alignSelf: 'center',
                top: heightPercentageToDP(0.4)
              }}
            />
          </View>
      ) : (
      <TouchableOpacity
        style={styles.rightInnerView}
        onPress={() =>
          this.onPressMarked(value.item, index, this.state.taskGroupListCheck.length)
        }>
        { this.state.isLoading && this.state.currentIndex == index ? 
        (
          <ActivityIndicator color={Constants.white} size="small"/>
        ) 
        :
        (
        <AppText
          white
          size="XXS"
          bold
          style={{textAlign: 'center'}}>
          {t('MARK DELIVERED')}
        </AppText>)}
      </TouchableOpacity>)
      }
    </View>
    );
  }


  onPressMarked = (item, index, length) => {
    let {taskGroupListCheck} = this.state;
    let {shipmentsToBeDelivered} = this.props;

    this.setState({
      isLoading: !this.state.isLoading,
      currentIndex: index,
      pressedButtonItem: item.shipmentId
    });


   
    this.props.setDelivered(item.shipmentId, null);
    shipmentsToBeDelivered.push(item);
    this.props.onChangeField('shipmentsToBeDelivered', shipmentsToBeDelivered);

  };

  render() {
    
    const {taskGroupList, 
      t, 
      isDeliveredShipmentLoading, 
      shipmentsToBeDelivered, 
      totalTaskGroupListCount
    } = this.props;
    if(isDeliveredShipmentLoading) {
      return (
        <View
        style={styles.loadingView}>
        <Placeholder
          Animation={ShineOverlay}
          style={styles.placeHolderMainView}
          Left={() => (
            <PlaceholderMedia
              style={styles.placeHolderMediaStyle}
            />
          )}>
          <PlaceholderLine
            width={50}
            style={styles.placeHolderLineStyle}
          />
        </Placeholder>
        <Placeholder
          Animation={ShineOverlay}
          style={{
            marginVertical: 6,
            marginHorizontal: 15,
            borderRadius: 4,
          }}
          Left={() => (
            <PlaceholderMedia
            style={styles.placeHolderMediaStyle}
            />
          )}>
          <PlaceholderLine
            width={50}
            style={styles.placeHolderLineStyle}
          />
        </Placeholder>
        </View>
      );
    } else if (totalTaskGroupListCount == 0) {
      return(
      <View style={{flex: 1, marginTop: heightPercentageToDP(2)}}>
         <AppText>{t('Good Job, Today you have no pending deliveries to your mart customer.')}</AppText>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          {totalTaskGroupListCount ? (
          <View style={{marginTop: heightPercentageToDP(1.3), marginHorizontal: widthPercentageToDP(3.3)}}>
            <AppText bold size='M'>{t(`${shipmentsToBeDelivered.length}/${totalTaskGroupListCount}`)}</AppText>
          </View>) : null}
          <FlatList
            data={this.state.taskGroupListCheck}
            extraData={this.state}
            renderItem={({item, index}) => this.renderItemList(item, index)}
            onEndReached={this.onLoadMore}
            />
        </View>
      );
          }
  }
}

const styles = StyleSheet.create({
  mainViewStyle:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: heightPercentageToDP(1.5),
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
    marginLeft: widthPercentageToDP(4),
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
  isDeliveredShipmentLoading: state.clOnboarding.isDeliveredShipmentLoading,
  taskGroupList: state.clOnboarding.taskGroupList,
  totalTaskGroupListCount: state.clOnboarding.totalTaskGroupListCount,
  markDeliver: state.ShippingList.markDeliver,
  shipmentsToBeDelivered: state.clOnboarding.shipmentsToBeDelivered
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  getShippingListGroup: (
    page,
    group,
    phone,
    status,
    awb,
    shipmentId,
    shouldShowLoading,
    isFromCLTask
  ) => {
    dispatch(
      GetShippingListGroup(
        page,
        group,
        phone,
        status,
        awb,
        shipmentId,
        shouldShowLoading,
        isFromCLTask
      ),
    );
  },
  onChangeField: (fieldName: string, value: any) => {
    dispatch(changeField(fieldName, value));
  },
  setDelivered: (shipmentId, otp) => {
    dispatch(SetDelivered(shipmentId, otp));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(TaskMarkDelivery),
);
