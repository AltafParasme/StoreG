import React from 'react';
import PropTypes from 'prop-types';
import {View, Image} from 'react-native';
import IconGroup1 from 'react-native-vector-icons/Ionicons';
import IconGroup2 from 'react-native-vector-icons/Entypo';
import IconGroup3 from 'react-native-vector-icons/MaterialCommunityIcons';
import IconGroup4 from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '../../styles';

const rightArrowImage = require('../../../assets/images/rightArrow.png');

const IconStyles = {
  color: Constants.white,
  style: {
    backgroundColor: '#e02a2f',
  },
  backgroundColor: '#e02a2f',
};

const LeftIconStyles = {
  color: Constants.white,
  style: {
    backgroundColor: '#e02a2f',
  },
  backgroundColor: '#e02a2f',
};

const BackIcon = ({onPress, style}) => (
  <IconGroup1.Button
    name="md-arrow-back"
    {...LeftIconStyles}
    {...style}
    onPress={() => onPress()}
  />
);
BackIcon.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
};
BackIcon.defaultProps = {
  onPress: () => {},
  style: {},
};

const MenuIcon = ({onPress, style}) => (
  <IconGroup2.Button
    size={25}
    name="menu"
    {...LeftIconStyles}
    {...style}
    onPress={() => onPress()}
  />
);
MenuIcon.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
};
MenuIcon.defaultProps = {
  onPress: () => {},
  style: {},
};

const DeleteIcon = ({onPress}) => (
  <IconGroup3.Button name="delete" {...IconStyles} onPress={() => onPress()} />
);
DeleteIcon.propTypes = {
  onPress: PropTypes.func,
};
DeleteIcon.defaultProps = {
  onPress: () => {},
};

const EditIcon = ({onPress}) => (
  <IconGroup4.Button name="edit" {...IconStyles} onPress={() => onPress()} />
);
EditIcon.propTypes = {
  onPress: PropTypes.func,
};
EditIcon.defaultProps = {
  onPress: () => {},
};

const SearchIcon = ({onPress}) => (
  <IconGroup1.Button
    name="md-search"
    {...IconStyles}
    onPress={() => onPress()}
  />
);
SearchIcon.propTypes = {
  onPress: PropTypes.func,
};
SearchIcon.defaultProps = {
  onPress: () => {},
};

const FilterIcon = ({onPress}) => (
  <IconGroup4.Button
    name="filter-list"
    {...IconStyles}
    onPress={() => onPress()}
  />
);
FilterIcon.propTypes = {
  onPress: PropTypes.func,
};
FilterIcon.defaultProps = {
  onPress: () => {},
};

const ThreeDotsIcon = ({onPress}) => (
  <IconGroup4.Button
    name="more-vert"
    {...IconStyles}
    onPress={() => onPress()}
  />
);
ThreeDotsIcon.propTypes = {
  onPress: PropTypes.func,
};
ThreeDotsIcon.defaultProps = {
  onPress: () => {},
};

const BlankIcon = () => <View {...IconStyles} />;

const RightArrowLong = props => (
  <Image source={rightArrowImage} style={{height: 15, width: 34}} {...props} />
);

const RightArrow = props => (
  <IconGroup1 name="ios-arrow-round-forward" {...props} />
);

export {
  BackIcon,
  MenuIcon,
  BlankIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
  FilterIcon,
  ThreeDotsIcon,
  RightArrowLong,
  RightArrow,
};
