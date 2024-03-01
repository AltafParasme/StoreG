import {
    StyleSheet,
    Text,
    Slider,
    View,
    FlatList,
    Dimensions,
    TouchableOpacity,
  } from 'react-native';
import React, {Component} from 'react';
import {
    scaledSize,
    AppWindow,
    widthPercentageToDP,
    heightPercentageToDP,
    } from '../../../../utils';
import {SizeComponent} from './SizeComponent';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
  
export class SizeColorWeightContainer extends Component {
constructor(props) {
    super(props);
    this.state = {
        selectedSize: '',
        selectedColor: '',
    };
}

static getDerivedStateFromProps(nextProps, prevState) {
    // do things with nextProps.someProp and prevState.cachedSomeProp
    if (nextProps.selectedSize !== prevState.selectedSize) {
      return {
        selectedSize: nextProps.selectedSize,
        // ... other derived state properties
      };
    }

    if (nextProps.selectedColor !== prevState.selectedColor) {
      return {
        selectedColor: nextProps.selectedColor,
        // ... other derived state properties
      };
    }

    return null;
  }

render() {
    const {t, 
        showSize, // size props
        sizes,
        onSizePress,
        sizeHeader,
        showColor, // color props starts here
        colorHeader,
        colours,
        onColorPress } = this.props;
    const {selectedSize,selectedColor} = this.state;
    return (
    <View>
        {
            (showSize)
            ?
            <View style={styles.sizeStyle}>
                <View style={styles.pickerHeader}>
                <AppText grey bold size="S">
                    {t(sizeHeader)}
                </AppText>
                </View>

                <View style={styles.pickerStyle}>
                <FlatList
                    horizontal={true}
                    data={sizes}
                    extraData={selectedSize}
                    renderItem={({item, index}) => (
                    <SizeComponent
                        index={index}
                        item={item}
                        t={t}
                        isSelectedItem={selectedSize==item}
                        onPress={index => onSizePress(index, item)}
                    />
                    )}
                    keyExtractor={item => item.refId}
                />
                </View>
            </View> : null
        }
        {
            (showColor)
            ?
            <View style={styles.sizeStyle}>
                <View style={styles.pickerHeader}>
                <AppText grey bold size="S">
                    {t(colorHeader)}
                </AppText>
                </View>

                <View style={styles.pickerStyle}>
                <FlatList
                    horizontal={true}
                    data={colours}
                    extraData={selectedColor}
                    renderItem={({item, index}) => (
                    <SizeComponent
                        index={index}
                        isColor={true}
                        item={item}
                        t={t}
                        isSelectedItem={selectedColor==item}
                        onPress={index => onColorPress(index, item)}
                    />
                    )}
                    keyExtractor={item => item.refId}
                />
                </View>
            </View> : null
        }
    </View>
    );
}
}

const styles = StyleSheet.create({
    sizeStyle: {
        marginHorizontal: widthPercentageToDP(2),
        marginBottom: widthPercentageToDP(2),
        height: heightPercentageToDP(8),
        flexDirection: 'column',
    },
    pickerHeader: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: heightPercentageToDP(2),
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    pickerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: heightPercentageToDP(6),
        flexDirection: 'row',
    }
});

const mapStateToProps = state => {
    return {
        selectedSize: state.booking.selectedSize,
        selectedColor:state.booking.selectedColor,
    };
};

const mapDispatchToProps = dispatch => ({
    dispatch,
});

export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(SizeColorWeightContainer)
);
  