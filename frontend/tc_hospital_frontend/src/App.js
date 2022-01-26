import React from "react";

import "./styles/shared/App.css";

import Routes from "./components/general/routes/Routes";
import {BrowserRouter} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
  );
}

export default App;
