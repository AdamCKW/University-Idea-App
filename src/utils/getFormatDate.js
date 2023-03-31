export function getFormatDate(createdAt) {
    const date = new Date(createdAt);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}
