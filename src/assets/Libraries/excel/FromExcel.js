danieleePrizeApp.factory("fromExcelFactory", function() {

    var X = XLSX;
    var XW = {
        /* worker message */
        msg: 'xlsx',
        /* worker scripts */
        //rABS: './xlsxworker2.js',
        //norABS: './xlsxworker1.js',
        //noxfer: './xlsxworker.js'
        rABS: 'scripts/libraries/excel/xlsxworker2.js',
        norABS: 'scripts/libraries/excel/xlsxworker1.js',
        noxfer: 'scripts/libraries/excel/xlsxworker.js'
    };

    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined"; //Use readAsBinaryString
    var use_worker = typeof Worker !== 'undefined'; //Use Web Workers
    var transferable = use_worker; //Use Transferrables
    var wtf_mode = false;
    var format = "csv"; //json//form
    var callback = undefined;

    function fixdata(data) {
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    function ab2str(data) {
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
        return o;
    }

    function s2ab(s) {
        var b = new ArrayBuffer(s.length * 2),
            v = new Uint16Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        return [v, b];
    }

    function xw_noxfer(data, cb) {
        var worker = new Worker(XW.noxfer);
        worker.onmessage = function(e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d));
                    break;
            }
        };
        var arr = rABS ? data : btoa(fixdata(data));
        worker.postMessage({ d: arr, b: rABS });
    }

    function xw_xfer(data, cb) {
        var worker = new Worker(rABS ? XW.rABS : XW.norABS);
        worker.onmessage = function(e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                default:
                    xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                    cb(JSON.parse(xx));
                    break;
            }
        };
        if (rABS) {
            var val = s2ab(data);
            worker.postMessage(val[1], [val[1]]);
        } else {
            worker.postMessage(data, [data]);
        }
    }

    function xw(data, cb) {
        if (transferable) xw_xfer(data, cb);
        else xw_noxfer(data, cb);
    }

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }

    function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
    }

    function to_formulae(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(formulae.join("\n"));
            }
        });
        return result.join("\n");
    }

    function process_wb(wb) {
        var output = "";
        switch (format) {
            case "json":
                output = to_json(wb); //output = JSON.stringify(to_json(wb), 2, 2);
                break;
            case "form":
                output = to_formulae(wb);
                break;
            default:
                output = to_csv(wb);
        }
        if (callback) callback(output);
        if (typeof console !== 'undefined') console.log("output", new Date());
    }

    function handleFile(file) {
        var f = file; {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function(e) {
                if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
                var data = e.target.result;
                if (use_worker) {
                    xw(data, process_wb);
                } else {
                    var wb;
                    if (rABS) {
                        wb = X.read(data, { type: 'binary' });
                    } else {
                        var arr = fixdata(data);
                        wb = X.read(btoa(arr), { type: 'base64' });
                    }
                    process_wb(wb);
                }
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        }
    }

    function b64it(value) {
        if (typeof console !== 'undefined') console.log("onload", new Date());
        var wb = X.read(value, { type: 'base64', WTF: wtf_mode });
        process_wb(wb);
    }

    return {
        formats: { csv: 'csv', json: 'json', form: 'form' },
        readExcel: function(file, formatVal, cb, isRABS, isUseWorker, isTransferable) {
            rABS = undefined != isRABS ? isRABS : rABS;
            use_worker = undefined != isUseWorker ? isUseWorker : use_worker;
            transferable = undefined != isTransferable ? isTransferable : transferable;
            format = formatVal;
            callback = cb;
            handleFile(file);
        },
        readExcelDrop: function(file, formatVal, isRABS, isUseWorker, isTransferable) {
            //function handleDrop(e) {
            //    e.stopPropagation();
            //    e.preventDefault();
            //    readExcel(e.dataTransfer.files[0], 'csv');
            //}
            //
            //var drop = document.getElementById('drop');
            //function handleDragover(e) {
            //    e.stopPropagation();
            //    e.preventDefault();
            //    e.dataTransfer.dropEffect = 'copy';
            //}
            //if(drop.addEventListener) {
            //    drop.addEventListener('dragenter', handleDragover, false);
            //    drop.addEventListener('dragover', handleDragover, false);
            //    drop.addEventListener('drop', handleDrop, false);
            //}
        },
        readExcelBase64: function(value, formatVal, cb) {
            format = formatVal;
            callback = cb;
            b64it(value);
        }
    }
});