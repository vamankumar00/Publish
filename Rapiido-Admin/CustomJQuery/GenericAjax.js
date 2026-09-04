



var Common;
var CommonDataform
Common = {

    Ajax: function (httpMethod, url, data, type, successCallBack, async, cache) {
        if (typeof async == "undefined") {
            async = true;
        }
        if (typeof cache == "undefined") {
            cache = false;
        }

        var ajaxObj = $.ajax({
            type: httpMethod.toUpperCase(),
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: type,
            async: async,
            cache: cache,
            success: successCallBack,
            error: function (err, type, httpStatus) {
                Common.AjaxFailureCallback(err, type, httpStatus);
            }
        });

        return ajaxObj;
    },

    DisplaySuccess: function (message) {
        Common.ShowSuccessSavedMessage(message);
    },

    DisplayError: function (error) {
        Common.ShowFailSavedMessage(message);
    },

    AjaxFailureCallback: function (err, type, httpStatus) {
        var failureMessage = 'Error occurred in ajax call' + err.status + " - " + err.responseText + " - " + httpStatus;
        console.log(failureMessage);
    },

    ShowSuccessSavedMessage: function (messageText) {


        $.blockUI({ message: messageText });
        setTimeout($.unblockUI, 1500);
    },

    ShowFailSavedMessage: function (messageText) {


        $.blockUI({ message: messageText });
        setTimeout($.unblockUI, 1500);
    }
}

CommonDataform = {

    Ajax: function (httpMethod, url, data, successCallBack, async, cache) {
        if (typeof async == "undefined") {
            async = true;
        }
        if (typeof cache == "undefined") {
            cache = false;
        }

        var ajaxObj = $.ajax({
            type: httpMethod.toUpperCase(),
            url: url,
            data: data,
            contentType: false,
            processData: false, 
            async: async,
            cache: false,
            success: successCallBack,
            error: function (err, type, httpStatus) {
                Common.AjaxFailureCallback(err, type, httpStatus);
            }
        });

        return ajaxObj;
    },

    DisplaySuccess: function (message) {
        Common.ShowSuccessSavedMessage(message);
    },

    DisplayError: function (error) {
        Common.ShowFailSavedMessage(message);
    },

    AjaxFailureCallback: function (err, type, httpStatus) {
        var failureMessage = 'Error occurred in ajax call' + err.status + " - " + err.responseText + " - " + httpStatus;
        console.log(failureMessage);
    },

    ShowSuccessSavedMessage: function (messageText) {


        $.blockUI({ message: messageText });
        setTimeout($.unblockUI, 1500);
    },

    ShowFailSavedMessage: function (messageText) {


        $.blockUI({ message: messageText });
        setTimeout($.unblockUI, 1500);
    }
}

CommonFunction = {
    logFormData: function FDate(f) {
        var object = {};
        f.forEach(function (value, key) {
            object[key] = value;
        });
        var json = JSON.stringify(object);
        //console.log(json);
    },

    DeleteTableRow: function DeleteTableRow(tableRow) {
        if (confirm('Are you sure to delete this record ?')) {
            var row = tableRow.closest("tr");
            row.remove();
        }
    },

    MsgAlert: function msgAlert(response) {
        if (response.length > 0) {
            alertify.notify(response, 'success', 5);
        }
        else {
            alertify.notify(response.Message, 'success', 5);
        }
    },

    MsgAlertN: function msgAlertN(response, type) {
        if (response.length > 0) {

            if (type == "Error") {
                alertify.error(response, 5);
            }
            else if (type == "Warning") {
                alertify.error(response, 5);
            }
            else if (type == "Notify") {
                alertify.notify(response, 'success', 5);
            }
        }
        else {
            if (type == "Error") {
                alertify.error(response, 5);
            }
            else if (type == "Warning") {
                alertify.error(response, 5);
            }
            else if (type == "Notify") {
                alertify.notify(response, 'success', 5);
            }
        }
    },

    checkIsDate: function checkIfDateNotValid(d) {
        try {
            var d = new Date(d);
            return !(d.getTime() === d.getTime()); //NAN is the only type which is not equal to itself.
        } catch (e) {
            return true;
        }

    },

    IsEmail: function CheckIsEmail(str) {
        //var str = $('#tbEmailShipper_nj').val();
        var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if (filter.test(str))
            testresults = true
        else {
            //   alert("Please input a valid email address!")
            testresults = false
        }
        return (testresults)
    },

    getUrl: function getUrlFromFile() {
        var url;
        $.ajax({
            url: '/Data.txt',
            async: false,
            cache: false,
            dataType: "text",
            success: function (data, textStatus, jqXHR) {
                url = data;
            }
        });
        return url;
    }

}