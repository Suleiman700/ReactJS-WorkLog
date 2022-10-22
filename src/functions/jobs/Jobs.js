import axios from 'axios';
import {get_session_storage} from "../helpers/sessionStorage";
import {decode} from "../helpers/encryption";

class Jobs {
    constructor() {}

    async get_user_jobs(_user_id) {
        const res = {
            state: true,
            user_jobs: []
        }

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/jobs/api/get_jobs`, {
            headers: {
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                res['user_jobs'] = response.data.user_jobs
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
     * Check if user is allowed to edit job
     * @param _job_id {String}
     */
    async if_can_edit(_job_id) {
        const res = {
            state: false,
            user_jobs: []
        }

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/jobs/api/can_edit`, {
            headers: {
                id: _job_id,
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                res['state'] = response.data.state
                res['job_info'] = response.data.job_info
                // return response.data.user_jobs
                // console.log(response);
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                console.log(error);
            });

        return res
    }

    async save_edited_job(_job) {
        const res = {
            state: false,
        }

        _job['start_date'] = _job['start_date'].split('/').reverse().join('/')

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/jobs/api/save_edited_job`,
            {
                job: _job
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            }
        )
            .then(function (response) {
                res['state'] = response.data.state
                res['row_updated'] = response.data.row_updated
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                res['errors'] = errors
            });

        return res
    }

    async save_new_job(_job) {
        const res = {
            state: false,
        }

        _job['start_date'] = _job['start_date'].split('/').reverse().join('/')

        const token = decode(get_session_storage('token'))
        const data = decode(get_session_storage('data'))
        await axios.post(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/jobs/api/save_new_job`,
            {
                job: _job
            },
            {
                headers: {
                    'Authorization': `Basic ${token}`
                }
            }
        )
            .then(function (response) {
                res['state'] = response.data.state
                res['row_updated'] = response.data.row_updated
            })
            .catch(function (error) {
                const errors = error.response.data.errors
                res['errors'] = errors
            });

        return res
    }

    /**
     * Get job name based on its id
     * @param _jobs {Object}
     * @param _job_id
     */
    get_job_name(_jobs, _job_id) {
        if (_job_id === undefined || !_job_id) return
        else if (_jobs === undefined || !_jobs) return
        else if (!_jobs.length) return
        const job_info = _jobs.find(job => {
            return job['_id'] === _job_id
        })

        if (job_info === undefined) return
        return job_info['name']
    }
}

export default new Jobs()
