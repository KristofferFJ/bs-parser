let parsedBs
let currentSection

function parseBS() {
    parsedBs = {
        start: "",
        sections: [],
        end: ""
    }
    document.getElementById("bsInput").value.split("\n").map((line) => parseLine(line))
    document.getElementById("output").innerHTML = JSON.stringify(parsedBs, null, 2);
}

function parseLine(line) {
    let parsed = "unable to parse"
    const code = line.substring(2, 5)
    if (code === "002") {
        parse002Start(line)
    } else if (code === "012") {
        parse012(line)
    } else if (code === "022") {
        const dataRecordNumber = line.substring(21, 22)
        if (dataRecordNumber < 6) {
            parse022_0240_debtorName(line)
        } else {
            parse022_0240_postalCodeCountry(line)
        }
    } else if (code === "042") {
        const transactionCode = line.substring(13, 17)
        if(transactionCode === "0285") {
            parse022_0285(line)
        } else {
            parse022_0280(line)
        }
    } else if (code === "052") {
        parse022_0241(line)
    } else if (code === "092") {
        parse022_0117(line)
    } else if (code === "992") {
        parse002End(line)
    }
    return line + "\n\t" + parsed
}

function parse002Start(line) {
    parsedBs.start = {
        cvr: line.substring(5, 13),
        subsystem: line.substring(13, 16),
        deliveryType: line.substring(16, 20),
        deliveryIdentification: line.substring(20, 30),
        date: line.substring(49, 55),
    }
}

function parse012(line) {
    currentSection = {
        start: {
            creditorPbs: line.substring(5, 13),
            debtorGroupNumber: line.substring(22, 27),
            dataSupplierIdentification: line.substring(27, 42),
            date: line.substring(46, 54),
            mainTextLine: line.substring(68, 128),
        },
        collections: [],
        end: ""
    }
    parsedBs.sections.push(currentSection)
}

function parse022_0240_debtorName(line) {
    currentSection.collections.push(
        {
            type: "debtorNameAndAddress",
            creditorPbs: line.substring(5, 13),
            dataRecordNumber: line.substring(17, 22),
            debtorGroupNumber: line.substring(22, 27),
            customerNumber: line.substring(27, 42),
            name: line.substring(51, 86),
        }
    )
}

function parse022_0240_postalCodeCountry(line) {
    currentSection.collections.push(
        {
            type: "postalCodeCountry",
            creditorPbs: line.substring(5, 13),
            dataRecordNumber: line.substring(17, 22),
            debtorGroupNumber: line.substring(22, 27),
            customerNumber: line.substring(27, 42),
            postalCode: line.substring(66, 70),
            countryCode: line.substring(70, 73),
        }
    )
}

function parse022_0285(line) {
    currentSection.collections.push(
        {
            type: "paymentSlip",
            creditorPbs: line.substring(5, 13),
            dataRecordNumber: line.substring(17, 22),
            debtorGroupNumber: line.substring(22, 27),
            customerNumber: line.substring(27, 42),
            date: line.substring(51, 59),
            signCode: line.substring(59, 60),
            amount: line.substring(60, 73),
            reference: line.substring(73, 82),
            payerIdentification: line.substring(105, 120),
        }
    )
}

function parse022_0280(line) {
    currentSection.collections.push(
        {
            type: "collection",
            creditorPbs: line.substring(5, 13),
            dataRecordNumber: line.substring(17, 22),
            debtorGroupNumber: line.substring(22, 27),
            customerNumber: line.substring(27, 42),
            mandateNumber: line.substring(42, 51),
            date: line.substring(51, 59),
            signCode: line.substring(59, 60),
            amount: line.substring(60, 73),
            reference: line.substring(73, 103),
            payerIdentification: line.substring(105, 120),
        }
    )
}

function parse022_0241(line) {
    currentSection.collections.push(
        {
            type: "textToDebtor",
            creditorPbs: line.substring(5, 13),
            dataRecordNumber: line.substring(17, 22),
            debtorGroupNumber: line.substring(22, 27),
            customerNumber: line.substring(27, 42),
            textLine: line.substring(52, 112),
        }
    )
}

function parse022_0117(line) {
    currentSection.end = {
        creditorPbs: line.substring(5, 13),
        debtorGroupNumber: line.substring(22, 27),
        numberOfRecord042: line.substring(31, 42),
        amount: line.substring(42, 57),
        numberOfRecord052: line.substring(57, 68),
        numberOfRecord022: line.substring(83, 94),
    }
}

function parse002End(line) {
    parsedBs.end = {
        cvr: line.substring(5, 13),
        subsystem: line.substring(13, 16),
        deliveryType: line.substring(16, 20),
        numberOfSections: line.substring(20, 31),
        numberOf042: line.substring(31, 42),
        amount: line.substring(42, 57),
        numberOf052And062: line.substring(57, 68),
        numberOf022: line.substring(83, 94),
    }
}
