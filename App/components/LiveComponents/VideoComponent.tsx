import React, { Component } from 'react';
import { View , StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '../Texts';
import {Icon} from 'react-native-elements';
import {ListImageBG} from '../ListImageBG/ListImageBG';
import { widthPercentageToDP, heightPercentageToDP } from '../../utils';
import { Constants } from '../../styles';

class VideoComponent extends Component {
  
    componentDidMount() {
      const {video} = this.props;
    }
   
    render() { 
        const {leftPadding, 
          video, 
          language, 
          onPress, 
          videoClick, 
          page, 
          iconStyle,
          position, 
          widgetId, 
          widgetType, 
          category, 
          parentMainStyle
        } = this.props;

        
       
        return ( 
            <View style={[styles.mainView, parentMainStyle]}>
            <View style={styles.imageContainer}>
            <ListImageBG
                  language={language}
                  widgetId={widgetId}
                  position={position}
                  page={page}
                  widgetType={widgetType}
                  category={category}
                  videoComponent={video}
                  screen="videoComponent"
                  style={{height:'100%', width:'100%'}}
                  videoClick={videoClick}
                />
                </View>
              { video && video.isThumbnailVideo ? (
                <TouchableOpacity 
                onPress={videoClick}
                style={[{
                    position: 'absolute',
                    top: heightPercentageToDP(16), 
                },
                iconStyle
                ]}>
                <Icon
                  type="octicon"
                  name="screen-full"
                  color={Constants.white}
                  size={widthPercentageToDP(11)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>) : null}
            </View>
         );
    }
}
 
export default VideoComponent;

const styles = StyleSheet.create({
mainView: {
  backgroundColor: 'transparent',
  borderRadius: 4,
  alignItems: 'center',
},
imageContainer: {
  justifyContent: 'center', 
  alignItems: 'center',
  height: widthPercentageToDP(55),
  width: widthPercentageToDP(100),
}
})