export const dateCheck = dateString => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    console.log((dateString.match(dateRegex)).length > 0);
}