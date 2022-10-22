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

// Timepicker
import moment from 'moment';
import { TimePicker } from 'antd';
import "antd/dist/antd.css";

import NumericInput from 'react-numeric-input';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select'
// core components
import Header from "components/Headers/Header.js";
import {useEffect, useState} from "react";
import Loading from 'react-fullscreen-loading';
import {Redirect, useLocation} from "react-router-dom";
import Jobs from '../../functions/jobs/Jobs'
import WorkDays from '../../functions/workdays/WorkDays'

import { calc_work_hours } from '../../functions/helpers/calculators'

function closeModal() {

}


const NewWorkDay = () => {
    let location = useLocation()

    const [loading, setLoading] = useState(true)
    const [allowedToEdit, setAllowedToEdit] = useState(true)
    const [userJobs, setUserJobs] = useState([])
    const [workDayInfo, setWorkDayInfo] = useState({})
    // const [totalWorkHours, setTotalWorkHours] = useState('-')
    let start_hour = ''
    let end_hour = ''

    const get_user_jobs = async () => {
        const user_jobs = await Jobs.get_user_jobs()
        if (user_jobs['state']) {
            setUserJobs(user_jobs['user_jobs'])
        }
        setLoading(false)
    }

    // Get job name based on its
    const get_job_name = () => {
        // return Jobs.get_job_name(userJobs, workDayInfo['job_id'])
        return Jobs.get_job_name(userJobs, inputField['job_id'])
    }

    useEffect(() => {
        get_user_jobs()
        setAllowedToEdit(true)
    }, []);

    const [inputField , setInputField] = useState({
        date: '',
        start_hour: '00:00',
        end_hour: '00:00',
        job_id: '',
        remote_workday: false,
        total: ''
        // total: calc_work_hours('00:00', '00:00')['hours'] + 'h ' + calc_work_hours('00:00', '00:00')['mins'] + 'm'
    })
    const [style, setStyle] = useState({
        save_btn: {
            disabled: false,
            'class': 'primary',
            icon: 'fa-save',
            text: 'Save Work Day'
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
     * Hour handler
     * @param _moment {Object}
     * @param _name {String} > Name of the element, Example: start_hour
     */
    const hourHandler = (_moment, _name) => {
        const hour = _moment.format('HH:mm')
        setInputField({
            ...inputField,
            [_name]: hour,
            // ['total']: calc_work_hours(inputField['start_hour'], inputField['end_hour'])['hours'] + 'h ' + calc_work_hours(inputField['start_hour'], inputField['end_hour'])['mins'] + 'm'
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
    const save_work_day = async () => {
        setLoading(true)
        const res = await WorkDays.save_new_workday(inputField)

        if (res['state']) {
            setErrors([])
            setStyle({
                ...style,
                ['save_btn']: {
                    disabled: true,
                    'class': 'success',
                    icon: 'fa-check',
                    text: 'Work Day Saved'
                }
            })

            setTimeout(() => {
                setStyle({
                    ...style,
                    ['save_btn']: {
                        disabled: false,
                        'class': 'primary',
                        icon: 'fa-save',
                        text: 'Save Work Day'
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
            else if (!res['row_inserted']) {
                setStyle({
                    ...style,
                    ['save_btn']: {
                        disabled: true,
                        'class': 'danger',
                        icon: 'fa-times',
                        text: 'Error While Saving!'
                    }
                })
            }
        }
        setLoading(false)
    }

    return (
        <>
            { allowedToEdit ? null : (<Redirect push to="/admin/workdays"/>) }
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
                                        <h3 className="mb-0">Edit Work Day</h3>
                                    </Col>
                                    <Col className="text-right" xs="8">
                                        <Button color="primary" onClick={() => setAllowedToEdit(false)} size="md">
                                            <i className="fa fa-arrow-left"></i> Back To Work Days List
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4">
                                        Work Day information
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-first-name">
                                                        Date <code>*</code> <i className="fa fa-question-circle" data-tip="The date of the work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <DatePicker
                                                        id="start_date"
                                                        dateFormat="DD-MM-YYYY"
                                                        placeholder="Work day date"
                                                        value={inputField.date}
                                                        onChange={(e) => dateHandler(e, 'date')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label>
                                                        Job <code>*</code> <i className="fa fa-question-circle" data-tip="The" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Select
                                                        className="form-control-alternative"
                                                        id="job_id"
                                                        placeholder="Select your job"
                                                        onChange={(e) => selectHandler(e, 'job_id')}
                                                        options={
                                                            userJobs.map((job, i) => {
                                                                return {value: job['_id'], label: job['name']}
                                                            })
                                                        }
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-last-name">
                                                        Start Hour <code>*</code> <i className="fa fa-question-circle" data-tip="The start hour of the work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <TimePicker
                                                        class="form-control"
                                                        className="form-control"
                                                        use12Hours={false}
                                                        format="HH:mm"
                                                        value={moment(`${inputField.start_hour}`, 'HH:mm')}
                                                        defaultValue={moment(`00:00`, 'HH:mm')}
                                                        onChange={(e) => hourHandler(e, 'start_hour')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-last-name">
                                                        End Hour <code>*</code> <i className="fa fa-question-circle" data-tip="The end hour of the work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <TimePicker
                                                        class="form-control"
                                                        className="form-control"
                                                        use12Hours={false}
                                                        format="HH:mm"
                                                        value={moment(`${inputField.end_hour}`, 'HH:mm')}
                                                        defaultValue={moment(`00:00`, 'HH:mm')}
                                                        onChange={(e) => hourHandler(e, 'end_hour')}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4" hidden>
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="input-last-name">
                                                        Total <i className="fa fa-question-circle" data-tip="The total work hours of this work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Input className="form-control-alternative"
                                                           type="text"
                                                           disabled={true}
                                                           // value={inputField.total}
                                                           // defaultValue={inputField.total}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    <h6 className="heading-small text-muted mb-4">Advanced</h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label>
                                                        Remote Work Day <code>*</code> <i className="fa fa-question-circle" data-tip="In case it is a remote work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Select className="form-control-alternative"
                                                            value={{value: inputField.remote_workday, label: inputField.remote_workday?'Yes':'No'}}
                                                            onChange={(e) => selectHandler(e, 'remote_workday')}
                                                            options={[
                                                                { value: true, label: 'Yes' },
                                                                { value: false, label: 'No' },
                                                            ]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label>
                                                        Note <i className="fa fa-question-circle" data-tip="A note about this work day" />
                                                        <ReactTooltip />
                                                    </label>
                                                    <Input className="form-control-alternative"
                                                           placeholder="A few words about this work day..."
                                                           id="note"
                                                           defaultValue={inputField.description}
                                                           type="text"
                                                           onChange={(e) => inputsHandler(e)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
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
                                            <Button color={style.save_btn.class} onClick={() => save_work_day()} size="md" disabled={style.save_btn.disabled}>
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

export default NewWorkDay;
