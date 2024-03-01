import React, {PureComponent, Component} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {withTranslation} from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Fade,
  PlaceholderMedia,
  ShineOverlay,
} from 'rn-placeholder';
import {connect} from 'react-redux';
import {Images} from '../../../../../assets/images';
import {getTaskData} from '../../CLOnboarding/actions';
import TaskCoins from './TaskCoins';
import {Constants} from '../../../../styles';
import {heightPercentageToDP, widthPercentageToDP} from '../../../../utils';

class EarnCoins extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: null,
    };
  }

  componentDidMount = () => {
    this.props.getTaskData(true);
  };

  onPressTasks = id => {
    this.setState({
      activeId: id,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.earnCoins !== nextProps.earnCoins ||
      this.state.activeId !== nextState.activeId
    ) {
      return true;
    }
    return false;
  }

  render() {
    let {earnCoins, t} = this.props;
    if (earnCoins.length > 0) {
      return (
        <View style={{flex: 1, backgroundColor: '#f2f2f2' }}>
            {/* <AppText bold size="M" style={styles.topText}>
              {t('Earn Coins')}
            </AppText> */}
            <View>
              <FlatList
                data={earnCoins}
                extraData={this.state}
                contentContainerStyle={{
                  paddingBottom: heightPercentageToDP(15),
                }}
                removeClippedSubviews={true}
                renderItem={({item, index}) => {
                  return (
                    <TaskCoins
                      data={item}
                      onPressTasks={this.onPressTasks}
                      activeId={this.state.activeId}
                      navigation={this.props.navigation}
                    />
                  );
                }}
              />
            </View>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, marginTop: heightPercentageToDP(3)}}>
          <PlaceholderLine width={25} style={styles.placeHolderLineStyle} />
          <Placeholder
            Animation={ShineOverlay}
            style={{
              marginVertical: heightPercentageToDP(2),
            }}>
            <PlaceholderMedia style={styles.placeHolderMediaStyle} />
          </Placeholder>
          <Placeholder
            Animation={ShineOverlay}
            style={{
              marginVertical: heightPercentageToDP(2),
            }}>
            <PlaceholderMedia style={styles.placeHolderMediaStyle} />
          </Placeholder>
          <Placeholder
            Animation={ShineOverlay}
            style={{
              marginVertical: heightPercentageToDP(2),
            }}>
            <PlaceholderMedia style={styles.placeHolderMediaStyle} />
          </Placeholder>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  topText: {
    paddingHorizontal: widthPercentageToDP(4),
    marginTop: heightPercentageToDP(3),
  },
  placeHolderMainView: {
    marginVertical: 6,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  placeHolderMediaStyle: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(9),
    marginRight: widthPercentageToDP(5),
  },
  placeHolderLineStyle: {
    paddingBottom: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(3),
    marginBottom: heightPercentageToDP(2),
    marginLeft: widthPercentageToDP(4),
  },
});

const mapStateToProps = state => ({
  earnCoins: state.rewards.earnCoins,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTaskData: isEarnCoins => {
    dispatch(getTaskData(isEarnCoins));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EarnCoins)
);
