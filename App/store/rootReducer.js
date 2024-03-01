// import login from '../native/screens/Login/reducer';
import header from '../components/Header/reducer';
import Loader from '../components/Loaders/reducer';
import {home} from '../native/pages/Home/redux/reducer';

const rootReducer = {
  // login,
  header,
  Loader,
  Home: home,
};

export default rootReducer;
