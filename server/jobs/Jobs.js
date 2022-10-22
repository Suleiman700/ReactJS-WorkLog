
const SCHEMA_Jobs = require("../schemas/jobs/schema_jobs.js");
const {ObjectId} = require("mongodb");

class Jobs {
    constructor() {}

    async get_user_jobs(_user_id) {
        const response = {
            state: true,
            msg: ''
        }
        const DB_user_jobs = await SCHEMA_Jobs.find({
            user_id: _user_id
        }).lean()

        return DB_user_jobs
    }

    /**
     * Get user job info
     * @param _user_id {String}
     * @param _job_id {String}
     */
    async get_job_info(_user_id, _job_id) {
        const response = {
            state: true,
            msg: ''
        }
        return SCHEMA_Jobs.findOne({
            _id: _job_id,
            user_id: _user_id,
        }).lean();
    }

    /**
     * Save edited job
     * @param _user_id {String}
     * @param _job {Object}
     */
    async save_edited_job(_user_id, _job) {
        const response = {
            state: true,
            row_updated: true
        }

        await SCHEMA_Jobs.updateOne(
            {
                "_id": ObjectId(_job['id'])
            },
            {
                $set:
                    {
                        name: _job['name'],
                        address: _job['address'],
                        start_date: _job['start_date'],
                        active: _job['active'],
                        hourly: parseFloat(_job['hourly']),
                        break_time: parseFloat(_job['break_time']),
                        exclude_break_time: _job['exclude_break_time'],
                        description: _job['description'],
                    }
            }, function(err, res) {
                // if (err) {
                //     response['state'] = false
                //     // throw err;
                // }
                // console.log("1 document updated");
                // db.close();
            }
        ).clone()
            .then(res => {
                response['state'] = true
                if (!res.matchedCount) {
                    response['row_updated'] = false
                }
            })
            .catch(err => {
                if (err) {
                    response['state'] = false
                    response['row_updated'] = false
                    // throw err;
                }
            })

        return response
    }

    /**
     * Save new job
     * @param _user_id {String}
     * @param _job {Object}
     */
    async save_new_job(_user_id, _job) {
        const response = {
            state: true,
        }

        await SCHEMA_Jobs.bulkWrite(
            [
                {
                    insertOne: {
                        document: {
                            user_id: _user_id,
                            name: _job['name'],
                            address: _job['address'],
                            start_date: _job['start_date'],
                            active: _job['active'],
                            hourly: parseFloat(_job['hourly']),
                            break_time: parseFloat(_job['break_time']),
                            exclude_break_time: _job['exclude_break_time'],
                            description: _job['description'],
                        }
                    }
                }
            ]
        ).then(() => {
            // console.log('here')
        })
            .catch(err => {
                console.log(err)
                response['state'] = false
            })

        return response
    }

    /**
     * Check if job exists
     * @param _job_id {String}
     * @param _user_id {String}
     */
    async found_and_belongs_to_user(_job_id, _user_id) {
        const response = {
            state: true,
            msg: '',
            valid_job: true
        }
        try {
            const data = await SCHEMA_Jobs.findOne({
                _id: _job_id,
                user_id: _user_id,
            }).lean();

            if (data === null || data === undefined) {
                response['state'] = false
            }
        }
        catch (e) {
            response['state'] = false
            response['valid_job'] = false
        }

        return response
    }
}

module.exports = new Jobs()
