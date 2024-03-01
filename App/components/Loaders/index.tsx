import React, { Component } from "react";
import { StyleSheet, View, Modal } from "react-native";
import { connect } from "react-redux";
import * as actions from "./actions";
import { AppText } from "../Texts";
import Constants from '../../styles';
import Animation from 'lottie-react-native';

class FullScreenLoader extends Component {
  constructor() {  
    super();
    this.animation = React.createRef();
  }
  
  componentDidUpdate() {
    if (this.props.loaderReducer.loading) {
      this.animation.play(0, 360000)
    }
  }
  
  render() {
    return (
     <Modal
     transparent={false}
     visible={this.props.loaderReducer.loading}>
      <View style={styles.container}>
        <Animation
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: 150,
            height: 150
          }}
          loop={true}
          source={'loader-anim.json'}
        />
        {/* {this.props.loaderReducer.loadingText &&
            this.props.loaderReducer.loadingText.length && (
              <Text dark size="XL" bold white>
                {this.props.loaderReducer.loadingText}
              </Text>
            )} */}
      </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({
  loaderReducer: state.Loader
});

export default connect(
  mapStateToProps,
  actions
)(FullScreenLoader);
