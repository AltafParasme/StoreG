import React from 'react';
import {
  ListView,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {connect} from 'react-redux';
import ListComponent from './ListComponent';
import {GetOfferData} from '../redux/action';
import {Colors, Fonts} from '../../../../../assets/global';
import {widthPercentageToDP, scaledSize} from '../../../../utils';

class InfiniteScroll extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: this._rowHasChanged.bind(this),
      }),
      lastPage: 0,
    };

    // Update the data store with initial data.
    this.state.dataSource = this.getUpdatedDataSource(props);
  }

  async componentWillMount() {
    // Initial fetch for data, assuming that listData is not yet populated.
    this._loadMoreContentAsync();
  }

  componentWillReceiveProps(nextProps) {
    // Trigger a re-render when receiving new props (when redux has more data).
    this.setState({
      dataSource: this.getUpdatedDataSource(nextProps),
    });
  }

  getUpdatedDataSource(props) {
    // See the ListView.DataSource documentation for more information on
    // how to properly structure your data depending on your use case.
    let rows = props.listData;

    let ids = rows.map((obj, index) => index);

    return this.state.dataSource.cloneWithRows(rows, ids);
  }

  _rowHasChanged(r1, r2) {
    // You might want to use a different comparison mechanism for performance.
    return JSON.stringify(r1) !== JSON.stringify(r2);
  }

  _renderRefreshControl() {
    // Reload all data
    return (
      <RefreshControl
        refreshing={this.props.listData.isFetching}
        onRefresh={this._loadMoreContentAsync.bind(this)}
      />
    );
  }

  handleLoadMore = () => {
    this.props.getOffers(this.state.lastPage + 1);
    this.setState({
      lastPage: this.state.lastPage + 1,
    });
  };

  _loadMoreContentAsync = async () => {
    this.props.getOffers(this.state.lastPage + 1);
    this.setState({
      lastPage: this.state.lastPage + 1,
    });
  };

  render() {
    const list = ({item, index}) => {
      return (
        <ListComponent
          onBooking={this.bookProduct}
          item={{
            name: item.mediaJson.title.text,
            mrp: item.offerInvocations[0].price,
            offerPrice: item.offerInvocations[0].individualOfferPrice,
            groupPrice: item.offerInvocations[0].offerPrice,
          }}
          index={index}
          handleBottomAction={this.handleBottomAction}
        />
      );
    };

    const Separator = () => (
      <View style={styles.orMainView}>
        <View style={styles.orView}>
          <View style={styles.orInnerView}>
            <Text style={styles.orTextStyle}>{t('or')}</Text>
          </View>
        </View>
      </View>
    );

    const renderFooter = () => (
      <View style={styles.footer}>
        {this.state.loading ? (
          <ActivityIndicator color="blue" style={{margin: 15}} />
        ) : (
          <TouchableOpacity onPress={this.handleLoadMore}>
            {/* <Text>asdfsdf</Text> */}
          </TouchableOpacity>
          // null
        )}
      </View>
    );

    return (
      <ListView
        renderScrollComponent={list}
        dataSource={this.state.dataSource}
        refreshControl={this._renderRefreshControl()}
        canLoadMore={!!this.props.listData}
        onLoadMoreAsync={this._loadMoreContentAsync.bind(this)}
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={renderFooter}
      />
    );
  }
}

const styles = StyleSheet.create({
  orMainView: {
    borderWidth: 0.7,
    position: 'relative',
    marginVertical: 15,
    borderColor: Colors.mutedBorder,
  },
  orView: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: 40,
    width: 50,
    left: widthPercentageToDP(50) - 50 / 2,
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orInnerView: {
    backgroundColor: '#DDDEDF',
    borderRadius: 30,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orTextStyle: {
    fontSize: scaledSize(14),
    color: '#292f3a',
    fontFamily: Fonts.roboto,
  },
});

const mapStateToProps = state => {
  return {listData: state.home.list};
};

const mapDispatchToProps = dispatch => ({
  getOffers: (page, size) => {
    dispatch(GetOfferData(page, size));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfiniteScroll);
