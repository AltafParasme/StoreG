import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {SearchBar, Icon} from 'react-native-elements';
import {AppText} from '../Texts';
import globalStyles, {Constants} from '../../styles';

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      selectedItems: [],
    };
  }

  onChange = () => {
    this.props.onClick(this.state.selectedItems);
    this.props.onChange(this.state.selectedItems);
  };

  onSelect = val => {
    // this.props.closeModal();
    if (this.props.multi) {
      this.setState(
        {selectedItems: this.state.selectedItems.concat(val)},
        this.onChange
      );
    } else {
      // this.setState({selectedItems: [val]}, this.onChange);
      this.props.closeModal();
    }
  };

  onDeselect = val => {
    const {selectedItems} = this.state;
    const newItems = [];
    selectedItems.map(items => {
      if (items[this.props.primaryKey] != val[this.props.primaryKey]) {
        newItems.push(items);
      }
    });
    this.setState({selectedItems: newItems}, this.onChange);
  };

  populateUnSelectedList = () => {
    const ListComponent = this.props.listComponent;
    this.props.data.map((item, index) => {
      let notSameItem = true;
      this.state.selectedItems.map(el => {
        if (item[this.props.primaryKey] === el[this.props.primaryKey]) {
          notSameItem = false;
        }
      });
      if (notSameItem) {
        return (
          <ListComponent key={index} data={item} onClick={this.onSelect} />
        );
      }
    });
  };

  render() {
    const ListComponent = this.props.listComponent;
    const scrollStyle = this.props.noSearch ? {} : {maxHeight: '85%'};
    return (
      <View
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        style={styles.container}>
        {!this.props.noSearch ? (
          <View style={styles.searchBarContainer}>
            <SearchBar
              noIcon
              lightTheme
              round
              containerStyle={styles.searchBarContainerStyle}
              inputStyle={styles.searchBarInputStyle}
              showLoadingIcon={this.props.fetchingData}
              loadingIcon={{style: {right: 35, top: 15}}}
              onChangeText={val => {
                this.setState({searchText: val});
                this.props.onSearch(val);
              }}
              placeholder={this.props.placeholderName || 'Search by name'}
              value={this.state.searchText}
            />
          </View>
        ) : null}
        {/* {(this.props.showFilter)?this.props.filterComponent:null} */}
        <ScrollView
          style={scrollStyle}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always">
          {this.props.data.map((item, index) => {
            return (
              <ListComponent key={index} data={item} onClick={this.onSelect} />
            );
          })}
        </ScrollView>
        {this.props.renderFooter
          ? this.props.renderFooter({
              closeModal: this.props.closeModal,
            })
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.white,
    paddingBottom: 10,
  },
  headingStyles: {
    marginTop: 10,
    ...globalStyles.stdSideMargin,
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: Constants.borderGrey,
  },
  backIcon: {
    fontSize: 24,
  },
  searchBarContainerStyle: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 0, //no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputStyle: {
    backgroundColor: Constants.white,
  },
});

export default SearchModal;
