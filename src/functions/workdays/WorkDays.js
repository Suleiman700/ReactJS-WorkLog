import {decode} from "../helpers/encryption";
import {get_session_storage} from "../helpers/sessionStorage";
import axios from "axios";

class WorkDays {
    constructor() {}

    async get_user_work_days(_user_id) {
        const res = {
            state: true,
            user_workdays: []
        }

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/workdays/api/get_workdays`, {
            headers: {
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                res['user_workdays'] = response.data.user_workdays
                // return response.data.user_jobs
                // console.log(response);
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                console.log(error);
                res['state'] = false
            });

        return res
    }

    /**
     * Check if user is allowed to edit workday
     * @param _workday_id {String}
     */
    async if_can_edit(_workday_id) {
        const res = {
            state: false,
            user_jobs: []
        }

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/workdays/api/can_edit`, {
            headers: {
                id: _workday_id,
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                res['state'] = response.data.state
                res['workday_info'] = response.data.workday_info
                // return response.data.user_jobs
                // console.log(response);
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                console.log(error);
            });

        return res
    }

    /**
     * Save edited workday
     * @param inputField {Object}
     */
    async save_edited_workday(inputField) {
        const res = {
            state: false,
        }

        // _job['start_date'] = _job['start_date'].split('/').reverse().join('/')
        inputField['date'] = inputField['date'].split('T')[0]
        // inputField['job_id'] = 'hi'

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/workdays/api/save_edited_workday`,
            {
                workday: inputField
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            }
        )
            .then(function (response) {
                res['state'] = response.data.state
                res['valid_job'] = response.data.valid_job
                res['row_updated'] = response.data.row_updated
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                res['errors'] = errors
            });

        return res
    }

    /**
     * Save new workday
     * @param inputField {Object}
     */
    async save_new_workday(inputField) {
        const res = {
            state: false,
        }

        inputField['date'] = inputField['date'].split('T')[0]

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/workdays/api/save_new_workday`,
            {
                workday: inputField
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            }
        )
            .then(function (response) {
                res['state'] = response.data.state
                res['valid_job'] = response.data.valid_job
                res['row_inserted'] = response.data.row_inserted
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                res['errors'] = errors
            });

        return res
    }

    /**
     * Delete workday
     * @param _workday_id {String}
     */
    async delete_workday(_workday_id) {
        console.log(_workday_id)
        const res = {
            state: false,
        }


        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/workdays/api/delete_workday`,
            {
                workday_id: _workday_id
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            }
        )
            .then(function (response) {
                res['state'] = response.data.state
                res['valid_workday'] = response.data.valid_workday
                res['deleted'] = response.data.deleted
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                res['errors'] = errors
            });

        return res
    }
}

export default new WorkDays()
