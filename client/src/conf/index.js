export const checkRole = (role) => {
    var nameRole;
    if (role == 3) {
        nameRole = "admin"
    } else if (role == 2) {
        nameRole = 'boss'
    } else if (role == 1) {
        nameRole = 'buyer'
    } else if (role == 4) {
        nameRole = 'admin shop'
    }
    return nameRole;
}

export const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date);
    var formatDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
    return formatDate;
}

export const convertUTCDateToLocalDate1 = (date) => {
    var newDate = new Date(date);
    var formatDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
    return formatDate;
}