var url;
$(document).ready(function () {

    $.ajax({
        url: '../data.txt',
        async: false,
        cache: false,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });

    GetBankDetailsList(new URLSearchParams(window.location.search).get("bankId"));
    $('#bttnAddBankDetails').click(function () {
        ClearAll();
        $('#addBankDetailspopup').modal('show');
    });

    $('body').on("click", "#tblBankDetails .BankDetailsEdit", function () {
        var row = $(this).closest("tr");
        var Status = row.find(".Status").html();
        if (Status == "true" || Status == "True" || Status == "Active") {
            $('#ChkIsBankActive').prop('checked', true);
        }
        else {
            $('#ChkIsBankActive').prop('checked', false);
        }
        
        $('#hfBankDetailsId').val(row.find(".Id").html());
        $('#txtBankBin').val(row.find(".BankBin").html());
        $('#txtPersonCount').val(row.find(".PersonCount").html());
        $('#ddlCardType').val(row.find(".CardType").html());
        $('#txtCardProduct').val(row.find(".CardProduct").html());
        $('#ddlVisit').val(row.find(".Visit").html());
        
        $('#addBankDetailspopup').modal('show');
    });
    $('#btnSaveBankDetails').click(function () {

        if ($('#txtBankBin').val() == "") {

            CommonFunction.MsgAlert('Bank Bin is Required');
        }
        if ($('#txtPersonCount').val() == "") {

            CommonFunction.MsgAlert('Person Count is Required');
        }
        if ($('#ddlCardType').val() == "") {

            CommonFunction.MsgAlert('Card Type is Required');
        }
        if ($('#txtCardProduct').val() == "") {

            CommonFunction.MsgAlert('Card Product is Required');
        }
        if ($('#ddlVisit').val() == "") {

            CommonFunction.MsgAlert('Visit is Required');
        }
        else {
            if ($('#hfBankDetailsId').val() == "") {
                SubmitBankDetails();
            }
            else {
                UpdateBankDetails();
            }
        }

    });
    /* $('#txtBankName').autocomplete({
 
         source: function (request, response) {
             var request = new Object();
             request.BankName = $('#txtBankName').val();
             request.DefaultClientId = DefaultClientId;
 
             var autocompleteUrl = url + 'GetBank';
             $.ajax({
                 url: autocompleteUrl,
                 type: 'POST',
                 cache: false,
                 dataType: 'json',
                 contentType: 'application/json',
                 data: JSON.stringify(request),
                 success: function (json) {
                     // call autocomplete callback method with results 
 
                     if (json.length == 0) {
 
                     }
                     response($.map(json, function (data, id) {
                         return {
                             label: data.BankName,
                             value: data.BankName,
                             Id: data.Id
                         };
                     }));
                 },
                 error: function (xmlHttpRequest, textStatus, errorThrown) {
                     console.log('some error occured', textStatus, errorThrown);
                 }
             });
         },
         minLength: 2,
 
         select: function (event, ui) {
             $('#txtBankName').val(ui.item.label);
 
 
             return false;
         }
     });*/
});
function SubmitBankDetails() {
    var Isactive = false;
    
    if ($("#ChkIsBankActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }

    var request = new Object();

    request.BinNo = $('#txtBankBin').val();
    request.BankId = new URLSearchParams(window.location.search).get("bankId");
    request.PersonCount = $('#txtPersonCount').val();
    request.CardType = $('#ddlCardType').val();
    request.CardProduct = $('#txtCardProduct').val();
    request.Visit = $('#ddlVisit').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;

    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'InsertBankBin', JSON.stringify(request), 'json', submitBankDetailsHandler);
}
function submitBankDetailsHandler(response) {
    console.log("Insert Bank Response : ", response);
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetBankDetailsList(new URLSearchParams(window.location.search).get("bankId"));
    } else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function UpdateBankDetails() {
    var Isactive = false;
    if ($("#ChkIsBankActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.Id = $('#hfBankDetailsId').val();
    request.BankId = new URLSearchParams(window.location.search).get("bankId");
    request.BinNo = $('#txtBankBin').val();
    request.PersonCount = $('#txtPersonCount').val();
    request.CardType = $('#ddlCardType').val();
    request.CardProduct = $('#txtCardProduct').val();
    request.Visit = $('#ddlVisit').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;

    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'UpdateBankBin', JSON.stringify(request), 'json', submitBankDetailsHandler);
}

    function GetBankDetailsList(bankId) {
        var requestData = '{"BankId":' + bankId + ', "DefaultClientId":"' + DefaultClientId + '"}';
        Common.Ajax('POST', url + 'GetBankBinDetails', requestData, 'json', GetBankHandler);
    }

function GetBankHandler(response) {
    console.log('response of Bank Details List : ',response);
    $('#tblBankDetials > tbody').html(''); // Clear any existing rows
    var row = '';

    // Iterate over each dummy data item to build table rows
    $.each(response, function (i, item) {
        row += '<tr class="EditBank">' +
            '<td hidden="hidden" class="Id">' + item.Id + '</td>' +
            '<td class="BankBin">' + item.BinNo + '</td>' +
            '<td class="BankName">' + item.BankId + '</td>' +
            '<td class="PersonCount">' + item.PersonCount + '</td>' +
            '<td class="CardType">' + item.CardType + '</td>' +
            '<td class="CardProduct">' + item.CardProduct + '</td>' +
            '<td class="Visit">' + item.Visit + '</td>' +
            '<td class="Status">' + item.IsActive+ '</td>' +
            '<td class="CreatedDate">' + item.CreatedDate + '</td>' +
            '<td class="CreatedBy">' + item.CreatedBy + '</td>' +
            '<td class="text-centre">' +
            '<button class="btn btn-primary BankDetailsEdit" style="margin-right: 5px;">' +
            '<i class="fa fa-edit"></i>' +
            '</button>' +
            '</td>' +
            '</tr>';
    });

    // Prepend the constructed rows to the table body
    $('#tblBankDetails > tbody').prepend(row);
}

function ClearAll() {
    $('#hfBankDetailsId').val('');
    $('#txtBankBin').val('');
    $('#txtPersonCount').val('');
    $('#ddlCardType').val('');
    $('#txtCardProduct').val('');
    $('#ddlVisit').val('');
    $('#addBankDetailspopup').modal('hide');
    $('#ConfirmationPopup').modal('hide');
}