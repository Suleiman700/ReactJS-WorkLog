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
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip, Col, CardBody, CardTitle, Button, Modal, Input, FormGroup, Form, Alert
} from "reactstrap";
import {DatePicker} from 'reactstrap-date-picker'
// import TimePicker from 'react-time-picker';
import NumericInput from 'react-numeric-input';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select'
// core components
import Header from "components/Headers/Header.js";
import {useEffect, useState} from "react";
import Loading from 'react-fullscreen-loading';
import {Redirect, useLocation} from "react-router-dom";
import Jobs from '../../functions/jobs/Jobs'
// import {Redirect, Route} from "react-router-dom";


function closeModal() {

}


const EditJob = () => {
    let location = useLocation()

    const [loading, setLoading] = useState(true)
    const [allowedToEdit, setAllowedToEdit] = useState(true)
    const [userJobs, setUserJobs] = useState([])
    const [jobInfo, setJobInfo] = useState({})

    /**
     * Check if user is allowed to edit job
     * @param _job_id {String}
     */
    const allowed_to_edit = async (_job_id) => {
        if (_job_id === undefined) {
            setAllowedToEdit(false)
            return
        }

        const allowed = await Jobs.if_can_edit(_job_id)
        if (allowed['state']) {
            console.log(allowed['job_info'])
            setJobInfo(allowed['job_info'])
            const job_info = allowed['job_info']
            // setInputField( {['name']: allowed['job_info']['name']} )

            setInputField( {
                ['id']: job_info['_id'],
                ['name']: job_info['name'],
                ['address']: job_info['address'],
                ['start_date']: job_info['start_date'],
                ['active']: job_info['active'],
                ['hourly']: job_info['hourly'],
                ['break_time']: job_info['break_time'],
                ['exclude_break_time']: job_info['exclude_break_time'],
                ['description']: job_info['description'],
            } )

        }
        else {
            setAllowedToEdit(false)
        }

        setLoading(false)
    }

    const get_user_jobs = async () => {
        const user_jobs = await Jobs.get_user_jobs()
        if (user_jobs['state']) {
            setUserJobs(user_jobs['user_jobs'])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (location.hasOwnProperty('state') && location.state !== undefined) {
            get_user_jobs()
            allowed_to_edit(location.state.job_id)
        }
        else {
            setAllowedToEdit(false)
        }
    }, []);

    const [inputField , setInputField] = useState({
        name: '',
        address: '',
        start_date: '',
        active: '',
        hourly: '',
        break_time: '',
        exclude_break_time: '',
        description: '',
    })
    const [style, setStyle] = useState({
        save_btn: {
            disabled: false,
            'class': 'primary',
            icon: 'fa-save',
            text: 'Save Job'
        }
    })

    const inputsHandler = (e)  => {
        setInputField( {
            ...inputField,
            [e.target.id]: e.target.value
        } )
    }

    /**
     * Date handler
     * @param _value {String} > Date value, Example: 2022-04-30T12:00:00.000Z
     * @param _name {String} > Name of the element, Example: start_date
     */
    const dateHandler = (_value, _name) => {
        setInputField( {
            ...inputField,
            [_name]: _value.split('T')[0]
        })
    }

    /**
     * Select handler
     * @param e {Object} > Example: {value: false, label: 'No'}
     * @param _elm_id {String} > Name of the element, Example: active
     */
    const selectHandler = (e, _elm_id) => {
        const value = e.value
        // const label = e.label

        setInputField( {
            ...inputField,
            [_elm_id]: value
        })
    }

    const [errors, setErrors] = useState([])
    const save_job = async () => {
        setLoading(true)
        const res = await Jobs.save_edited_job(inputField)

        if (res['state'] && res['row_updated']) {
            setErrors([])
            setStyle({
                ...style,
                ['save_btn']: {
                    disabled: true,
                    'class': 'success',
                    icon: 'fa-check',
                    text: 'Job Saved'
                }
            })

            setTimeout(() => {
                setStyle({
                    ...style,
                    ['save_btn']: {
                        disabled: false,
                        'class': 'primary',
                        icon: 'fa-save',
                        text: 'Save Job'
                    }
                })
            }, 1500)
        }
        else {
            // Found errors with fields
            if (res['errors']) {
                const errors_array = []
                res['errors'].forEach(error => {
                    const param = error['param']
                    const error_msg = error['msg']
                    errors_array.push(error_msg)
                })
                setErrors(errors_array)
            }
            else {
                setStyle({
                    ...style,
                    ['save_btn']: {
                        disabled: true,
                        'class': 'danger',
                        icon: 'fa-times',
                        text: 'Error While Saving'
                    }
                })
            }

            if (res['state'] && !res['row_updated']) {
                console.log('row not updated')
            }
        }
        setLoading(false)
    }

    return (
        <>
            { allowedToEdit ? null : (<Redirect push to="/admin/jobs"/>) }
            {loading? <Loading loading background="rgb(0 0 0 / 64%)" loaderColor="#3498db" />:null}
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                        <Row>
                            <Col lg="12" xl="4">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                                    Total Jobs
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                  {userJobs.length}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div
                                                    className="icon icon-shape bg-info text-white rounded-circle shadow">
                                                    <i className="fas fa-suitcase"/>
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-nowrap">Your total jobs</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" xl="4">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                                    Active Jobs
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                    {userJobs.filter(user_job => user_job['active'] === true).length}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div
                                                    className="icon icon-shape bg-success text-white rounded-circle shadow">
                                                    <i className="fas fa-check"/>
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-nowrap">Your active jobs</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" xl="4">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                                                    InActive Jobs
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                    {userJobs.filter(user_job => user_job['active'] === false).length}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div
                                                    className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                    <i className="fas fa-times"/>
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-nowrap">Your inactive jobs</span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="4">
                                        <h3 className="mb-0">Edit Job</h3>
                                    </Col>
                                    <Col className="text-right" xs="8">
                                        <Button color="primary" onClick={() => setAllowedToEdit(false)} size="md">
                                            <i className="fa fa-arrow-left"></i> Back To Jobs List
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4">
                                        Job information
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="name">
                                                        Job Name <code>*</code>
                                                    </label>
                                                    <Input type="text" className={`form-control-alternative`}
                                                           id="name"
                                                           placeholder="Enter job name"
                                                           defaultValue={inputField.name}
                                                           onChange={inputsHandler}
                                                           onBlur={inputsHandler} />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="address">
                                                        Job Address
                                                    </label>
                                                    <Input type="text" className={`form-control-alternative`}
                                                           id="address"
                                                           placeholder="Enter job address"
                                                           defaultValue={inputField.address}
                                                           onChange={inputsHandler} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-first-name">
                                                        Start Date <i className="fa fa-question-circle" data-tip="The date you've started working in this job" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <DatePicker
                                                        id="start_date"
                                                        dateFormat="DD/MM/YYYY"
                                                        value={inputField.start_date}
                                                        onChange={(e) => dateHandler(e, 'start_date')} />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-last-name">
                                                        Job Active <code>*</code> <i className="fa fa-question-circle" data-tip="Enable or disable job from adding work days to it" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Select className="form-control-alternative"
                                                            id="active"
                                                            value={{value: inputField.active, label: inputField.active?'Yes':'No'}}
                                                            onChange={(e) => selectHandler(e, 'active')}
                                                            options={[
                                                                { value: true, label: 'Yes' },
                                                                { value: false, label: 'No' },
                                                            ]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    <h6 className="heading-small text-muted mb-4">
                                        Payment
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-city">
                                                        Hourly Payment <code>*</code> <i className="fa fa-question-circle" data-tip="How much you get paid per hour" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <NumericInput className={`form-control`} step={0.1} precision={2}
                                                          id="hourly"
                                                          placeholder="Enter your hourly payment"
                                                          value={inputField.hourly}
                                                          onChange={(e) => inputsHandler({
                                                              target: {
                                                                  id: 'hourly',
                                                                  value: e
                                                              }
                                                          })}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-country">
                                                        Daily Break Time (In Minutes) <code>*</code> <i className="fa fa-question-circle" data-tip="Your daily job break time in minutes (e.g: 30)" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <NumericInput className="form-control"
                                                          id="break_time"
                                                          placeholder="Enter your daily break time in minutes"
                                                          value={inputField.break_time}
                                                          onChange={(e) => inputsHandler({
                                                              target: {
                                                                  id: 'break_time',
                                                                  value: e
                                                              }
                                                          })}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-country">
                                                        Exclude Break Time <code>*</code> <i className="fa fa-question-circle" data-tip="Exclude break time from the final salary statistics" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Select className="form-control-alternative"
                                                        id="exclude_break_time"
                                                        value={{value: inputField.exclude_break_time, label: inputField.exclude_break_time?'Yes':'No'}}
                                                        options={[
                                                            { value: true, label: 'Yes' },
                                                            { value: false, label: 'No' },
                                                        ]}
                                                        onChange={(e) => selectHandler(e, 'exclude_break_time')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    {/* Description */}
                                    <h6 className="heading-small text-muted mb-4">About</h6>
                                    <div className="pl-lg-4">
                                        <FormGroup>
                                            <label>Job Description</label>
                                            <Input className="form-control-alternative"
                                                placeholder="A few words about this job..."
                                                rows="4"
                                                id="description"
                                                defaultValue={inputField.description}
                                                type="textarea"
                                                   onChange={(e) => inputsHandler(e)}
                                            />
                                        </FormGroup>
                                    </div>
                                    <hr className="my-4" />
                                    <Alert color="warning" hidden={!errors.length}>
                                        {
                                            errors.map((error, i) => {
                                                return <div key={i}>{error}</div>
                                            })
                                        }
                                    </Alert>
                                    <Row>
                                        <Col>
                                            <Button color={style.save_btn.class} onClick={() => save_job()} size="md" disabled={style.save_btn.disabled}>
                                                <i className={`fa ${style.save_btn.icon}`} /> {style.save_btn.text}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EditJob;
