document.getElementById("year").defaultValue = new Date().getFullYear();
document.getElementById("month").defaultValue = new Date().getMonth() + 1;

function getNinthLastBankDay() {
    let year = document.getElementById("year").value
    let month = document.getElementById("month").value
    let eligibleDay = new Date()
    eligibleDay.setFullYear(year, month, 1)
    eligibleDay.setDate(eligibleDay.getDate() - 1)
    let bankDays = 0
    let bankHolidays = getBankHolidays(year)

    while (true) {
        if(eligibleDay.getDay() !== 0 && eligibleDay.getDay() !== 6 && !isBankHoliday(eligibleDay, bankHolidays)) {
            bankDays += 1
        }
        if(bankDays === 9) break
        eligibleDay.setDate(eligibleDay.getDate() - 1)
    }

    document.getElementById("output").innerHTML = formatDate(eligibleDay);
}

function isBankHoliday(eligibleDay, bankHolidays) {
    for(let bankHoliday of bankHolidays) {
        if (formatDate(bankHoliday) === formatDate(eligibleDay)) return true
    }
    return false
}

function formatDate(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0")
}

function getGregorianEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const j = c % 4;
    const k = (32 + 2 * e + 2 * i - h - j) % 7;
    const l = Math.floor((a + 11 * h + 22 * k) / 451);
    const x = h + k - 7 * l + 114;
    const month = Math.floor(x / 31);
    const day = (x % 31) + 1;

    return new Date(year, month - 1, day);
}

function getBankHolidays(year) {
    const easterSunday = getGregorianEasterSunday(year);

    return new Set([
        new Date(year, 0, 1), // New Year's Day (January 1)
        new Date(year, 5, 5), // Constitution Day (June 5)
        new Date(year, 11, 24), // Christmas Eve (December 24)
        new Date(year, 11, 25), // Christmas Day (December 25)
        new Date(year, 11, 26), // Boxing Day (December 26)
        new Date(year, 11, 31), // New Year's Eve (December 31)
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() - 2), // Good Friday
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() - 3), // Maundy Thursday
        easterSunday, // Easter Sunday
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 1), // Easter Monday
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 26), // Great Prayer Day, 4th Friday after Easter
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 39), // Ascension Day
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 40), // Day after Ascension Day
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 49), // Pentecost
        new Date(easterSunday.getFullYear(), easterSunday.getMonth(), easterSunday.getDate() + 50)  // Whit Monday
    ]);
}
