import React, {Component} from "react";
import {Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";
import "./Register.css";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import config from "../constants/config";
import {bindActionCreators} from "redux";
import {showErrorMessage, showInfoMessage, showLoadingBlocker, showSuccessMessage} from "../reducers/globalMessages";
import {loginSuccess} from "../reducers/logged";
import {notifSend} from "redux-notifications/src/actions";
import connect from "react-redux/es/connect/connect";
import {loginSuccessfulMessage} from "../constants/messages";


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
        };
    }

    isFormValid = () => {
        return this.state.username.length > 0 && this.state.email.length > 0 && this.state.password.length > 0
    };

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event =>  {
        event.preventDefault();
        this.props.showLoadingBlocker(true);
        this.register();
    };

    register() {
        let poolData = {
            UserPoolId : config.cognito.USER_POOL_ID,
            ClientId : config.cognito.APP_CLIENT_ID
        };
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        let emailAttribute = {
            Name: "email",
            Value: this.state.email
        };
        let userAttributes = [new AmazonCognitoIdentity.CognitoUserAttribute(emailAttribute)];
        userPool.signUp(this.state.username,
            this.state.password,
            userAttributes,
            [],
            (err, result) => {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('user name is ' + result.user.getUsername());
                this.props.showLoadingBlocker(false);
                //todo: redirect to login page
            });
    };

    render() {
        return (
            <div className="Register">
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

                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.email}
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
                        Register
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)