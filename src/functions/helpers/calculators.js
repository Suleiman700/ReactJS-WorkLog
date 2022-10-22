/**
 * Calculate work hours based on start and end hour
 * @param _start_hour {String} > Example: 09:00
 * @param _end_hour {String} > Example: 18:30
 */
export const calc_work_hours = (_start_hour, _end_hour) => {
    const d1 = new Date('1970-01-01T' + _end_hour + 'Z');
    const d2 = new Date('1970-01-01T' + _start_hour + 'Z');
    const diff = d1 - d2; // 887900

    const hours = Math.floor(diff/(1000*60*60)); // 2
    const mins = Math.floor((diff-(hours*1000*60*60)) / (1000*60)); // 27
    const secs = Math.floor((diff-(hours*1000*60*60)-(mins*1000*60)) / 1000); // 59

    return {
        hours,
        mins,
        secs
    }
};
