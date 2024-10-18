// import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { getData } from "../apis/apiCalls";
import { router, usePage } from "@inertiajs/react";
const fileExtension = ".xlsx";
const toggleFullScreen = () => {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
    var cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

    if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
};

const exportToEXCEL = (url, fileName) => {
    getData(url).then((result) => {
        result.data.data.forEach(function (data) {
            delete data.customer_id;
            delete data.encrypted_customer;
        });
        const ws = XLSX.utils.json_to_sheet(result.data.data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        XLSX.writeFile(wb, fileName + fileExtension);
    });
};

const jsonToEXCEL = (jsonData, fileName) => {
    return new Promise((resolve, reject) => {
        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        XLSX.writeFile(wb, fileName + fileExtension);
        resolve();
    });
};

const excelToJson = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            const binarystr = new Uint8Array(e.target.result);
            const wb = XLSX.read(binarystr, {
                type: "array",
                raw: true,
                cellFormula: false,
            });
            const wsname = wb.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
            resolve(data);
        };
    });
};

const accountHeadList = (data) => {
    return new Promise((resolve, reject) => {
        let new_array = [];
        Object.entries(data).forEach((entry) => {
            const [key, value] = entry;
            let new_sub_array = [];
            Object.entries(value).forEach((subEntry) => {
                const [subKey, subValue] = subEntry;
                new_sub_array.push({
                    name: subKey,
                    name_ar: "",
                    child: subValue,
                });
            });
            new_array.push({ name: key, name_ar: "", child: new_sub_array });
        });
        resolve(new_array);
    });
};

const colorList = (index) => {
    let list = ["success", "error", "warning", "primary", "secondary"];
    return list[index];
};

function getLastMonths(n) {
    var monthNames = [
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

    var today = new Date();
    var lastMonths = [];

    for (let i = 0; i < n; i++) {
        lastMonths.push({
            month: monthNames[today.getMonth() - i],
            year: today.getFullYear(),
            value: `${today.getMonth() - i + 1}/${today.getFullYear()}`,
        });
    }
    return lastMonths;
}

export {
    toggleFullScreen,
    exportToEXCEL,
    excelToJson,
    jsonToEXCEL,
    accountHeadList,
    colorList,
    getLastMonths,
};
