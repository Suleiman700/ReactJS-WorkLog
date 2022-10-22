export const set_session_storage = (_key, _data) => {
    switch (_key) {
        case 'data':
            return sessionStorage.setItem('WORKLOG_data', _data)
        case 'token':
            return sessionStorage.setItem('WORKLOG_token', _data)
    }
};

export const get_session_storage = (_key) => {
    switch (_key) {
        case 'data':
            return sessionStorage.getItem('WORKLOG_data')
        case 'token':
            return sessionStorage.getItem('WORKLOG_token')
    }
};

export const clear_session_storage = (_key) => {
    switch (_key) {
        case 'data':
            return sessionStorage.removeItem('WORKLOG_data')
        case 'token':
            return sessionStorage.removeItem('WORKLOG_token')
    }
};
