/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col
} from "reactstrap";
import axios from 'axios';
import {useState} from "react";
import { encode, decode } from '../../functions/helpers/encryption';
// require('dotenv').config()

import { redirect_logged_to_dashboard } from '../../functions/helpers/auth';
import {Redirect} from "react-router-dom";

const Login = () => {

    const [logged, setLogged] = useState(false)
    const check_if_logged = async () => {
        const isLogged = await redirect_logged_to_dashboard()
        if (isLogged) setLogged(true)
    }
    check_if_logged()

    const [emailError, setEmailError] = useState('')
    const [emailValue, setEmailValue] = useState('')

    const [passError, setPassError] = useState('')
    const [passValue, setPassValue] = useState('')


    const performLogin = () => {
        // Check email
        const email = emailValue.trim()
        // if (!email.length) {
        //     setEmailError('Email cannot be empty!')
        // }
        // else if (!validate_email(email)) {
        //     setEmailError('Please enter a valid email!')
        // }

        // Check password
        const password = passValue.trim()
        // if (!password.length) {
        //     setPassError('Password cannot be empty!')
        // }

        if (!emailError && !passError) {
            axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth/api/login`, {
                email: emailValue,
                password: passValue
            })
                .then(function (response) {
                    if (response.data.state) {
                        const data = encode(JSON.stringify({
                            id: response.data.id,
                            full_name: response.data.full_name,
                            email: response.data.email
                        }))
                        const token = encode(response.data.token)
                        sessionStorage.setItem('WORKLOG_data', data);
                        sessionStorage.setItem('WORKLOG_token', token);

                        // Redirect to dashboard
                        // window.location.href = "/admin/index";
                        setLogged(true)
                    }
                    // console.log(response);
                })
                .catch(function (error) {
                    const errors = error.response.data.errors
                    // console.log(error);

                    // Check if email has error
                    const emailHasError = errors.find(error => {
                        return error['param'] === 'email'
                    })

                    if (emailHasError) {
                        setEmailError(emailHasError['msg'])
                    }

                    // Check if password has error
                    const passwordHasError = errors.find(error => {
                        return error['param'] === 'password'
                    })

                    if (passwordHasError) {
                        setPassError(passwordHasError['msg'])
                    }
                });
        }
    }

    return (
        <>
            { logged ? (<Redirect push to="/admin/index"/>) : null }
            <Col lg="5" md="7">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <h2><strong>Sign in to your account</strong></h2>
                        </div>
                        <Form role="form">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        autoComplete="new-email"
                                        value={emailValue}
                                        onChange={e => {
                                            setEmailValue(e.target.value)
                                            setEmailError('')
                                        }}
                                    />
                                </InputGroup>
                                <small className="text-danger">{emailError}</small>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passValue}
                                        onChange={e => {
                                            setPassValue(e.target.value)
                                            setPassError('')
                                        }}
                                    />
                                </InputGroup>
                                <small className="text-danger">{passError}</small>
                            </FormGroup>
                            <div className="text-center">
                                <Button className="my-4" color="primary" type="button" onClick={() => performLogin()}>
                                    Sign in
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
                <Row className="mt-3">
                    <Col xs="4">
                        <a
                            className="text-light"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                        >
                            <small>Forgot password?</small>
                        </a>
                    </Col>
                    <Col className="text-right" xs="8">
                        <a
                            className="text-light"
                            href="register"
                            // onClick={(e) => e.preventDefault()}
                        >
                            <small>Don't Have? <span className="text-primary">Create New Account</span></small>
                        </a>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default Login;
