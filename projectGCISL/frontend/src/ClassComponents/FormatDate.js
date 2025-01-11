export function FormatDate(value) {
    if (!value) {
        return '';
    }

    let date = new Date(value);
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
}