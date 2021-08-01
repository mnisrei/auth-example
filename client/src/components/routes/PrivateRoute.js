import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    console.log({ ...rest });
    return (
        <Route
            {...rest}
            render={
                (props) =>
                    localStorage.getItem("authToken") ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="login" />
                    )
            }
        />
    )
}

export default PrivateRoute
