import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Constants} from '../../../../styles';
import moment from 'moment';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import DropdownWithSearch from '../../../../components/DropdownWithSearch';
import {widthPercentageToDP, heightPercentageToDP} from '../../../../utils';
import {FriendListComponent} from '../../ShippingList/component/FriendListComponent';
import {GetClEarning} from '../../ShippingList/redux/actions';
import clWeeklyApiResp from './clWeeklyApiResp';
import CLWeekComponent from './CLWeekComponent';
import Accordian from '../../../../components/Accordion/Accordion.js';
import CLBonusDetails from './CLBonusDetails';
import { showToastr } from '../../utils';

const initialLayout = {width: widthPercentageToDP(100)};

class CLWeeklyTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.tab,
      routes: props.routeTab,
      //selectedWeek: props.routeTab[0].title,
      selectedMonth: null,
      monthList: Array.apply(0, Array(moment(new Date()).month() + 1)).map(
        function(_, i) {
          return moment()
            .month(i)
            .format('MMM-YYYY');
        },
      ),
    };
    this.renderTabBar = this.renderTabBar.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  renderLabel = ({route}) => (
    <AppText
      size="XS"
      medium
      style={[
        route.key === (this.state.routes[this.props.tab] && this.state.routes[this.props.tab].key)
          ? {color: Constants.orange}
          : {},
      ]}>
      {route.title}
    </AppText>
  );

  renderTabBar = props => (
    <TabBar
      {...props}
      renderLabel={this.renderLabel}
      indicatorStyle={{backgroundColor: Constants.orange}}
      style={{
        backgroundColor: Constants.white,
        width: widthPercentageToDP(73),
      }}
      inactiveColor={Constants.grey}
      scrollEnabled={true}
      pressColor={Constants.orange}
      activeColor={Constants.orange}
    />
  );

  componentDidUpdate() {
    const {routeTab} = this.props;
    if (this.state.routes !== routeTab) {
      this.setState({
        routes: routeTab,
        //selectedWeek: routeTab[this.state.index].title,
      });
    }
  }

  renderScene = ({route}) => {
    const {t, tab} = this.props;
    const title = this.state.routes[tab] && this.state.routes[tab].title;
    switch (route.key) {
      case 'w1':
      case 'w2':
      case 'w3':
      case 'w4':
      case 'w5':
      case 'w6':
        return <CLWeekComponent week={title} t={t} />;
      default:
        return null;
    }
  };

  onChange = tab => {
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        tab: tab,
      },
    });

    // showToastr('tab ' +this.state.routes[tab].title)
    this.props.getClEarning(this.state.routes[tab].startDate,'WEEKLY',
    callback=()=>{
      this.setState({clEaringLoaded:true})
    })
  };

  onToggleAccordian = () => {
    this.props.dispatch({
      type: 'shippingList/SET_STATE',
      payload: {
        expanded: !this.props.expanded,
      },
    });
  };

  render() {
    let {t, selectedMonth, routeTab} = this.props;
    selectedMonth = selectedMonth.split(' ')[0];

    if (this.state.routes === routeTab) {
    return (
      <View style={{backgroundColor: Constants.white, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TabView
            navigationState={{
              index: this.props.tab,
              routes: this.state.routes,
            }}
            renderScene={this.renderScene}
            onIndexChange={this.onChange}
            initialLayout={initialLayout}
            swipeEnabled={true}
            renderTabBar={this.renderTabBar}
          />
          <View style={styles.listWrapper}>
            <DropdownWithSearch
              data={this.state.monthList}
              noSearch={true}
              overRide={{padding: 8, marginTop: heightPercentageToDP(0.5)}}
              showArrow={true}
              value={moment(selectedMonth).format('MMM-YYYY')}
              valueTextProps={{color: Constants.primaryColor}}
              listComponent={({key, data, onClick}) => (
                <View style={{marginTop: 10}}>
                  <FriendListComponent
                    index={key}
                    showText={data}
                    t={t}
                    onPress={() =>
                      this.props.onSelectMonthName(key, data, onClick)
                    }
                  />
                </View>
              )}
              keyExtractor={item => item.refId}
            />
          </View>
        </View>
        {/* <View style={{alignSelf: 'center', width: widthPercentageToDP(35)}}>
          <Accordian
            t={t}
            showArrow
            iconColor={Constants.primaryColor}
            title={'Bonus Details'}
            type={'childComponent'}
            childComponent={<CLBonusDetails t={t} />}
            titleStyle={{color: Constants.primaryColor, fontSize: 12}}
          />
        </View> */}
      </View>
    ); } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    height: Dimensions.get('window').height - heightPercentageToDP(105),
    position: 'absolute',
    left: widthPercentageToDP(72),
    width: widthPercentageToDP(30),
    padding: heightPercentageToDP(0.4),
    marginTop: heightPercentageToDP(0.2),
    backgroundColor: Constants.white,
    elevation: 5,
  },
});

const mapStateToProps = state => ({
  tab: state.ShippingList.tab,
  expanded: state.ShippingList.expanded,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getClEarning: (startDate,frequency,callback) => {
    dispatch(GetClEarning(startDate,frequency,callback));
  },
});
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLWeeklyTarget),
);
