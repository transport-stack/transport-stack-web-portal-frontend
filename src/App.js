import "bootstrap/dist/css/bootstrap.min.css";
import './assets/fonts/fonts.scss'
import './assets/styles/style.scss';

import Routes from "./router/Routes";
import { Suspense } from "react";
import { Provider } from "react-redux";
import store, { persistor } from './redux/store.js'
import { PersistGate } from "redux-persist/integration/react";
import FallbackLoader from "./components/common/ui/loader/FallbackLoader.js";
import AxiosLoaderComponent from "./components/common/ui/loader/LoaderComponent.js";
import { HelmetProvider } from "react-helmet-async";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_TRACKING_ID
if (process.env.REACT_APP_ENV === 'prod' && GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<FallbackLoader />}>
            <AxiosLoaderComponent />
            <Routes />
          </Suspense>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
