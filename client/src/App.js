import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import PrivateRoute from "./components/routes/PrivateRoute";
import PrivateScreen from "./components/screens/private/PrivateScreen";
import LoginScreen from "./components/screens/login/LoginScreen";
import RegisterScreen from "./components/screens/register/RegisterScreen";
import ResetPasswordScreen from "./components/screens/resetpassword/ResetPasswordScreen";
import ForgotPasswordScreen from "./components/screens/forgetpassword/ForgotPasswordScreen";



const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>

          {/* Private Route throwing path and component as higher order component */}
          <PrivateRoute exact path="/" component={PrivateScreen} />

          <Route exact path="/login" component={LoginScreen} />

          <Route exact path="/register" component={RegisterScreen} />

          <Route exact path="/forgotpassword" component={ForgotPasswordScreen} />

          <Route exact path="/resetpassword/:resetToken" component={ResetPasswordScreen} />

        </Switch>
      </div>
    </Router>

  );
}

export default App;
