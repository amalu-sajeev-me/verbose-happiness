export class DateUtils {
    static get dateString() {
        const today = new Date();
        const dateFormatter = new Intl.DateTimeFormat('en-Us', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
        return dateFormatter
            .format(today)
            .replaceAll(',', '')
            .replaceAll(' ', '-')
    }
}