export const encode = (_string) => {
    try {
        return window.btoa(_string);
    }
    catch (e) {
        return false
    }
};

export const decode = (_string, _jsonParse=false) => {
    try {
        if (_jsonParse) return JSON.parse(window.atob(_string))
        else return window.atob(_string)
    }
    catch (e) {
        return false
    }
};
