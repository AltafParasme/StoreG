// import React, {Component} from 'react';
// import {
//   View,
//   Picker,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import globalStyles, {Constants} from '../../styles';
// import {Footer, FooterTab, Icon, Button} from 'native-base';
// import NavigationService from '../../utils/NavigationService';

// class NavigationFooter extends Component {
//   render() {
//     const data =
//       this.props.options && this.props.options.length
//         ? this.props.options.map(e => e.label)
//         : [];
//     const {defaultValue} = this.props;
//     return (
//       <Footer
//         theme={{
//           tabBarTextColor: Constants.secondaryColor,
//           tabBarActiveTextColor: Constants.secondaryColor,
//           tabActiveBgColor: Constants.secondaryColor,
//         }}>
//         <FooterTab
//           style={{
//             backgroundColor: Constants.white,
//             tabBarTextColor: Constants.secondaryColor,
//             tabBarActiveTextColor: Constants.secondaryColor,
//             tabActiveBgColor: Constants.secondaryColor,
//           }}>
//           <Button
//             onPress={() => {
//               NavigationService.navigate('Home');
//             }}>
//             <Icon type="FontAwesome" name="home" style={styles.footerIcon} />
//           </Button>
//           <Button onPress={() => NavigationService.navigate('OrderConfirmation')}>
//             <Icon type="FontAwesome" name="users" style={styles.footerIcon} />
//           </Button>
//           <Button
//             onPress={() => NavigationService.navigate('UserProfile')}
//             active>
//             <Icon type="FontAwesome" name="user" style={styles.footerIcon} />
//           </Button>
//         </FooterTab>
//       </Footer>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     borderBottomWidth: 1,
//     ...globalStyles.bottomGreyBorder,
//   },
//   dropdown: {
//     width: '100%',
//   },
//   footerIcon: {
//     // backgroundColor: Constants.primaryColor
//   },
// });

// export default NavigationFooter;
