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
    UncontrolledTooltip, Col, CardBody, CardTitle, Button, Modal, Input, FormGroup, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import {useEffect, useState} from "react";
import Loading from 'react-fullscreen-loading';
import WorkDays from '../../functions/workdays/WorkDays'
import { get_day_name, get_date_from_str } from '../../functions/helpers/date_time'
import {Redirect, Route} from "react-router-dom";


function closeModal() {

}

const JobsList = () => {

    const [style, setStyle] = useState({
        delete_modal: {
            delete_btn: {
                text: 'Yes, Delete!',
                color: 'danger',
                disabled: false
            },
            close_btn: {
                text: 'Cancel',
                color: 'secondary',
                disabled: false
            }
        }
    })
    const [loading, setLoading] = useState(true)
    const [userWorkDays, setUserWorkDays] = useState([])
    const get_user_work_days = async () => {
        const user_workdays = await WorkDays.get_user_work_days()
        if (user_workdays['state']) {
            setUserWorkDays(user_workdays['user_workdays'])
        }
        setLoading(false)
    }

    useEffect(() => {
        // Get user workdays
        get_user_work_days()
    }, []);

    const [editWorkDay, setEditWorkDay] = useState(null)
    const edit_workday = (i) => {
        setEditWorkDay(userWorkDays[i]['_id'])
    }

    const [deleteWorkDay, setDeleteWorkDay] = useState({
        show_modal: false,
        workday_id: undefined
    });
    const btn_delete_workday = (i) => {
        setDeleteWorkDay({
            ...deleteWorkDay,
            show_modal: true,
            workday_id: i
        })

        setStyle({
            ...style,
            delete_modal: {
                delete_btn: {
                    text: 'Yes, Delete!',
                    color: 'danger',
                    disabled: false
                },
                close_btn: {
                    text: 'Cancel',
                    color: 'secondary',
                    disabled: false
                }
            }
        })
    }
    const confirm_workday_deleting = async () => {
        setLoading(true)

        setStyle({
            ...style,
            delete_modal: {
                delete_btn: {
                    text: 'Deleting...',
                    color: 'info',
                    disabled: true
                },
                close_btn: {
                    text: 'Close',
                    color: 'secondary',
                    disabled: false
                }
            }
        })

        const workday_id = userWorkDays[0]['_id']
        const response = await WorkDays.delete_workday(workday_id)

        if (response['state'] && response['deleted']) {
            // Remove workday from userWorkDays
            setUserWorkDays(userWorkDays.filter(workDay => {
                return workDay['_id'] !== workday_id
            }))

            setStyle({
                ...style,
                delete_modal: {
                    delete_btn: {
                        text: 'Deleted!',
                        color: 'success',
                        disabled: true
                    },
                    close_btn: {
                        text: 'Close',
                        color: 'secondary',
                        disabled: false
                    }
                }
            })
        }

        setLoading(false)
    }

    const [newJob, setNewJob] = useState(null)
    const new_job = () => {
        setNewJob(true)
    }

    /**
     * Calculate work hours based on start & end hour
     * @param _start_hour {String} > Example: 09:00
     * @param _end_hour {String} > Example: 18:30
     */
    const calc_work_hours = (_start_hour, _end_hour) => {
        const d1 = new Date('1970-01-01T' + _end_hour + 'Z');
        const d2 = new Date('1970-01-01T' + _start_hour + 'Z');
        const diff = d1 - d2; // 887900

        const hours = Math.floor(diff/(1000*60*60)); // 2
        const mins = Math.floor((diff-(hours*1000*60*60)) / (1000*60)); // 27
        // const secs = Math.floor((diff-(hours*1000*60*60)-(mins*1000*60)) / 1000); // 59
        return `${hours}h ${mins}m`
    }


    return (
        <>
            {editWorkDay? (<Redirect to={{pathname: `/admin/workdays/edit`, state: {'workday_id': editWorkDay}}} />):null}
            {newJob? (<Redirect to={{pathname: `/admin/workdays/new`}} />):null}
            {loading? <Loading loading background="rgb(0 0 0 / 64%)" loaderColor="#3498db" style={{'z-index': '999999 !important'}} />:null}
            <Modal isOpen={deleteWorkDay['show_modal']} toggle={true} className="text-center" centered>
                <ModalHeader className="d-flex justify-center">
                    <h3 className="text-center">Delete Confirmation</h3>
                </ModalHeader>
                <ModalBody>
                    <h4>Do you really want to delete this work day ?</h4>
                </ModalBody>
                <ModalFooter>
                    <Button color={style['delete_modal']['delete_btn']['color']} onClick={() => confirm_workday_deleting()} disabled={style['delete_modal']['delete_btn']['disabled']}>{style['delete_modal']['delete_btn']['text']}</Button>
                    <Button color={style['delete_modal']['close_btn']['color']} onClick={() => setDeleteWorkDay(false)} disabled={style['delete_modal']['close_btn']['disabled']}>{style['delete_modal']['close_btn']['text']}</Button>
                </ModalFooter>
            </Modal>
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
                                                  {userWorkDays.length}
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
                                                    {userWorkDays.filter(user_job => user_job['active'] === true).length}
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
                                                    {userWorkDays.filter(user_job => user_job['active'] === false).length}
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
                    <div className="col text-right">
                        <Button className="mb-3" color="info" onClick={(e) => new_job()}>
                            <i className="fa fa-plus"/> New Work Day
                        </Button>
                    </div>
                </Row>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Your Work Days</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr className="text-center">
                                    <th scope="col">Day</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Start Hour</th>
                                    <th scope="col">End Hour</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    (!userWorkDays.length)?
                                        <tr className="text-center">
                                            <td colSpan="5">You dont have any jobs yet...</td>
                                        </tr>
                                        :null
                                }
                                {
                                    userWorkDays.map(function(workday, i){
                                        return <tr className="text-center" key={i}>
                                            {/*<th scope="row">*/}
                                            {/*    <Media className="align-items-center justify-content-center">*/}
                                            {/*        <Media>*/}
                                            {/*            <span className="mb-0 text-sm">*/}
                                            {/*                {get_date_from_str(workday['date'])}*/}
                                            {/*            </span>*/}
                                            {/*        </Media>*/}
                                            {/*    </Media>*/}
                                            {/*</th>*/}
                                            <th>{get_day_name(workday['date'])}</th>
                                            <td>{get_date_from_str(workday['date'])}</td>
                                            <td>{workday['start_hour']}</td>
                                            <td>{workday['end_hour']}</td>
                                            <td>{calc_work_hours(workday['start_hour'], workday['end_hour'])}</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}>
                                                        <i className="fas fa-ellipsis-v"/>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem onClick={(e) => edit_workday(i)}><span><i className="fa fa-edit text-primary"></i> Edit</span></DropdownItem>
                                                        <DropdownItem onClick={(e) => btn_delete_workday(i)}><span><i className="fa fa-trash text-danger"></i> Delete</span></DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default JobsList;
