// ** React Imports
import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// ** Redux Imports
import { Provider } from "react-redux";

// ** ThemeColors Context

import { ThemeContext } from "./utility/context/ThemeColors";
import ability from './configs/acl/ability'
import { AbilityContext } from './utility/context/Can'
// ** ThemeConfig
import themeConfig from "./configs/themeConfig";

// ** Toast
import { Toaster } from "react-hot-toast";

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner";

// ** Ripple Button
import "./@core/components/ripple-button";

// ** PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// ** React Hot Toast Styles
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss";

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css";
import "./@core/scss/core.scss";
import "./assets/scss/style.scss";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import thunkMiddleware from "redux-thunk";
import { logger } from "redux-logger";
// ** Service Worker
import * as serviceWorker from "./serviceWorker";
import {serverStatus} from "@src/resources/constants";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "@store/rootReducer";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ** Lazy load app
const LazyApp = lazy(() => import("./App"));

const container = document.getElementById("root");
const root = createRoot(container);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store;
if (serverStatus === "Dev") {
    store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunkMiddleware)))
} else {
    store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))
}
const persist = persistStore(store)

root.render(
  <BrowserRouter>
    <Provider store={store}>
        <Suspense fallback={<Spinner />}>
            <AbilityContext.Provider value={ability}>
                <PersistGate persistor={persist}>
                    <ThemeContext>
                        <LazyApp />
                        {/*<Toaster*/}
                        {/*    position={themeConfig.layout.toastPosition}*/}
                        {/*    toastOptions={{ className: "react-hot-toast" }}*/}
                        {/*/>*/}
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                        {/* Same as */}
                        <ToastContainer />
                    </ThemeContext>
                </PersistGate>
            </AbilityContext.Provider>
        </Suspense>
    </Provider>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
