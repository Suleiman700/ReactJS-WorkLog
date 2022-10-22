
const SCHEMA_WorkDays = require("../schemas/workdays/schema_workdays");
const {ObjectId} = require("mongodb");

class WorkDays {
    constructor() {}

    async get_user_work_days(_user_id) {
        const response = {
            state: true,
            msg: ''
        }
        const DB_user_workdays = await SCHEMA_WorkDays.find({
            user_id: _user_id
        }).lean()

        return DB_user_workdays
    }

    /**
     * Get user workday info
     * @param _user_id {String}
     * @param _workday_id {String}
     */
    async get_workday_info(_user_id, _workday_id) {
        const response = {
            state: true,
            msg: ''
        }
        return SCHEMA_WorkDays.findOne({
            _id: _workday_id,
            user_id: _user_id,
        }).lean();
    }

    /**
     * Save edited workday
     * @param _user_id {String}
     * @param _workday {Object}
     */
    async save_edited_workday(_user_id, _workday) {
        const response = {
            state: true,
            row_updated: true
        }


        await SCHEMA_WorkDays.updateOne(
            {
                "_id": ObjectId(_workday['id'])
            },
            {
                $set:
                    {
                        date: _workday['date'],
                        job_id: _workday['job_id'],
                        start_hour: _workday['start_hour'],
                        end_hour: _workday['end_hour'],
                        remote_workday: _workday['remote_workday'],
                        note: _workday['note'],
                        updated_at: new Date().toISOString()
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
     * Save new workday
     * @param _user_id {String}
     * @param _workday {Object}
     */
    async save_new_workday(_user_id, _workday) {
        const response = {
            state: true,
        }

        await SCHEMA_WorkDays.bulkWrite(
            [
                {
                    insertOne: {
                        document: {
                            user_id: _user_id,
                            job_id: _workday['job_id'],
                            date: _workday['date'],
                            start_hour: _workday['start_hour'],
                            end_hour: _workday['end_hour'],
                            remote_workday: _workday['remote_workday'],
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            note: _workday['note'],
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
     * Check if workday exists
     * @param _user_id {String}
     * @param _workday_id {String}
     */
    async does_exists(_user_id, _workday_id) {
        const response = {
            exists: true,
            owner_user_id: undefined
        }

        const data = await SCHEMA_WorkDays.findOne({
            _id: _workday_id,
        }).lean();

        if (data === null || data === undefined || !data) {
            response['exists'] = false
        }
        else {
            response['owner_user_id'] = data['user_id']
        }

        return response
    }

    /**
     * Delete workday
     * @param _workday_id {String}
     */
    async delete_workday(_workday_id) {
        const response = {
            state: false
        }

        const data = await SCHEMA_WorkDays.deleteOne({
            _id: _workday_id,
        }).lean();

        if (data['deletedCount'] === 1) {
            response['state'] = true
        }

        return response
    }
}

module.exports = new WorkDays()
