import { encode, decode } from './encryption';
import axios from "axios";
import async from "async";
// import { useHistory } from 'react-router-dom';
// const history = useHistory();

export const check_logged_session = async () => {
    let isLogged = false

    // Get session data
    const session_data = sessionStorage.getItem('WORKLOG_data')
    const session_token = sessionStorage.getItem('WORKLOG_token')
    if (session_data && session_token) {

        const data = decode(session_data)
        const token = decode(session_token)
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth-endpoint`, {
            headers: {
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                if (response.data.isLogged) {
                    isLogged = true
                }
            })
            .catch(function (error) {
                isLogged = false
            });
    }

    if (!isLogged) {
        sessionStorage.removeItem('WORKLOG_data')
        sessionStorage.removeItem('WORKLOG_token')
        // window.location.href = "/auth/login";
    }

    return isLogged
};

export const redirect_logged_to_dashboard = async () => {
    let isLogged = false

    // Get session data
    const session_data = sessionStorage.getItem('WORKLOG_data')
    const session_token = sessionStorage.getItem('WORKLOG_token')
    if (session_data && session_token) {

        const data = decode(session_data)
        const token = decode(session_token)
        await axios.get(`${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/auth-endpoint`, {
            headers: {
                'Authorization': `Basic ${token} ${data}`
            }
        })
            .then(function (response) {
                if (response.data.isLogged) {
                    isLogged = true
                }
            })
            .catch(function (error) {
                isLogged = false
            });
    }

    // if (isLogged) {
    //     window.location.href = "/admin/index";
    // }
    return isLogged
}
