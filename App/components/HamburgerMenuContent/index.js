import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import IconGroup1 from 'react-native-vector-icons/Ionicons';
import {NavigationService} from '../../native/router';
import * as actions from '../Header/actions';

class HamburgerContent extends React.Component {
  extractInitials(user) {
    if (!(user.first_name || user.last_name)) {
      return 'X';
    }
    if (user.first_name.split(' ').length > 1) {
      return user.first_name
        .split(' ')
        .map(e => e[0])
        .join('');
    }

    return user.first_name[0] + user.last_name[0];
  }

  render() {
    return (
      <View>
        <View style={HamburgerContentStyles.dpWrap}>
          <View style={HamburgerContentStyles.dp}>
            <Text style={HamburgerContentStyles.dpText}>
              {/* {this.extractInitials(this.props.loginDetails.userDetails)} */}
            </Text>
          </View>
          <Text style={HamburgerContentStyles.name}>
            {/* {this.props.loginDetails &&
              this.props.loginDetails.userDetails &&
              this.props.loginDetails.userDetails.first_name} */}
          </Text>
        </View>
        <View style={HamburgerContentStyles.list}>
          <TouchableOpacity
            style={HamburgerContentStyles.listItemWrap}
            onPress={() => {
              this.props.closeHamburger();
              NavigationService.navigate('CreateBooking');
            }}>
            <Image
              style={HamburgerContentStyles.icon}
              source={require('../../../assets/images/book.png')}
            />
            <Text style={HamburgerContentStyles.label}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HamburgerContentStyles.listItemWrap}
            onPress={() => {
              this.props.closeHamburger();
              NavigationService.navigate('Track');
            }}>
            <Image
              style={HamburgerContentStyles.icon}
              source={require('../../../assets/images/track.png')}
            />
            <Text style={HamburgerContentStyles.label}>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HamburgerContentStyles.listItemWrap}
            onPress={() => {
              this.props.closeHamburger();
              NavigationService.navigate('Pod');
            }}>
            <Image
              style={HamburgerContentStyles.icon}
              source={require('../../../assets/images/pod.png')}
            />
            <Text style={HamburgerContentStyles.label}>POD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HamburgerContentStyles.listItemWrap}
            onPress={() => {
              this.props.closeHamburger();
              NavigationService.navigate('Search');
            }}>
            <Image
              style={HamburgerContentStyles.icon}
              source={require('../../../assets/images/search.png')}
            />
            <Text style={HamburgerContentStyles.label}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HamburgerContentStyles.listItemWrap}
            onPress={() => {
              this.props.logout();
              this.props.closeHamburger();
              //NavigationService.navigate("Login");
            }}>
            <Image
              style={HamburgerContentStyles.icon}
              source={require('../../../assets/images/logout.png')}
            />
            <Text style={HamburgerContentStyles.label}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // headerReducer: state.header,
  // loginDetails: state.login
});

export default connect(mapStateToProps, actions)(HamburgerContent);

const HamburgerContentStyles = StyleSheet.create({
  dpWrap: {
    width: '100%',
    height: 270,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dp: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#be2020',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpText: {
    color: 'white',
    fontSize: 40,
  },
  name: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    padding: 5,
    paddingLeft: 20,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
});
