import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {Icon, ButtonGroup} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {LogFBEvent, Events} from '../../../../Events';
import Markdown from 'react-native-simple-markdown';
import {AppText} from '../../../../components/Texts';
import CarouselBanner from '../../../../components/CarouselBanner/CarouselBanner';
import idx from 'idx';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {Images} from '../../../../../assets/images';
import {Constants} from '../../../../styles';
import {ScrollView} from 'react-native-gesture-handler';
import {getClLeaderboard, getStarterKit} from '../actions';
import moment from 'moment';

class CLLeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
    }
  }

  componentDidMount() {
    let monthMinusOneName =  moment().subtract(1,'months').endOf('month').format('MMM');
    let presentMonthName =  moment().startOf("month").format('MMM');
    let monthName =  moment().startOf("month").format('MMM YYYY');
    let startOfMonth = ('0' + moment().month(monthName).startOf("month").toDate().getDate()).slice(-2);
    let endOfMonth   = ('0' + moment().month(monthName).toDate().getDate()).slice(-2);
    let dateRange = startOfMonth + '-' + endOfMonth + ' ' + monthName;
    const {clConfigFetched} = this.props;
    if(!clConfigFetched) {
      this.props.onGetCLOnboarding();
    }
    this.props.onGetCLLeaderboard(dateRange);
    this.setState({
      monthMinusOneName: monthMinusOneName,
      monthName: presentMonthName
    })
  }

  _renderItem = (t, item, index) => {
    return (
      <View style={styles.renderStyle}>
        <View style={styles.renderItemTop}>
          <AppText
            black
            bold
            size="M">
            {t((index+1) + '. ')}
          </AppText>
          <AppText
            black
            bold
            size="M">
            {t(item.name)}
          </AppText>          
        </View>
        <View style={styles.renderItemBottom}>
          <AppText
            black
            bold
            size="M">
            {t(item.totalOrderValue)}
          </AppText>
        </View>

      </View>
    );
  }

  renderSeparator = () => {
    return (
      <View style={styles.renderSaperatorStyle} />
    );
  }

  setIndex = (index) => {
    this.setState({
      index
    });
    let  { monthMinusOneName, monthName } = this.state;
    let dateRange;
    if(index == 0) {
      let startOfMonth = ('0' + moment().month(monthMinusOneName).startOf("month").toDate().getDate()).slice(-2);
      let endOfMonth   = ('0' + moment().month(monthMinusOneName).endOf('month').toDate().getDate()).slice(-2);
      let monthMinusOneNameAndYear =  moment().subtract(1,'months').endOf('month').format('MMM YYYY');
      dateRange = startOfMonth + '-' + endOfMonth + ' ' + monthMinusOneNameAndYear;
    } 
    else if(index == 1) {
      let monthNameAndYear =  moment().startOf("month").format('MMM YYYY');
      let startOfMonth = ('0' + moment().month(monthNameAndYear).startOf("month").toDate().getDate()).slice(-2);
      let endOfMonth   = ('0' + moment().month(monthName).toDate().getDate()).slice(-2);
      dateRange = startOfMonth + '-' + endOfMonth + ' ' + monthNameAndYear;    
    }  
    this.props.onGetCLLeaderboard(dateRange);
  }

  component1 = () => <AppText>{this.state.monthMinusOneName}</AppText>
  component2 = (props) => {
    return (
    <AppText>{this.state.monthName}</AppText>
  )}

  render() {
    let {index, routes} = this.state;
    let {clConfigFetched, leaderBoard, t, loadingLeaderboardData, clLeaderboardData} = this.props;
    let fromHome = this.props.navigation.getParam('fromHome');
    const buttons = [{ element: this.component1, text: 'text' }, { element: this.component2, text: 'text2' }];

    if (!loadingLeaderboardData && clConfigFetched && leaderBoard) {
      leaderBoard = leaderBoard.leaderBoard;
      return (
        <ScrollView
          style={{
            flex: 1,
            maxHeight: fromHome
              ? heightPercentageToDP(80)
              : heightPercentageToDP(73),
          }}>
          <ImageBackground
            source={Images.leaderBack}
            style={{alignItems: 'center'}}>
            <AppText
              white
              bold
              size="M"
              style={{
                marginTop: heightPercentageToDP(2),
                textAlign: 'center',
                fontFamily: 'Righteous-Regular',
              }}>
              {t(leaderBoard.steps[0].title)}
            </AppText>
            <View style={{marginTop: heightPercentageToDP(2)}}>
              <Image source={Images.coins} style={styles.coins} />
            </View>
            {leaderBoard.steps[1] ? (
              <View style={styles.midSection}>
                <LinearGradient
                  colors={['#bf1b36', '#ec3d5a']}
                  style={[
                    styles.linearGradientView,
                    {bottom: heightPercentageToDP(1)},
                  ]}>
                  <AppText white bold style={{textAlign: 'center'}}>
                    {t(leaderBoard.steps[1].title)}
                  </AppText>
                </LinearGradient>

                {leaderBoard.steps[1].substeps &&
                  leaderBoard.steps[1].substeps.map((step, index) => {
                    let boldText = step.textBold ? step.textBold : null;
                    return (
                      <View style={styles.innerContentStyle}>
                        <Image source={Images.arrow} style={styles.arrow} />
                        <AppText
                          white
                          style={{
                            textAlign: 'center',
                            paddingRight: widthPercentageToDP(5),
                          }}>
                          {step.text}
                          <AppText bold style={{textAlign: 'center'}}>
                            {boldText}
                          </AppText>
                        </AppText>
                      </View>
                    );
                  })}
                <LinearGradient
                  colors={['#ec3d5a', '#bf1b36']}
                  style={[
                    styles.linearGradientView,
                    {top: heightPercentageToDP(1)},
                  ]}>
                  <AppText white bold style={{textAlign: 'center'}}>
                    {t(leaderBoard.steps[1].tailer)}
                  </AppText>
                </LinearGradient>
              </View>
            ) : null}
            {leaderBoard.steps[2] && leaderBoard.steps[2].bannerJson ? (
              <View style={styles.carousel}>
                <CarouselBanner
                  categories={leaderBoard.steps[2]}
                  language={this.props.language}
                  dispatch={this.props.dispatch}
                  carouselViewStyle={styles.carouselViewStyle}
                  carouselImageStyle={styles.carouselImageStyle}
                  itemWidthProps={widthPercentageToDP(73)}
                  innerTextStyle={styles.clStepsText}
                  mainViewStyle={{height: heightPercentageToDP(26)}}
                />
              </View>
            ) : null}
            <LinearGradient
              colors={['#ec3d5a', '#bf1b36']}
              style={[
                styles.linearGradientView,
                {
                  paddingHorizontal: widthPercentageToDP(5),
                  paddingTop: heightPercentageToDP(1),
                },
              ]}>
              <AppText white bold style={{textAlign: 'center'}}>
                {t('LEADERBOARD')}
              </AppText>
            </LinearGradient>
          </ImageBackground>
          <View style={{alignItems: 'center'}}>
            <View style={styles.lastStepTitle}>
              <AppText
                bold
                size="M"
                style={{textAlign: 'center'}}>
                {t(leaderBoard.steps[3].title)}
              </AppText>
            </View>

            <ButtonGroup
              onPress={this.setIndex}
              selectedIndex={index}
              buttons={buttons}
              selectedButtonStyle={{ backgroundColor: Constants.primaryColor }}
              selectedTextStyle={{ color: Constants.primaryColor}}
              textStyle={{ color: Constants.primaryColor }}
              containerStyle={{height: 40}} />
            <View style={styles.parentVerticle}>
              <View style={styles.dotWraper}>
                <View style={styles.dotStyle}/>
                <AppText
                  size="M"
                  style={styles.leaderBoardText}>
                  {t('Non Essential categories include Kitchen, Home, Accessory, Beauty, Healthy Items.')}
                </AppText>
              </View>

              <View style={[styles.dotWraper,styles.parentVerticle]}>
                <View style={styles.dotStyle}/>
                <AppText
                  size="M"
                  style={styles.leaderBoardText}>
                  {t('Grocery & Fresh (Fruits & Vegetables) are NOT a part of this dhamaka sales.')}
                </AppText>
              </View>
              {loadingLeaderboardData ? 
              <ActivityIndicator size="large" color="#000"/>
              :
            <FlatList  
              data={clLeaderboardData}
              renderItem={({item,index}) =>  this._renderItem(t,item, index)}  
              ItemSeparatorComponent={this.renderSeparator}  
              />
             }
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  clStepsText: {
    zIndex: 1,
    position: 'absolute',
    top: heightPercentageToDP(3),
    left: widthPercentageToDP(6),
    marginRight: widthPercentageToDP(18),
  },
  midSection: {
    width: widthPercentageToDP(93),
    marginTop: heightPercentageToDP(3),
    paddingHorizontal: widthPercentageToDP(4),
    borderWidth: 2,
    borderColor: '#f1c40f',
    borderRadius: 5,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: heightPercentageToDP(25)
  },
  carouselViewStyle: {
    height: heightPercentageToDP(24),
    width: widthPercentageToDP(71),
    paddingHorizontal: 0,
    top: heightPercentageToDP(1),
  },
  secondCarouselImage: {
    height: heightPercentageToDP(80),
    width: widthPercentageToDP(90),
    resizeMode: 'contain',
    borderRadius: 9,
  },
  lastStepTitle: {
    alignItems: 'center',
    paddingTop: heightPercentageToDP(2),
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
  },
  whatsappCircleGroupDeal: {
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(37),
    height: scaledSize(37),
    borderRadius: 37 / 2,
  },
  carouselImageStyle: {
    height: heightPercentageToDP(24),
    width: widthPercentageToDP(71),
    resizeMode: 'contain',
  },
  linearGradientView: {
    alignSelf: 'center',
    borderRadius: 2,
    paddingHorizontal: heightPercentageToDP(1),
  },
  carousel: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightPercentageToDP(2),
  },
  secondCarouselView: {
    height: heightPercentageToDP(80),
    width: widthPercentageToDP(90),
    top: heightPercentageToDP(1),
    alignItems: 'center',
  },
  lastViewContent: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(7),
    marginVertical: heightPercentageToDP(1),
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.8,
    position: 'absolute',
    bottom: heightPercentageToDP(5),
    width: widthPercentageToDP(90),
    paddingHorizontal: widthPercentageToDP(3.4),
  },
  whatsappIconView: {
    paddingLeft: widthPercentageToDP(16),
    paddingTop: heightPercentageToDP(1),
    flex: 0.15,
  },
  innerContentStyle: {
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(0.5),
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(1),
  },
  iconCLImage: {
    width: widthPercentageToDP(18),
    height: heightPercentageToDP(6),
    top: heightPercentageToDP(5),
    resizeMode: 'contain',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginTop: heightPercentageToDP(1),
    backgroundColor: Constants.black,
    marginRight: widthPercentageToDP(3),
  },
  childT: {
    paddingRight: widthPercentageToDP(5),
  },
  iconImage: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(35),
    resizeMode: 'contain',
    borderRadius: 6,
    alignSelf: 'center',
  },
  coins: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(20),
  },
  arrow: {
    height: scaledSize(11),
    width: scaledSize(14),
    top: heightPercentageToDP(1.5),
  },
  renderStyle:{
    backgroundColor:Constants.white,
    padding:widthPercentageToDP(4),
    width:widthPercentageToDP(90),
    justifyContent:'space-between',
    flexDirection:'row'
  },
  renderSaperatorStyle:{
    backgroundColor:'white',
    height:widthPercentageToDP(0.2),
    width:'100%'
  },
  dotStyle:{
    height:widthPercentageToDP(1),
    width:widthPercentageToDP(1),
    backgroundColor:'black',
    borderRadius:widthPercentageToDP(1)
  },
  dotWraper:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:widthPercentageToDP(90)
  },
  leaderBoardText:{
    marginLeft:widthPercentageToDP(2)
  },
  parentVerticle:{
    marginVertical: heightPercentageToDP(2)
  },
  renderItemTop:{
    alignItems:'center',
    flexDirection:'row',
    flex:7
  },
  renderItemBottom:{
    flex:3,
    justifyContent:'center',
    alignItems:'center'
  }
});

const mapStateToProps = state => ({
  leaderBoard: state.clOnboarding.clConfig,
  clConfigFetched: state.clOnboarding.clConfigFetched,
  loadingLeaderboardData: state.clOnboarding.loadingLeaderboardData,
  clLeaderboardData: state.clOnboarding.clLeaderboardData,
  language: state.home.language,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  onGetCLOnboarding: () => {
    dispatch(getStarterKit());
  },
  onGetCLLeaderboard: (dateRange) => {
    dispatch(getClLeaderboard(dateRange));
  },
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLLeaderBoard)
);
