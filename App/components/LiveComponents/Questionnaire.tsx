import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {Card} from 'react-native-elements';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../utils';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import BackgroundSelector from './BackgroundSelector';
import {Constants} from '../../styles';
import DataList from './DataList';
import CardQuestionItems from './CardQuestionItems';
import HeaderComponent from './HeaderComponent';
import {LogFBEvent, Events} from '../../Events';

export class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: null,
      endOfQuestion: false,
    };
    this.listRef = null;
    this.scrollToEnd = this.scrollToEnd.bind(this);
  }

  componentDidMount() {
    const {category,widgetId,index,listItemIndex,widgetType} = this.props;
    LogFBEvent(Events.SHOPG_LIVE_IMPRESSION,{
      category:category,
      widgetId: widgetId,
      position:listItemIndex,
      order:index,
      widgetType:widgetType
    });
  }

  scrollToEnd = (step, value) => {
    const {itemData} = this.props;
    const questions = itemData.questions.length;

    itemData.tags.map(item => {
      if (
        item.qId === value.qId &&
        item.option === value.id &&
        !this.state.tag
      ) {
        this.setState({
          tag: item,
        });
      }
    });
    let scrollInit = 108;
    scrollInit = scrollInit * (step + 1);
    if (step !== questions - 1) {
      setTimeout(() => {
        this.listRef
          .getScrollResponder()
          .scrollTo({x: widthPercentageToDP(scrollInit)});
      }, 500);
    } else {
      this.setState({
        endOfQuestion: true,
      });
    }
  };

  render() {
    const {
      t,
      itemData,
      widgetId,
      page,
      category,
      widgetType,
      index,
      language,
      listItemIndex,
    } = this.props;
    let eventProps = {
      widgetId: widgetId,
      page: page,
      category: category,
      widgetType: widgetType,
      index: index,
    };
    let description = itemData.description;
    let title = itemData.title;
    const imageBackground = itemData.backgroundImage;
    const backgroundColor = itemData.backgroundColor;
    const questions = itemData.questions;
    return (
      <BackgroundSelector
        backgroundImage={imageBackground}
        backgroundColor={backgroundColor}
        style={styles.dealContainer}>
        {title && (
          <HeaderComponent
            t={t}
            index={listItemIndex}
            category={category}
            widgetId={widgetId}
            page={page}
            title={title}
            isNotTimer={!this.state.endOfQuestion}
            selectedtagSlug={this.state.tag && this.state.tag.slug}
          />
        )}

        <View style={styles.topView}>
          {description && (
            <View
              style={[
                styles.descriptionView,
                {backgroundColor: backgroundColor},
              ]}>
              <AppText
                white
                size="XXS"
                bold
                style={{textAlign: 'center', letterSpacing: 0.45}}>
                {t(description)}
              </AppText>
            </View>
          )}
          {this.state.tag && this.state.endOfQuestion ? (
            <Card containerStyle={styles.recommendedView}>
              <View style={styles.tagsContainer}>
                <AppText size="M" bold>
                  {t('Recommended Products for you')}
                </AppText>
              </View>
              <View style={styles.dataContainer}>
                {this.state.tag && (
                  <DataList
                    heightDP={36}
                    selectedTag={this.state.tag}
                    language={language}
                    position={this.props.listItemIndex}
                    page={this.props.page}
                    widgetType={widgetType}
                    category={category}
                    widgetId={widgetId}
                    screenName="questionnaire"
                  />
                )}
              </View>
            </Card>
          ) : (
            <FlatList
              ref={ref => {
                this.listRef = ref;
              }}
              horizontal
              data={questions}
              renderItem={({item, index}) => {
                return (
                  <CardQuestionItems
                    data={item}
                    index={index}
                    t={t}
                    eventProps={eventProps}
                    length={questions.length}
                    feedbackTaken={this.scrollToEnd}
                  />
                );
              }}
            />
          )}
        </View>
      </BackgroundSelector>
    );
  }
}

const styles = StyleSheet.create({
  dealContainer: {
    flexDirection: 'column',
  },
  topView: {
    flex: 1,
    width: widthPercentageToDP(98),
    marginBottom: heightPercentageToDP(2),
    alignSelf: 'center',
  },
  recommendedView: {
    width: widthPercentageToDP(98),
    backgroundColor: Constants.white,
    borderRadius: 6,
    alignSelf: 'center',
  },
  descriptionView: {
    top: heightPercentageToDP(2.2),
    marginLeft: heightPercentageToDP(3),
    padding: heightPercentageToDP(1.5),
    width: widthPercentageToDP(93),
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    alignSelf: 'center',
  },
  recommendedFlatlistView: {
    width: widthPercentageToDP(42),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    height: heightPercentageToDP(1),
    flexDirection: 'row',
  },
  tagsContainer: {
    margin: heightPercentageToDP(2),
    alignItems: 'center',
  },
  dataContainer: {
    //height: heightPercentageToDP(27),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP(90),
    backgroundColor: 'white',
    borderRadius: scaledSize(3),
  },
});

const mapStateToProps = state => ({
  language: state.home.language
});

const mapDipatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(Questionnaire),
);
