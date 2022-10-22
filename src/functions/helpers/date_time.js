/**
 * Get day name based on date string
 * @param _date_str {String} > Example: 2022-10-16T00:00:00.000Z
 */
export const get_day_name = (_date_str) => {
    const getWeekday = (s) => {
        const [yyyy, mm, dd] = s.split('-'),
            date = new Date(yyyy, mm-1, dd)
        return date.toLocaleDateString('en-US', {weekday: 'long'})
    }

    return getWeekday(_date_str.split('T')[0])
};

/**
 * Get date from date string
 * @param _date_str {String} > Example: 2022-10-16T00:00:00.000Z
 * @param flip {Boolean}
 */
export const get_date_from_str = (_date_str, flip=true) => {
    const date = _date_str.split('T')[0]
    return date.split('-').reverse().join('-');
}
