
var url;
var CientId;
$(document).ready(function () {

    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
   
    CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';

    //Common.Ajax('GET', url + 'GetAllItemVeriation', '', 'json', AllItemVeriationHandler);
    Common.Ajax('GET', url + 'GetAllShifts?ClientId=' + DefaultClientId, DefaultClientId, 'json', bindShiftHandler);


    $('#SubmitDenomination').click(function () {
        if ($("#ddlShift").val() == '') {
            CommonFunction.MsgAlertN('Shift is Required for Closing', 'Error');
            $('#ddlShift').css('border-color', 'red');
            $('#ddlShift').focus();
            return false;
        }
        if ($('#total').text() == "0") {

            CommonFunction.MsgAlertN('Payment Required', 'Error');
            $('#total').css('border-color', 'red');
            $('#total').focus();
            return false;
        }

        var denomination5000 = parseInt($("#denomination5000").val()) || 0;
        var denomination1000 = parseInt($("#denomination1000").val()) || 0;
        var denomination500 = parseInt($("#denomination500").val()) || 0;
        var denomination100 = parseInt($("#denomination100").val()) || 0;
        var denomination50 = parseInt($("#denomination50").val()) || 0;
        var denomination20 = parseInt($("#denomination20").val()) || 0;
        var denomination10 = parseInt($("#denomination10").val()) || 0;
        var denomination5 = parseInt($("#denomination5").val()) || 0;
        var denomination2 = parseInt($("#denomination2").val()) || 0;
        var denomination1 = parseInt($("#denomination1").val()) || 0;

        var request = {};
        request.ShiftDemonination = new Array();

        var payment = {};
        payment.denomination5000 = denomination5000;
        payment.denomination1000 = denomination1000;
        payment.denomination500 = denomination500;
        payment.denomination100 = denomination100;
        payment.denomination50 = denomination50;
        payment.denomination20 = denomination20;
        payment.denomination10 = denomination10;
        payment.denomination5 = denomination5;
        payment.denomination2 = denomination2;
        payment.denomination1 = denomination1;
        payment.Total = $('#total').text();
        payment.CloseBy = window.localStorage.getItem("UserId"); //sessionStorage.getItem("UserId");
        
        console.log(JSON.stringify(payment));

        request.DefaultClientId = DefaultClientId;
        request.CloseBy = window.localStorage.getItem("UserId"); //sessionStorage.getItem("UserId");
        request.ShiftId = $("#ddlShift").val(); // ShiftId;
        request.ShiftCloseDate = new Date();
        request.ShiftDemonination.push(payment);


        Common.Ajax('POST', url + 'ShiftClose', JSON.stringify(request), 'json', AddDenominationHandler);
    });
    $("input[type='number']").on('input', function () {
        updateTotal();
    });
});


function bindShiftHandler(response) {

    var row = '';
    row += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        row += '<option value=' + item.Id + '>' + item.Shift + "(" + item.StartTime + "-" + item.EndTime + ")" + '</option>';
    });

    $('#ddlShift').html(row);

}

function updateTotal() {
    var denomination5000 = parseInt($("#denomination5000").val()) || 0;
    var denomination1000 = parseInt($("#denomination1000").val()) || 0;
    var denomination500 = parseInt($("#denomination500").val()) || 0;
    var denomination100 = parseInt($("#denomination100").val()) || 0;
    var denomination50 = parseInt($("#denomination50").val()) || 0;
    var denomination20 = parseInt($("#denomination20").val()) || 0;
    var denomination10 = parseInt($("#denomination10").val()) || 0;
    var denomination5 = parseInt($("#denomination5").val()) || 0;
    var denomination2 = parseInt($("#denomination2").val()) || 0;
    var denomination1 = parseInt($("#denomination1").val()) || 0;

    var total = (denomination5000 * 5000) +
        (denomination1000 * 1000) +
        (denomination500 * 500) +
        (denomination100 * 100) +
        (denomination50 * 50) +
        (denomination20 * 20) +
        (denomination10 * 10) +
        (denomination5 * 5) +
        (denomination2 * 2) +
        (denomination1 * 1);

    $("#total").text( total);
}

function AddDenominationHandler(response) {
    if (response.HasError == false) {
        debugger;
        //window.location.href = '@Url.Action("PrintReport", "Dinein")';
        var shiftDt = new Date();
        const yyyy = shiftDt.getFullYear();
        let mm = shiftDt.getMonth() + 1; // month is zero-based
        let dd = shiftDt.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formatted = yyyy + '-' + mm + '-' + dd;
        console.log(formatted);
        var request = {};
        request.DefaultClientId = DefaultClientId;
        request.ShiftId = $("#ddlShift").val();
        request.ShiftDate = formatted;

        Common.Ajax('POST', url + 'GetShiftDetailPrint', JSON.stringify(request), 'json', PrintShiftClose);

        CommonFunction.MsgAlert(response.Message);
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
    
}
function PrintShiftClose(response) {

    debugger;
    console.log(response);

    $.ajax({
        // url: '@Url.Action("PrintReport", "Dinein")',
        url: "../Dinein/PrintReport",
        type: 'POST',
        cache: false,
        contentType: 'application/json', // Set the content type to JSON
        data: JSON.stringify({ shiftData: response[0] }), // Convert the data to JSON
        success: function (data) {
            console.log("Shift Closed Printed", data);
            $('#ViewDenomination').modal('hide');
        },
        error: function (data) {
            console.log("Error ", data);
        }
    });

    $('#ViewDenomination').modal('hide');
}
