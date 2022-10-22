const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
const app = express()
const port = 3002
app.use(cors());
app.use(express.json());

const auth = require("./auth/auth");
const bcrypt = require("bcryptjs");
const { check, validationResult} = require("express-validator/check");
const InitiateMongoServer = require("./config/db");
const Login = require('./auth/Login')
const Jobs = require('./jobs/Jobs')
const WorkDays = require('./workdays/WorkDays')

// Initiate Mongo Server
InitiateMongoServer();

const sessions = []

app.get("/auth-endpoint", auth, (request, response) => {
    response.json({
        isLogged: true,
        message: "You are authorized to access me"
    });
});

// Get user jobs
app.get("/jobs/api/get_jobs", auth, async (request, response) => {
    const user_jobs = await Jobs.get_user_jobs(request.user.id)
    response.json({
        state: true,
        user_jobs: user_jobs,
        message: "You are authorized to access me"
    });
});

// If user can edit job
app.get("/jobs/api/can_edit", auth, async (request, response) => {
    const job_id = request.headers.id
    const job_info = await Jobs.get_job_info(request.user.id, job_id)
    response.json({
        state: (job_info!==null)? true:false,
        'job_info': job_info,
    });
});

app.post("/jobs/api/save_edited_job", [
        check('job.name', 'Name cannot be empty').isLength({ min: 1}),
        check('job.address', 'Address cannot be empty').isLength({ min: 0}),
        check('job.start_date', 'Start date is not valid').isDate(),
        check('job.active', 'Active state is not valid').isBoolean(),
        check('job.hourly', 'Hourly payment cannot be empty').isDecimal(),
        check('job.break_time', 'Break time is not valid').isDecimal(),
        check('job.exclude_break_time', 'Exclude break time is not valid').isBoolean(),
        check('job.description', 'Description is not valid').isLength({ min: 0}),
    ],
    auth, async (req, res) => {
    const job_data = req.body.job

    // const job_info = await Jobs.get_job_info(request.user.id, job_id)

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    else {
        const result = await Jobs.save_edited_job(req.user.id, job_data)
        console.log(result['state'])
        res.json({
            // state: true,
            state: result['state'],
            row_updated: result['row_updated'],
        });
    }
});

app.post("/jobs/api/save_new_job", [
        check('job.name', 'Name cannot be empty').isLength({ min: 1}),
        check('job.address', 'Address cannot be empty').isLength({ min: 0}),
        check('job.start_date', 'Start date is not valid').isDate(),
        check('job.active', 'Active state is not valid').isBoolean(),
        check('job.hourly', 'Hourly payment cannot be empty').isDecimal(),
        check('job.break_time', 'Break time is not valid').isDecimal(),
        check('job.exclude_break_time', 'Exclude break time is not valid').isBoolean(),
        check('job.description', 'Description is not valid').isLength({ min: 0}),
    ],
    auth, async (req, res) => {
        const job_data = req.body.job

        // const job_info = await Jobs.get_job_info(request.user.id, job_id)

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        else {
            const result = await Jobs.save_new_job(req.user.id, job_data)
            res.json({
                // state: true,
                state: result['state'],
                row_updated: result['row_updated'],
            });
        }
    });

app.post('/auth/api/login', [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password cannot be blank').notEmpty(),
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    else {
        const {email, password} = req.body;

        Login.email = email
        Login.password = password
        const response = await Login.check_login()

        // If valid login
        if (response['state']) {
            // create JWT token
            const token = jwt.sign(
                {
                    id: Login.user_data['id'],
                    email: email,
                },
                "RANDOM-TOKEN",
                { expiresIn: "5h" }
            );


            return res.status(200).json({
                state: true,
                id: Login.user_data['id'],
                full_name: Login.user_data['full_name'],
                email,
                token
            })
        }
        else {
            return res.status(400).json({
                msg: response['msg']
            });
        }
    }

    // res.send('Hello World!')
}
)




// Get user workdays
app.get("/workdays/api/get_workdays", auth, async (request, response) => {
    const user_workdays = await WorkDays.get_user_work_days(request.user.id)
    response.json({
        state: true,
        user_workdays: user_workdays,
    });
});

// If user can edit workday
app.get("/workdays/api/can_edit", auth, async (request, response) => {
    const workday_id = request.headers.id
    const workday_info = await WorkDays.get_workday_info(request.user.id, workday_id)
    response.json({
        state: (workday_info!==null)? true:false,
        'workday_info': workday_info,
    });
});

app.post("/workdays/api/save_edited_workday", [
        check('workday.date', 'Date is not valid').isDate(),
        check('workday.job_id', 'Job cannot be empty').isLength({ min: 1}),
        check('workday.start_hour', 'Start hour is invalid').matches(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')),
        check('workday.end_hour', 'End hour is invalid').matches(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')),
        check('workday.remote_workday', 'Remote work day is invalid').isBoolean(),
        check('workday.note', 'Note is invalid').isLength({ min: 0}),
    ],
    auth, async (req, res) => {

        const workday_data = req.body.workday

        // const job_info = await Jobs.get_job_info(request.user.id, job_id)

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        else {
            // Check if job exists and belongs to user
            const valid_job = await Jobs.found_and_belongs_to_user(workday_data['job_id'], req.user.id)
            if (valid_job['state']) {
                const result = await WorkDays.save_edited_workday(req.user.id, workday_data)
                res.json({
                    // state: true,
                    state: result['state'],
                    row_updated: result['row_updated'],
                });
            }
            // Job not found or does not belong to user
            else {
                res.json({
                    ...valid_job
                });
            }


        }
    });

app.post("/workdays/api/save_new_workday", [
        check('workday.date', 'Invalid date').isDate(),
        check('workday.job_id', 'Please select a job').isLength({ min: 1}),
        check('workday.start_hour', 'Start hour is invalid').matches(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')),
        check('workday.end_hour', 'End hour is invalid').matches(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')),
        check('workday.remote_workday', 'Remote work day is invalid').isBoolean(),
        check('workday.note', 'Note is invalid').isLength({ min: 0}),
    ],
    auth, async (req, res) => {

        const workday_data = req.body.workday

        // const job_info = await Jobs.get_job_info(request.user.id, job_id)

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        else {
            // Check if job exists and belongs to user
            const valid_job = await Jobs.found_and_belongs_to_user(workday_data['job_id'], req.user.id)
            if (valid_job['state']) {
                const result = await WorkDays.save_new_workday(req.user.id, workday_data)
                res.json({
                    ...result
                });
            }
            // Job not found or does not belong to user
            else {
                res.json({
                    ...valid_job
                });
            }


        }
    });

// If user can edit workday
app.post("/workdays/api/delete_workday", auth, async (req, res) => {
    const response = {
        state: false,
        valid_workday: false,
        deleted: false
    }

    const workday_id = req.body.workday_id

    // Check if workday exists
    const workday_info = await WorkDays.does_exists(req.user.id, workday_id)

    if (workday_info['exists']) {
        // Check if workday belongs to user
        if (workday_info['owner_user_id'] === req.user.id) {
            response['valid_workday'] = true

            // Delete workday
            const deleted = await WorkDays.delete_workday(workday_id)
            if (deleted['state']) {
                response['state'] = true
                response['deleted'] = true
            }
        }
    }

    res.json({
        ...response
    });
});

app.post('/auth/api/signup', [
    check('name', 'Please enter a valid name').notEmpty().isLength({ min: 2}),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password cannot be blank').notEmpty(),
    check('tos', 'You need to agree to this TOS').equals('true'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    else {
        console.log('good')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
