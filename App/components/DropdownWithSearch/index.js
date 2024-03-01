import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import IconGroup from 'react-native-vector-icons/MaterialIcons';
import {withNavigation} from 'react-navigation';
import Modal from 'react-native-modal';
import {AppText} from '../Texts';
import globalStyles, {Constants} from '../../styles';
import SearchModal from './SearchModal';
import {capitalize} from '../../utils/misc';

/*
    data should be an array with name key
*/

class DropdownWithSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNames: '',
      isModalVisible: false,
    };
    if (Array.isArray(props.selectedValue) && props.selectedValue.length > 0) {
      props.selectedValue.map(el => {
        if (el) {
          this.state.displayNames += `${el.name}, `;
        }
      });
      this.state.displayNames = this.state.displayNames.slice(0, -2);
    }
  }

  onItemClick = val => {
    if (this.props.multi) {
      let name = '';
      val.map(item => {
        name += `${item.name}, `;
      });
      name = name.slice(0, -2);
      this.setState({displayNames: name});
    } else {
      const name = val[0].name || val[0].clientCode;
      this.setState({displayNames: capitalize(name, 'All')});
    }
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  render() {
    styles.container = this.props.overRide
      ? this.props.overRide
      : styles.container;
    const displayNames = this.state.displayNames ? (
      <AppText size={this.props.formTheme ? 'S' : 'L'} dark>
        {capitalize(this.props.value || '', 'All')}
      </AppText>
    ) : (
      <View
        style={
          this.props.formTheme
            ? {
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.3)',
                padding: 10,
                height: 40,
                borderRadius: 4,
              }
            : {}
        }>
        <AppText size={this.props.formTheme ? 'S' : 'M'} lightGrey>
          {capitalize(this.props.value || '', 'All') ||
            capitalize(this.props.placeholder || '', 'All')}
        </AppText>
      </View>
    );
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.label && (
          <AppText size="S" style={[styles.label, this.props.labelStyle]}>
            {this.props.label}
          </AppText>
        )}
        <TouchableOpacity
          onPress={() => {
            if (!this.props.disabled) {
              this.setState({isModalVisible: true});
            }
          }}>
          <Modal
            isVisible={this.state.isModalVisible}
            onBackdropPress={this.closeModal}
            onRequestClose={() => {
              this.closeModal();
            }}>
            <SearchModal
              noSearch={this.props.noSearch}
              data={this.props.data}
              navigation={this.props.navigation}
              listComponent={this.props.listComponent}
              onClick={this.onItemClick}
              onChange={this.props.onChange}
              primaryKey={this.props.primaryKey}
              multi={this.props.multi}
              onSearch={this.props.onSearch}
              closeModal={this.closeModal}
              fetchingData={this.props.fetchingData}
              renderFooter={this.props.renderFooter}
              showFilter={this.props.showFilter}
              placeholderName={this.props.placeholderName}
              filterComponent={this.props.filterComponent}
            />
          </Modal>
          {this.props.showArrow ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText size={'S'} bold style={[this.props.valueTextProps]}>
                {capitalize(this.props.value || '', 'All')}
              </AppText>
              <View style={{marginRight: 5}}>
                <IconGroup
                  name="keyboard-arrow-down"
                  size={20}
                  style={[this.props.valueTextProps]}
                />
              </View>
            </View>
          ) : (
            displayNames
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
  },
  container: {
    borderBottomWidth: 1,
    // ...globalStyles.bottomGreyBorder,
    // ...globalStyles.stdSideMargin,
    paddingBottom: 8,
  },
});

export default withNavigation(DropdownWithSearch);
