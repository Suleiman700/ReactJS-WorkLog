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
    UncontrolledTooltip, Col, CardBody, CardTitle, Button, Modal, Input, FormGroup
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import {useEffect, useState} from "react";
import Loading from 'react-fullscreen-loading';
import Jobs from '../../functions/jobs/Jobs'
import {Redirect, Route} from "react-router-dom";


function closeModal() {

}

const JobsList = () => {

    const [loading, setLoading] = useState(true)
    const [userJobs, setUserJobs] = useState([])
    const get_user_jobs = async () => {
        const user_jobs = await Jobs.get_user_jobs()
        if (user_jobs['state']) {
            setUserJobs(user_jobs['user_jobs'])
        }
        setLoading(false)
    }

    useEffect(() => {
        // Get user jobs
        get_user_jobs()
    }, []);

    const [editJob, setEditJob] = useState(null)
    const edit_job = (i) => {
        const job_id = userJobs[i]['_id']
        setEditJob(job_id)
    }

    const [newJob, setNewJob] = useState(null)
    const new_job = () => {
        console.log('clicked')
        setNewJob(true)
    }

    return (
        <>
            {editJob? (<Redirect to={{pathname: `/admin/jobs/edit`, state: {'job_id': editJob}}} />):null}
            {newJob? (<Redirect to={{pathname: `/admin/jobs/new`}} />):null}
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
            {/*<Header/>*/}
            {/* Page content */}
            {/*<Modal isOpen={editJob} className="text-center">*/}
            {/*    <div className="pt-3">*/}
            {/*        <h2>Edit Job</h2>*/}
            {/*    </div>*/}
            {/*    <button onClick={closeModal}>close</button>*/}
            {/*    <div className="mx-4">*/}
            {/*        <Row>*/}
            {/*            <Col s="12">*/}
            {/*                <FormGroup>*/}
            {/*                    <label className="form-control-label" htmlFor="input-username">Job Name</label>*/}
            {/*                    <Input className="form-control-alternative" defaultValue="Test" id="input-username" placeholder="Username" type="text"/>*/}
            {/*                </FormGroup>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </div>*/}

            {/*    <div>I am a modal</div>*/}
            {/*    <form>*/}
            {/*        <input />*/}
            {/*        <button>tab navigation</button>*/}
            {/*        <button>stays</button>*/}
            {/*        <button>inside</button>*/}
            {/*        <button>the modal</button>*/}
            {/*    </form>*/}
            {/*</Modal>*/}
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col text-right">
                        <Button className="mb-3" color="info" onClick={(e) => new_job()}>
                            <i className="fa fa-plus"/> New Job
                        </Button>
                    </div>
                </Row>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Your Jobs</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr className="text-center">
                                    <th scope="col">Job Name</th>
                                    <th scope="col">Hourly</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Work Days This Month</th>
                                    <th scope="col">Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    (!userJobs.length)?
                                        <tr className="text-center">
                                            <td colSpan="5">You dont have any jobs yet...</td>
                                        </tr>
                                        :null
                                }
                                {
                                    userJobs.map(function(job, i){
                                        return <tr className="text-center" key={i}>
                                            <th scope="row">
                                                <Media className="align-items-center justify-content-center">
                                                    <Media>
                                                        <span className="mb-0 text-sm">
                                                            {job['name']}
                                                        </span>
                                                    </Media>
                                                </Media>
                                            </th>
                                            <td>{job['hourly']}</td>
                                            <td>
                                                <Badge color="" className="badge-dot mr-4">
                                                    <i className={job['active']? 'bg-success':'bg-danger'} />
                                                    {job['active']? 'Active':'InActive'}
                                                </Badge>
                                            </td>
                                            <td>500</td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}>
                                                        <i className="fas fa-ellipsis-v"/>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem onClick={(e) => edit_job(i)}>
                                                            Edit job
                                                        </DropdownItem>
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
