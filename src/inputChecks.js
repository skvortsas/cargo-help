export const dateCheck = dateString => {
    const dateRegex = /^\d{2}\.\d{2}\.(\d{4}|\d{2})$/;

    return dateString.match(dateRegex) ? true : false;
}