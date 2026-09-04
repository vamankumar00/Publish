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

    GetCOAList();
    GetAccountTypeList();
    $('#bttnAddCoa').click(function () {
        ClearAll();
        $('#addCOApopup').modal('show');
    });
    $('#ddlAccountType').change(function () {
        debugger;

        var accountypeid = $('#ddlAccountType').val();
        var Range = $('#ddlAccountType').find(':selected').data('value');
        $('#AccountRange').val(Range);
        if ($("#hfCoaId").val() === '') {
            var CompanyId1 = parseInt(CompanyId);
            Common.Ajax('GET', url + 'getnextAccCode?companyid=' + CompanyId1 + '&accountypeid=' + accountypeid + '', '', 'json', getAccCodeHandler);
        }
    });
    $('#btnSaveCOA').click(function () {
        if ($('#ddlAccountType').val() == "0") {
            $('#ddlAccountType').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Account Type Required');
            $('#ddlAccountType').select2('open');

        }
        else if ($('#AccountCOAName').val() == "") {
            $('#AccountCOAName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Account Name Required');
            $('#AccountCOAName').focus();

        }
        else {
            if ($('#hfCoaId').val() == "") {
                SubmitCOA();
            }
            else {
                UpdateCOA();
            }

            ClearAll();
        }

    });
    $('body').on("click", "#tblCOA .EditCoa", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var Range = row.find(".Range").html();
        var AccCode = row.find(".AccCode").html();
        var AccountName = row.find(".AccountName").html();
        var AccountTypeId = row.find(".AccountTypeId").html();
        $('#hfCoaId').val(Id);
        $('#AccountTypeCode').val(AccCode);
        $('#ddlAccountType').val(AccountTypeId).trigger('change');

        $('#AccountCOAName').val(AccountName);
        $('#AccountRange').val(Range);

        $('#addCOApopup').modal('show');
    });
});
function Validation() {

    $('#AccountCOAName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountCOAName').focus();

        }
    });




}
function getAccCodeHandler(response) {
    $('#AccountTypeCode').val('');
    $('#AccountTypeCode').val(response.model.results[0].AccCode);
}
function GetCOAList() {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.coa = {};
    var Coa = {};
    Coa.code = "";
    Coa.id = 0;
    request.coa = Coa;

    Common.Ajax('POST', url + 'getcoa', JSON.stringify(request), 'json', getCOAHandler);
}
function getCOAHandler(response) {
    var row = '';
    $("#tblCOA tbody").empty();
    response.model.results.forEach(function (item) {
        row += '<tr class="EditDriver">' +
            '<td hidden="hidden" class=Id>' + item.AccID + '</td>' +
            '<td hidden="hidden" class=CompanyID>' + item.CompanyID + '</td>' +
            '<td hidden="hidden" class=AccountTypeId>' + item.AccountTypeId + '</td>' +
            '<td hidden="hidden">' + item.CompanyName + '</td>' +
            '<td>' + item.AccountSubCategoryName + '</td>' +
            '<td>' + item.AccountTypeName + '</td>' +
            '<td class=AccCode>' + item.AccCode + '</td>' +
            '<td class=AccountName>' + item.AccountName + '</td>' +
            '<td class=Range>' + item.Range + '</td>' +
            '<td>' + item.Status + '</td>' +
            '<td><a class="btn btn-warning btn-sm EditCoa" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblCOA tbody").append(row);
}
function GetAccountTypeList() {

    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.type = {};
    var Type = {};
    Type.categoryid = 0;
    Type.id = 0;
    request.type = Type;

    Common.Ajax('POST', url + 'getaccounttype', JSON.stringify(request), 'json', getaccountTypeHandler);
}
function getaccountTypeHandler(response) {
    var row = '';
    $('#ddlAccountType').html('');
    row += '<option value=0>--Select--</option>';
    response.model.results.forEach(function (item) {

        row += '<option value=' + item.Id + ' data-value= "' + item.Range + '">' + item.Name + '</option>';
    });
    $('#ddlAccountType').html(row);
    $("#ddlAccountType").select2({
        dropdownParent: $("#addCOApopup")
    });
}
function SubmitCOA() {
    var Isactive = false;
    if ($("#ChkIsCOAActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.CompanyID = parseInt(CompanyId);
    request.AccountTypeId = parseInt($('#ddlAccountType').val());
    request.AccCode = $('#AccountTypeCode').val();
    request.AccPCode = "";
    request.AccountName = $('#AccountCOAName').val();
    request.Status = Isactive;
    request.CreatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'coa', JSON.stringify(request), 'json', SaveCOAHandler);
}
function UpdateCOA() {
    debugger;
    var Isactive = false;
    if ($("#ChkIsCOAActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var Id = parseInt($('#hfCoaId').val());
    var request = {};
    request.Id = Id;
    request.CompanyID = parseInt(CompanyId);
    request.AccountTypeId = parseInt($('#ddlAccountType').val());
    request.AccCode = $('#AccountTypeCode').val();
    request.AccPCode = "";
    request.AccountName = $('#AccountCOAName').val();
    request.Status = Isactive;
    request.CreatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'coa/for-edit', JSON.stringify(request), 'json', UpdateCOAHandler);
}
function SaveCOAHandler(response) {
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('COA Add Successfully');
        $('#addCOApopup').modal('hide');
        GetCOAList();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function UpdateCOAHandler(response) {
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('COA Updated Successfully');
        $('#addCOApopup').modal('hide');
        GetCOAList();

    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }
}
function ClearAll() {
   
    $('#ddlAccountType').val(0).trigger('change');
    $('#AccountTypeCode').val('');
    $('#AccountCOAName').val('');
    $('#AccountRange').val('');
    $('#hfCoaId').val('');
    GetCOAList();
}