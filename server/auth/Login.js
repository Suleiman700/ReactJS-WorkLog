

const validations = require('../functions/helpers/validations')
const SCHEMA_User = require("../schemas/auth/schema_login");
const bcrypt = require("bcryptjs");

class Login {
    email = ''
    password = ''
    user_data = {}

    constructor() {}

    set email(_email) {
        this.email = _email.trim()
    }

    set password(_password) {
        this.password = _password.trim()
    }

    // NOT USER ANYMORE - REPLACED WITH express-validator
    validate_login_data() {
        // const response = {
        //     state: true,
        //     msg: ''
        // }
        //
        // // Check email
        // if (!this.email.length) {
        //     response['state'] = false
        //     response['msg'] = 'Email cannot be empty'
        // }
        // else if (!validations.validate_email(this.email)) {
        //     response['state'] = false
        //     response['msg'] = 'Please enter a valid email'
        // }
        //
        // // Check password
        // if (!this.password.length) {
        //     response['state'] = false
        //     response['msg'] = 'Password cannot be empty'
        // }
        //
        // return response
    }

    async check_login() {
        const response = {
            state: true,
            msg: ''
        }
        let DB_user = await SCHEMA_User.findOne({
            email: this.email
        }).lean()


        this.user_data = {
            id: DB_user['_id'],
            full_name: DB_user['full_name']
        }

        // Check if user found
        if (!DB_user) {
            response['state'] = false
            response['msg'] = 'Wrong email or password'
            return response
        }

        const passwordMatch = await bcrypt.compare(this.password, DB_user.password);
        if (!passwordMatch) {
            response['state'] = false
            response['msg'] = 'Wrong email or password'
            return response
        }

        return response


    }


}

module.exports = new Login()
