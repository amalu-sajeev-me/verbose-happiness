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
    static formattedDate = (date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-Us', {
            day: '2-digit',
            month: 'long',
            year: '2-digit'
        });
        return formatter.format(date);
    }

    static formatTime = (date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-Us', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return formatter.format(date);
    }
}