import * as React from 'react';
import { Component } from 'react';
import {AppText} from '../../../../components/Texts';
import { View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import {withTranslation} from 'react-i18next';
import VideoComponent from '../../../../components/LiveComponents/VideoComponent';

 
class CommunityBanner extends React.Component {
 
    render() {
        const {
            t, 
            correctAnswer, 
            comment, 
            afterMediaJson, 
            beforeMediaJson, 
            language, 
            videoClick,
            beforeText,
            widgetId,
            widgetType,
            category
        } = this.props; 

        let topTitle = 
        comment && correctAnswer ? correctAnswer === comment ? 'Congrats!, you have given correct answer.'
                : 'Oops! It didnt worked!!'
        : beforeText;

        let videoSample = '';
        beforeMediaJson && Object.keys(beforeMediaJson).length && beforeMediaJson[language] && beforeMediaJson[language].map(item => {
      videoSample = item
    })

    let afterVideoSample = '';
    afterMediaJson && Object.keys(afterMediaJson).length && afterMediaJson[language] && afterMediaJson[language].map(item => {
        afterVideoSample = item
      })

        return ( 
          <View>
              <View style={styles.mainSubView}>
                  <AppText bold size='M'>{t(topTitle)}</AppText>
            </View>
            {comment && correctAnswer && (correctAnswer === comment) ? (
                <View  
                    style={[styles.mainView, {backgroundColor: afterVideoSample ? 'transparent' : 'black'}]}>
                    {!afterVideoSample ? 
                        (<AppText white>{t('Correct Answer is: #CORRECTANSWER#', {
                            CORRECTANSWER: correctAnswer
                        })}</AppText>) :  (
                        <VideoComponent
                            video={afterVideoSample}
                            parentMainStyle={styles.videoComponentStyle}
                            iconStyle={{top: heightPercentageToDP(10)}}
                            widgetId={widgetId}
                            category={category}
                            position={24}
                            page={1}
                            widgetType={widgetType}
                            videoClick={() => videoClick(0, afterVideoSample)}
                            language={language}
                        />
                    )}
                </View>
            ) : (
            <View 
                style={styles.mainView}>
                {videoSample ? (
                    <VideoComponent
                        video={videoSample}
                        parentMainStyle={styles.videoComponentStyle}
                        iconStyle={{top: heightPercentageToDP(10)}}
                        widgetId={widgetId}
                        category={category}
                        position={24}
                        page={1}
                        widgetType={widgetType}
                        videoClick={() => videoClick(0, videoSample)}
                        language={language}
                    />
                ) : null}
            </View>
            )}
            </View>
         );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    videoComponentStyle: {
        height: widthPercentageToDP(45),
        width: widthPercentageToDP(100),
        alignSelf: 'center'
    },
    mainSubView: {
        alignItems: 'center',
        backgroundColor: '#ffd500',
        padding: scaledSize(4)
    }
})
 
export default withTranslation()(
    CommunityBanner
  );