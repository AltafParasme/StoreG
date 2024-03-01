import React, {Component} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import HorizontalComponent from './Component/HorizontalComponent';
import {AppText} from '../../../components/Texts';
import {heightPercentageToDP} from '../../../utils';
import {Constants} from '../../../styles';

export default class SimilarProducts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      entityDetails,
      t,
      groupCode,
      isGroupUnlocked,
      handleOtherItemClick,
      refreshing = false,
      isBooking,
      isCart,
      pdpButton,
    } = this.props;
    let entityType = entityDetails.detail.entityType;
    return (
      <View style={styles.mainView}>
        <AppText
          size="L"
          bold
          black
          style={
            !isBooking && !isCart
              ? {paddingBottom: heightPercentageToDP(4)}
              : {padding: heightPercentageToDP(3)}
          }>
          {entityType === 'offers'
            ? t(`Other Similar Products`)
            : t(`Other Essential Products`)}
        </AppText>
        <FlatList
          horizontal={true}
          refreshing={refreshing}
          data={entityDetails.recommendation.rows}
          renderItem={({item, index}) => (
            <HorizontalComponent
              item={item}
              pdpButton={pdpButton}
              withoutButton={false}
              groupCode={groupCode || ''}
              isGroupUnlocked={isGroupUnlocked || ''}
              withCounter
              isBooking
              entityType={entityType}
              onPress={() => handleOtherItemClick(item)}
              index={index}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Constants.white,
    flex: 2,
    marginTop: heightPercentageToDP(2),
  },
});
