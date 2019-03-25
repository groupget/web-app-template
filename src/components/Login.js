import React, {Component} from "react";
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import "./Login.css";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {registerFirebase} from "../firebase";
import config from "../constants/config";
import {bindActionCreators} from "redux";
import {showErrorMessage, showInfoMessage, showLoadingBlocker, showSuccessMessage} from "../reducers/globalMessages";
import {connect} from "react-redux";
import {loginSuccessfulMessage} from "../constants/messages";
import {loginSuccess} from "../reducers/logged";
import {notifSend} from "redux-notifications/src/actions";


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };
    }

    isFormValid = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event =>  {
        event.preventDefault();
        this.props.showLoadingBlocker(true);
        this.login();
    };

    login() {
        let poolData = {
            UserPoolId : config.cognito.USER_POOL_ID,
            ClientId : config.cognito.APP_CLIENT_ID
        };
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        //todo: userPool in global scope
        let userData = {
            Username : this.state.username,
            Pool : userPool
        };
        let authenticationData = {
            Username : this.state.username,
            Password : this.state.password
        };
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                this.props.loginSuccess(result.getIdToken().getJwtToken());
                this.props.showSuccessMessage(loginSuccessfulMessage);
                this.props.showLoadingBlocker(false);
                console.log(result);
                registerFirebase()
            },
            onFailure: (err) => {
                this.props.showLoadingBlocker(false);
                this.props.showErrorMessage(err.message);
                console.log(err);
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                this.props.showLoadingBlocker(false);
                this.setNewUser(true);
            }
        });
    };

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.isFormValid()}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    showLoadingBlocker,
    showSuccessMessage,
    showInfoMessage,
    showErrorMessage,
    loginSuccess,
    notifSend
}, dispatch);

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Login)