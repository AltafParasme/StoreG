import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions/testAction';

class Test extends Component {
  render() {
    return (
      <div>
        <div>Test :{this.props.test}</div>
        <button onClick={() => this.props.testAdd(this.props.test + 1)}>
          Add 1
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  test: state.testReducer.test,
});

export default connect(mapStateToProps, actions)(Test);
