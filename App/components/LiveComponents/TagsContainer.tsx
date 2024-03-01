import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../utils';
import {Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {AppText} from '../Texts';
import {Colors, Fonts} from '../../../assets/global';
import {HeaderScrollItem} from './HeaderScrollItem';


export class TagsContainer extends Component {

    onItemPress = (index, item) => {

    }
    
    render() {
        const {t,tagsList} = this.props
        return (
            <View style={styles.tagsContainer}>

              <FlatList
                  contentContainerStyle={{alignItems:'center'}}
                  horizontal={true}
                  data={tagsList}
                  // extraData={this.state.selectedSizeIndex}
                  renderItem={({item, index}) => (
                    <HeaderScrollItem
                      index={index}
                      item={item}
                      t={t}
                      borderColor={Colors.darkBlack}
                      onPress={index => this.onItemPress(index, item)}
                    />
                  )}
                  keyExtractor={item => item}
                  showsHorizontalScrollIndicator={false}
                />

            </View>
        ); 
    }
}

const styles = StyleSheet.create({
    shareData:{
        flexDirection:'row',
        height:heightPercentageToDP(6),
        justifyContent: 'center',
        alignSelf:'center',
        alignItems:'center',
        width:widthPercentageToDP(80),
    },
    tagsContainer: {
        height:heightPercentageToDP(10),
        justifyContent: 'center'
    },  
});

const mapStateToProps = state => ({
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDipatchToProps)(React.memo(TagsContainer))
);
