import React from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const InfiniteScroll = props => (
  <FlatList
    {...props}
    ListFooterComponentStyle={styles.loader}
    ListFooterComponent={() =>
      props.isLoading ? (
        <View>
          <ActivityIndicator animating size="large" />
        </View>
      ) : null
    }
  />
);

InfiniteScroll.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  loader: {
    paddingVertical: 20,
    borderColor: '#CED0CE',
  },
});

export default InfiniteScroll;
