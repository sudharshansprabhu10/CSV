import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';
import { Button } from 'react-bootstrap';


const CsvFormater = () => {
    let newCsvArray = Array();

    const validatePunchData = (p, c, n) => {
        let flag = false;
        let str = '';
        let cn = [];

        if (!p) {
            if (c.includes('in')) {
                flag = true;
                str = c;
            }
            else {
                flag = true;
                cn = c.split(':');
                cn[2] = 'in'.concat(cn[2]);
                str = cn.join(':');
            }

        }
        else if (p && n) {
            if (p.includes('in') && c.includes('out')) {
                flag = true;
                str = c;
            }
            else if (p.includes('out') && c.includes('in')) {
                flag = true;
                str = c;
            }
            else {
                if (p.includes('in')) {
                    flag = true;
                    cn = c.split(':');
                    cn[2] = 'out'.concat(cn[2]);
                    str = cn.join(':');
                }
                else if (p.includes('out')) {
                    flag = true;
                    cn = c.split(':');
                    cn[2] = 'in'.concat(cn[2]);
                    str = cn.join(':');
                }
                else {
                    flag = false;
                    str = '';
                }
            }
        }
        else if (p && !n) {
            if (p.includes('in') && c.includes('out')) {
                flag = true;
                str = c;
            }
            else if (p.includes('out') && c.includes('in')) {
                flag = true;
                str = c;
            }
            else {
                if (p.includes('in')) {
                    flag = true;
                    cn = c.split(':');
                    cn[2] = 'out'.concat(cn[2]);
                    str = cn.join(':');
                }
                else if (p.includes('out')) {
                    flag = true;
                    cn = c.split(':');
                    cn[2] = 'in'.concat(cn[2]);
                    str = cn.join(':');
                }
                else {
                    flag = false;
                    str = '';
                }
            }
        }
        else {
            flag = false;
            str = '';
        }

        return { flag: flag, str: str };
    };

    const handlePunchData = (data) => {
        let punchDataArr = Array();
        let splittedData = data.split(',');
        let newData = Array();
        let validatedArr = Array();
        let flag = false;
        let cn = [];
        //console.log(splittedData);
        splittedData.forEach(function (i, index) {
            if (index === splittedData.length - 1) {
                return;
            }
            let prev = index > 0 ? splittedData[index - 1] : '';
            let cur = i;
            let next = index === splittedData.length - 1 ? '' : splittedData[index + 1];
            let validatedData = {};
            // if (index === 0 || flag) {
            // validatedData = validatePunchData(prev, cur, next);
            // console.log(validatedData);
            // flag = validatedData.flag;
            // validatedArr.push(validatedData.str);
            // }

            // console.log(validatedArr);

            // i.replace('/\(TD\)/gm', '(Downstair)');
            // newData.push((i.replace('TD', 'Downstair')));

            if (index === 0) {
                if (!cur.includes('in')) {
                    cn = cur.split(':');
                    cn[2] = 'in'.concat(cn[2]);
                    validatedArr.push(cn.join(':'));
                }
                else {
                    validatedArr.push(i);
                }

            }
            else if (index > 0) {
                if ((!cur.includes('in') && !cur.includes('out'))) {
                    if (prev.includes('in')) {
                        cn = cur.split(':');
                        cn[2] = 'out'.concat(cn[2]);
                        validatedArr.push(cn.join(':'));
                    }
                    else if (prev.includes('out')) {
                        cn = cur.split(':');
                        cn[2] = 'in'.concat(cn[2]);
                        validatedArr.push(cn.join(':'));
                    }
                }
                else {
                    validatedArr.push(i);
                }
            }
            else {
                validatedArr.push(i);
            }
        });


        validatedArr.forEach(function (i, index) {
            newData.push((i.replace('TD', 'Downstair')));
        });

        // console.log(newData);
        return newData.join();

    };
    const handleRow = (data) => {
        let newRow = Array();

        const punchData = handlePunchData(data[data.length - 1]);
        // console.log(punchData);

        newRow.push(data[0]);
        newRow.push(data[1]);
        newRow.push(data[2]);
        newRow.push(data[9]);
        newRow.push(data[10]);
        newRow.push(data[13]);
        newRow.push(punchData);
        newRow.push(data[11]);
        newRow.push(data[16]);
        newRow.push(data[16]);
        newRow.push('NA');


        return newRow;

    };

    const handleOnDrop = (data) => {
        newCsvArray = [];
        newCsvArray.push(['SR No', 'ID NUMBER', 'EMP NAME', 'IN TIME', 'OUT TIME', 'TOTAL DURATION', 'PUNCH RECORDS', 'WORK DURATION', 'PRESENT/ABSENT', 'STATUS', 'REMARK']);
        console.log(data);
        let newArr = [];
        data.forEach(function (i, index) {
            newArr.push(i.data);
        });

        newArr.forEach(function (i, index) {
            newCsvArray.push(handleRow(i));
        });

        console.log(newCsvArray);
    };

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveFile = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
    };

    const handleDownload = () => {
        let csv = "";
        newCsvArray.forEach(function (row) {
            csv += row.join(',');
            csv += "\n";
        });

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'timesheet.csv';
        hiddenElement.click();
    }


    return (
        <>
            <h5>Click and Drag Upload</h5>
            <CSVReader
                onDrop={handleOnDrop}
                onError={handleOnError}
                addRemoveButton
                onRemoveFile={handleOnRemoveFile}
            >
                <span>Drop CSV file here or click to upload.</span>
            </CSVReader>

            <Button onClick={handleDownload}>Download</Button>
        </>
    );
};

export default CsvFormater;

