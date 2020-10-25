import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.css";
import Home from "./Components/home.js";
import Search from "./Components/search.js"




class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component = {Home} />
            <Route exact path="/search" component = {Search} />
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
