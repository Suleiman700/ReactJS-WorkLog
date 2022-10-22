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
    Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Row, Col
} from "reactstrap";
import axios from 'axios';
import {useState} from "react";

const Register = () => {
    const [nameVal, setNameVal] = useState('') // Store name value
    const [emailVal, setEmailVal] = useState('') // Store email value
    const [passwordVal, setPasswordVal] = useState('') // Store password value
    const [tosChecked, setTosChecked] = useState(false) // Store TOS checked state

    const [nameError, setNameError] = useState('') // Store name error
    const [emailError, setEmailError] = useState('') // Store email error
    const [passwordError, setPasswordError] = useState('') // Store password error
    const [tosError, setTosError] = useState('') // Store TOS error

    const [passwordStrengthText, setPasswordStrengthText] = useState('') // Store password strength text
    const [passwordStrengthTextClass, setPasswordStrengthTextClass] = useState('') // Store class of the password strength text

    const [processingData, setProcessingData] = useState(false)


    const check_password_strength = () => {
        let strength = 0;
        if (passwordVal.match(/[a-z]+/)) {
            strength += 1;
        }
        if (passwordVal.match(/[A-Z]+/)) {
            strength += 1;
        }
        if (passwordVal.match(/[0-9]+/)) {
            strength += 1;
        }
        if (passwordVal.match(/[$@#&!]+/)) {
            strength += 1;
        }

        switch (strength) {
            case 0:
            case 1:
                setPasswordStrengthText('Weak')
                setPasswordStrengthTextClass('text-danger')
                break;
            case 2:
                setPasswordStrengthText('Medium')
                setPasswordStrengthTextClass('text-warning')
                break;
            case 3:
                setPasswordStrengthText('Accepted')
                setPasswordStrengthTextClass('text-info')
                break;
            case 4:
                setPasswordStrengthText('Strong')
                setPasswordStrengthTextClass('text-success')
                break;
        }
    }

    const performSignup = () => {
        setProcessingData(true)

        axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth/api/signup`, {
            name: nameVal,
            email: emailVal,
            password: passwordVal,
            tos: tosChecked
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                // console.log(error);

                // Check if name has error
                const nameHasError = errors.find(error => {
                    return error['param'] === 'name'
                })
                if (nameHasError) {
                    setNameError(nameHasError['msg'])
                }

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
                    setPasswordError(passwordHasError['msg'])
                }

                // Check if TOS has error
                const tosHasError = errors.find(error => {
                    return error['param'] === 'tos'
                })
                if (tosHasError) {
                    setTosError(tosHasError['msg'])
                }
            });

        setProcessingData(false)
    }

    return (<>
            <Col lg="6" md="8">
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <h2><strong>Create New Account</strong></h2>
                        </div>
                        <Form role="form">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-hat-3"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Name"
                                        type="text"
                                        value={nameVal}
                                        disabled={processingData}
                                        onChange={e => {
                                            setNameVal(e.target.value)
                                            setNameError('')
                                        }}/>
                                </InputGroup>
                                <small className="text-danger mx-3">{nameError}</small>
                            </FormGroup>
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
                                        value={emailVal}
                                        disabled={processingData}
                                        onChange={e => {
                                            setEmailVal(e.target.value)
                                            setEmailError('')
                                        }}
                                    />
                                </InputGroup>
                                <small className="text-danger mx-3">{emailError}</small>
                            </FormGroup>
                            <FormGroup className="mb-2">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={passwordVal}
                                        disabled={processingData}
                                        onChange={e => {
                                            setPasswordVal(e.target.value)
                                            setPasswordError('')
                                            check_password_strength()
                                        }}
                                    />
                                </InputGroup>
                                <small className="text-danger mx-3">{passwordError}</small>
                            </FormGroup>
                            <div className="text-muted font-italic" hidden={!passwordStrengthText}>
                                <small>
                                    password strength:{" "}
                                    <span
                                        className={`${passwordStrengthTextClass} font-weight-700`}>{passwordStrengthText}</span>
                                </small>
                            </div>
                            <Row className="my-4">
                                <Col xs="12">
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            id="customCheckRegister"
                                            type="checkbox"
                                            disabled={processingData}
                                            onChange={e => {
                                                setTosChecked(e.target.checked) // true|false
                                                setTosError('')
                                            }}
                                        />
                                        <label className="custom-control-label" htmlFor="customCheckRegister">
                                          <span className="text-muted">
                                            I agree with the{" "}
                                              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                              Privacy Policy
                                            </a>
                                          </span>
                                        </label>
                                    </div>
                                    <small className="text-danger mx-3">{tosError}</small>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button className="mt-4" color="primary" type="button" onClick={() => performSignup()} disabled={processingData}>
                                    Create account
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
                <Row className="mt-3">
                    <Col xs="6">
                    </Col>
                    <Col className="text-right" xs="6">
                        <a
                            className="text-light"
                            href="login"
                            // onClick={(e) => e.preventDefault()}
                        >
                            <small>Have Existing Account? <span className="text-primary">Login Now</span></small>
                        </a>
                    </Col>
                </Row>
            </Col>
        </>);
};

export default Register;
