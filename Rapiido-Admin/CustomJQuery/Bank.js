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
    Validation();
    GetBankList();
    $('#bttnAddBank').click(function () {
        ClearAll();
        $('#addBankpopup').modal('show');
    });
   
   
    $('body').on("click", "#tblBank .BankListEdit", function () {
        var row = $(this).closest("tr");
        var IsActive = row.find(".IsActive").html();
        if (IsActive == "true") {
            $('#ChkIsBankActive').prop('checked', true);
        }
        else {
            $('#ChkIsBankActive').prop('checked', false);
        }
        var BankName = row.find(".BankName").html()
        $('#hfBankId').val(row.find(".Id").html());
        $('#txtBankName').val(BankName);
        $('#addBankpopup').modal('show');
    });
    $('#btnSaveBank').click(function () {

        if ($('#txtBankName').val() == "") {

            CommonFunction.MsgAlert('Bank Name is Required');
        }
        else {
            if ($('#hfBankId').val() == "") {
                SubmitBank();
            }
            else {
                UpdateBank();
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
function SubmitBank() {
    var Isactive = false;
    var IsBank = false; 
    if ($("#ChkIsBankActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }

    if ($("#ChkIsBank").is(':checked'))
        IsBank = true;
    else {
        IsBank = false;
    }
    var request = new Object();

    request.BankName = $('#txtBankName').val();
    request.BankAmount = $('#txtBankAmount').val();
    request.IsBank = IsBank;
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;

    console.log(JSON.stringify(request));

    Common.Ajax('POST', url + 'InsertBank', JSON.stringify(request), 'json', submitBankHandler);
}
function submitBankHandler(response) {
    console.log("Insert Bank Response : ",response)
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetBankList();
    }
    else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function UpdateBank() {
    var Isactive = false;
    if ($("#ChkIsBankActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.Id = $('#hfBankId').val();
    request.BankName = $('#txtBankName').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;

    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'UpdateBank', JSON.stringify(request), 'json', submitBankHandler);
}

function GetBankList() {
    var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
    Common.Ajax('POST', url + 'GetAllBanks', CientId, 'json', GetBankHandler);
   
}


/*function GetBankList() {
    // Create dummy data array with sample bank information
    console.log("Get Bank List funcz");
    var dummyResponse = [
        { Id: 1, IsActive: true, BankName: "Dummy Bank 1", BankAmount: "1000", ISBank :"Yes", Status: "Active", CreatedDate: "2025-03-01", CreatedBy: "Admin" },
        { Id: 2, IsActive: false, BankName: "Dummy Bank 2", BankAmount: "1000", ISBank: "Yes", Status: "Inactive", CreatedDate: "2025-03-02", CreatedBy: "Admin" },
        { Id: 3, IsActive: true, BankName: "Dummy Bank 3", BankAmount: "1000", ISBank: "Yes", Status: "Active", CreatedDate: "2025-03-03", CreatedBy: "User" }
    ];

    // Directly pass the dummy data to the handler
    GetBankHandler(dummyResponse);
}*/

function GetBankHandler(response) {
    console.log(response);
     $('#tblBank > tbody').html(''); // Clear any existing rows
      var row = '';

    // Iterate over each dummy data item to build table rows
    $.each(response, function (i, item) {
        row += '<tr class="EditBank">' +
            '<td hidden="hidden" class="Id">' + item.Id + '</td>' +
            '<td hidden="hidden" class="IsActive">' + item.IsActive + '</td>' +
            '<td class="BankName">' + item.BankName + '</td>' +
            '<td class="BankAmount">' + item.BankAmount + '</td>' +
            '<td class="IsBank">' + item.IsBank + '</td>' +
            '<td class="Status">' + item.Status + '</td>' +
            '<td class="CreatedDate">' + item.CreatedDate + '</td>' +
            '<td class="CreatedBy">' + item.CreatedBy + '</td>' +
            '<td class="text-centre">' +
            '<button class="btn btn-primary BankListEdit" style="margin-right: 5px;"><i class="fa fa-edit"></i></button>' +
            '<button class="btn btn-info BankDetails">Bank Details</button>' +
            '</td>' +
            '</tr>';
    });

    // Prepend the constructed rows to the table body
    $('#tblBank > tbody').prepend(row);

    $('.BankDetails').click(function () {
        // Retrieve the bank Id from the closest row
        var bankId = $(this).closest('tr').find('.Id').text();
        // Route to BankDetails.html passing the bankId as a query parameter
        window.location.href = "/Home/BankDetails?bankId=" + bankId;
    });
}

function Validation() {
    $('#txtBankName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#txtBankName').focus();

        }
    });
}
function ClearAll() {
    $('#txtBankName').val('');
    $('#hfBankId').val('');
    $('#addBankpopup').modal('hide');
    $('#ConfirmationPopup').modal('hide');
}