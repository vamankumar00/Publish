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
    GetRawMaterialList();
    $('#bttnAddMaterial').click(function () {
        ClearAll();
        $('#addRawMaterialpopup').modal('show');
    });
    $('body').on("click", "#tblRawMaterial .RawMaterialDelete", function () {

        var row = $(this).closest("tr");
        var MaterialDesc = row.find(".MaterialDesc").html()
        $('#hfRawMaterialId').val(row.find(".Id").html());
        $('#Msg').html("Are You Sure You Want To Delete! " + MaterialDesc);
        $('#ConfirmationPopup').modal('show');

    });
    $('#bttnYesConfirmation').click(function () {
        DeleteRawMaterial();
    });
    $('body').on("click", "#tblRawMaterial .RawMaterialListEdit", function () {
        var row = $(this).closest("tr");
        var IsActive = row.find(".IsActive").html();
        if (IsActive == "true") {
            $('#ChkIsRawMaterialActive').prop('checked', true);
        }
        else {
            $('#ChkIsRawMaterialActive').prop('checked', false);
        }
        var MaterialDesc = row.find(".MaterialDesc").html()
        $('#hfRawMaterialId').val(row.find(".Id").html());
        $('#txtRawMaterial').val(MaterialDesc);
        $('#addRawMaterialpopup').modal('show');    
    });
    $('#btnSaveRawMaterial').click(function () {

        if ($('#txtRawMaterial').val() == "") {

            CommonFunction.MsgAlert('Material Required');
        }
        else {
            if ($('#hfRawMaterialId').val() == "") {
                SubmitRawMaterial();
            }
            else {
                UpdateRawMaterial();
            }
        }
      
    });
    $('#txtRawMaterial').autocomplete({

        source: function (request, response) {
            var request = new Object();
            request.MaterialDesc = $('#txtRawMaterial').val();
            request.DefaultClientId = DefaultClientId;

            var autocompleteUrl = url + 'GetRawMaterial';
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
                            label: data.MaterialDesc,
                            value: data.MaterialDesc,
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
            $('#txtRawMaterial').val(ui.item.label);
          

            return false;
        }
    });
});
function SubmitRawMaterial() {
    var Isactive = false;
    if ($("#ChkIsRawMaterialActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
   
    request.MaterialDesc = $('#txtRawMaterial').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
   
    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'InsertRawMaterial', JSON.stringify(request), 'json', submitRawMaterialHandler);
}
function submitRawMaterialHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetRawMaterialList();
    }
    else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function UpdateRawMaterial() {
    var Isactive = false;
    if ($("#ChkIsRawMaterialActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.Id = $('#hfRawMaterialId').val();
    request.MaterialDesc = $('#txtRawMaterial').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;

    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'UpdateRawMaterial', JSON.stringify(request), 'json', submitRawMaterialHandler);
}
function DeleteRawMaterial() {
    var request = new Object();
    request.Id = $('#hfRawMaterialId').val();
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'DeleteRawMaterial', JSON.stringify(request), 'json', DeleteRawMaterialHandler);
}
function DeleteRawMaterialHandler(response) {
   
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetRawMaterialList();
    }
    else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function GetRawMaterialList() {
    var request = new Object();

    request.DefaultClientId = DefaultClientId;
    request.MaterialDesc = '';
    Common.Ajax('POST', url + 'GetRawMaterial', JSON.stringify(request), 'json', GetRawMaterialHandler);
}
function GetRawMaterialHandler(response) {
    console.log(response);
    $('#tblRawMaterial > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr class="EditVendor">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=IsActive>' + item.IsActive + '</td>' +
            '<td class=MaterialDesc>' + item.MaterialDesc + '</td>' +
            '<td class=Status>' + item.Status + '</td>' +
            '<td class=CreatedDate>' + item.CreatedDate + '</td>' +
            '<td class=CreatedBy>' + item.CreatedBy + '</td>' +
            '<td class="text-centre"><button class="btn btn-primary RawMaterialListEdit"><i class="fa fa-edit"></i></button>' +
            '<button class="btn btn-danger RawMaterialDelete"><i class="fa fa-trash"></i></button></td>' +
            '</tr>';


    });
    $('#tblRawMaterial > tbody').prepend(row);
}
function Validation() {
    $('#txtRawMaterial').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#txtRawMaterial').focus();

        }
    });
}
function ClearAll() {
    $('#txtRawMaterial').val('');
    $('#hfRawMaterialId').val('');
    $('#addRawMaterialpopup').modal('hide');
    $('#ConfirmationPopup').modal('hide');
}