
export const timePeriod = (period, from, to) => {
    let fromDate = new Date();
    let toDate = new Date();

    switch (period) {
        case "Today":
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "Yesterday":
            fromDate.setDate(fromDate.getDate() - 1);
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate = new Date(fromDate);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "This Week":
            fromDate.setDate(fromDate.getDate() - fromDate.getDay());
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "Last Seven Days":
            fromDate.setDate(fromDate.getDate() - 6);
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "Previous Week":
            fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + 6);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "This Month":
            fromDate.setDate(1);
            fromDate.setHours(0, 0, 0, 0);
            fromDate = new Date(fromDate.getTime() + 5.5 * 60 * 60 * 1000);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "Previous Month":
            fromDate.setMonth(fromDate.getMonth() - 1);
            fromDate.setDate(1);
            fromDate.setHours(0, 0, 0, 0);
            toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
            toDate.setHours(23, 59, 59, 999);
            toDate = new Date(toDate.getTime() + 5.5 * 60 * 60 * 1000);
            break;
        case "Custom":
            if (!from || !to) {
                throw new Error("From date and to date are required for custom period");
            }
            fromDate = new Date(from);
            toDate = new Date(to);
            break;
        default:
           throw new Error("Invalid period selection");
    }

    return { fromDate, toDate };
}

