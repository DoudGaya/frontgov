import CryptoJS from "crypto-js";
export const serverStatus = "Live"
export const serverLink = serverStatus === 'Dev' ? 'http://localhost:2200/' : 'https://1gov.server.api.jg.gov.ng/'
export const projectTitle = 'Jigawa Finance'
export const projectCode = "JigawaFinanceCode"
export const jigawaOneAPIKey= "jg_test_2c5afa2a9bac8a8db2d7955402ae688b4e2871a0552606d618f8d56f9ac4a124" //"jg_test_2b6f2b5272ac1d4699bab75f90520a044e24ec6c86157e2f0eacfd3e14e35425";
export const jigawaOneAPIPassport = "https://api.jg.gov.ng/api/v2/public/upload/passport/";
export const jigawaOneAPILink = "http://localhost:4481/api/v2/" //"https://api.jg.gov.ng/api/v2/";
export function encryptData(string, val = false) {
    try {
        let secret_key =
            val === false
                ? "JigawaFinanceCode" + "_ENCRYPT"
                : projectCode
        let secret_iv =
            val === false
                ? "JigawaFinanceCode" + "_ENCRYPT_IV"
                : projectCode
        // hash
        let kee = CryptoJS.SHA256(secret_key)
        let ivv = CryptoJS.SHA256(secret_iv).toString().substr(0, 16)

        kee = CryptoJS.enc.Utf8.parse(kee.toString().substr(0, 32))
        ivv = CryptoJS.enc.Utf8.parse(ivv)

        let decrypted = CryptoJS.AES.encrypt(string, kee, { iv: ivv })

        let result = decrypted.toString()
        return btoa(result);
    } catch (e) {
        console.log(e)
    }
}
export function decryptData(string, val = false) {
    try {
        const secret_key =
            val === false
                ? "JigawaFinanceCode" + "_ENCRYPT"
                : projectCode
        const secret_iv =
            val === false
                ? "JigawaFinanceCode" + "_ENCRYPT_IV"
                : projectCode
        // hash
        let kee = CryptoJS.SHA256(secret_key)
        let ivv = CryptoJS.SHA256(secret_iv).toString().substr(0, 16)

        kee = CryptoJS.enc.Utf8.parse(kee.toString().substr(0, 32))
        ivv = CryptoJS.enc.Utf8.parse(ivv)

        const decrypted = CryptoJS.AES.decrypt(atob(string), kee, { iv: ivv })

        return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (e) {
        console.log(e)
    }
}
export const formatDateAndTime = (date, option) => {
    if (date !== null) {
        const user_date = new Date(date);
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const monthNamesShort = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        const day =
            user_date.getDate() < 10
                ? "0" + user_date.getDate()
                : user_date.getDate();
        const hour =
            user_date.getHours() < 10
                ? "0" + user_date.getHours()
                : user_date.getHours();
        const min =
            user_date.getMinutes() < 10
                ? "0" + user_date.getMinutes()
                : user_date.getMinutes();
        const sec =
            user_date.getSeconds() < 10
                ? "0" + user_date.getSeconds()
                : user_date.getSeconds();

        let date_string = "";
        if (option === "date_and_time")
            date_string = `${day}-${monthNames[user_date.getMonth()]
            }-${user_date.getFullYear()} : ${hour}:${min}:${sec}`;
        else if (option === "short_date")
            date_string = `${day}-${monthNamesShort[user_date.getMonth()]
            }-${user_date.getFullYear() % 100}`;
        else if (option === "date")
            date_string = `${day}-${monthNames[user_date.getMonth()]
            }-${user_date.getFullYear()}`;
        else if (option === "day") date_string = day;
        else if (option === "full_month")
            date_string = monthNames[user_date.getMonth()];
        else if (option === "short_month")
            date_string = monthNamesShort[user_date.getMonth()];
        else if (option === "year_only") date_string = user_date.getFullYear();
        else if (option === "month_and_year")
            date_string = `${monthNamesShort[user_date.getMonth()]} - ${user_date.getFullYear()}`;
        else if (option === "full_month_and_year")
            date_string = `${monthNames[user_date.getMonth()]} - ${user_date.getFullYear()}`;

        return date_string;
    } else {
        return "--";
    }
};

export const formatDate = (date) => {
    let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
};

export const currencyConverter = (amount) => {
    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    });
    return formatter.format(amount)
}

export const numberFormat = (number) => {
    const formatter = new Intl.NumberFormat('en-NG');
    return formatter.format(number)
}

export const randomToken = () => {
    return Math.random().toString(36).substr(2); // remove `0.`
};

export const generate_token = (length) => {
    //edit the token allowed characters
    let a = "1234567890".split("");
    let b = [];
    for (let i = 0; i < length; i++) {
        let j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
};

export const sumObjectArray = (array, amount) =>
{
    return array.map(item => item[amount]).reduce((prev, next) => prev + next)
}

export const moneyFormat = (amount) => {
    // Check if the provided amount is a number
    if (typeof amount !== "number") {
        return "Invalid input";
    }

    // Format the number with two decimal places and commas as thousand separators
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};