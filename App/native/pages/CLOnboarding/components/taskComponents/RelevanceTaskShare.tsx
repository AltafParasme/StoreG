import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import {connect} from 'react-redux';
import {GetLiveOfferList} from '../../../ShopgLive/redux/actions';
import {getUserSegments, startLoading, endLoading} from '../../actions';
import {LogFBEvent, Events} from '../../../../../Events';
import {Icon} from 'react-native-elements';
import {shareOfferOnWhatsApp, removeDuplicates} from '../../../utils';
import {withTranslation} from 'react-i18next';
import { widthPercentageToDP, scaledSize, heightPercentageToDP } from '../../../../../utils';
import {AppText} from '../../../../../components/Texts';
import OfferShare from './OfferShare';
import { Constants } from '../../../../../styles';
 
class RelevanceTaskShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareLoading:false,
            selectedProductId:'',
            sharedItems: [],
        };
        }

        listEmptyComponent = () => {
          const {t} = this.props;
          return(
            <View style={{flex: 1, marginLeft: widthPercentageToDP(4), marginVertical: heightPercentageToDP(2)}}>
              <AppText size='L' bold>{t('Your Offer List is Empty')}</AppText>
            </View>
          );
        }

        componentDidMount() {
         
          let {sharedItems} = this.state;
          if (this.props.data.tag) {
            this.props.getOffers(this.props.data.tag, 1, 21);
          }
          
          
          if (this.props.taskItem && this.props.taskItem.actionData && this.props.taskItem.actionData.length) {
            sharedItems =  sharedItems.concat(this.props.taskItem.actionData)
            this.setState({
              sharedItems: removeDuplicates(sharedItems)
            })
          }
         
        }

          shareOffer = (item, isSharedItem) => {
            const {t, widgetId, groupSummary, userPref, clMediumLogoImage} = this.props;
            let {sharedItems} = this.state;
            let userPrefData = {
              userId: userPref.uid,
              sid: userPref.sid,
            };
        
            let eventProps = {
             widgetId: widgetId,
             taskId: widgetId,
             component: 'CL_TASK'
            };
        
            if (!isSharedItem) {
              sharedItems.push(item.id)
            }

            this.setState({shareLoading:true})
            this.setState({selectedProductId:item.id,
              sharedItems: sharedItems
            })
            

            shareOfferOnWhatsApp(clMediumLogoImage, this.props.screen, 'ProductShare',t, groupSummary, item, eventProps, null, null, userPrefData,
              callback = () => {
                this.setState({shareLoading:false})
              
                if (sharedItems.length > 2) {
                  this.props.onCompleteTask({taskId: widgetId, actionId: item.id}, userPrefData, true)
                } else {
                  this.props.onCompleteTask({taskId: widgetId, actionId: item.id}, userPrefData)
                }
                
              });
             
          }

    render() { 
        const {t, offerList} = this.props;
        
        let listToShow = [];
        if (offerList && offerList.length && offerList.length > 0) {
          offerList.map(offer => {
            if (offer.tag == this.props.data.tag) {
              listToShow = [...offer.data];
            }
          });
        }
      
        let {shareLoading,selectedProductId, sharedItems} = this.state;
        return ( 
            <View>
                 <FlatList
              horizontal={true}
              refreshing={false}
              showsHorizontalScrollIndicator={false}
              data={listToShow}
              renderItem={({item, index}) => (
                <OfferShare
                  shareLoading={shareLoading}
                  item={item}
                  selectedProductId={selectedProductId}
                  index={index}
                  sharedItems={sharedItems}
                  shareOffer={this.shareOffer}
                />
              )}
              ListEmptyComponent={this.listEmptyComponent}
              keyExtractor={item => item.id}
        />
          </View>
         );
    }
}

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    actionData: state.clOnboarding.actionData,
    offerList: state.ShopgLive.liveOfferList,
    loading: state.clOnboarding.loading,
    groupSummary: state.groupSummary,
    clMediumLogoImage: state.clOnboarding.clMediumLogoImage,
  });
 
const mapDispatchToProps = dispatch => ({
    dispatch,
    getOffers: (tag,page,size) => {
      dispatch(GetLiveOfferList(tag,page,size));
  },
    startLoading: (text) => {
      dispatch(startLoading(text))
    },
  });

export default withTranslation()(
connect(mapStateToProps, mapDispatchToProps)(RelevanceTaskShare),
);