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
    $('#ddlAccountCategory').select2();
    Validation();
    GetAccountTypeList();
    GetAccountCategoryList();
    $('#ddlAccountCategory').change(function () {
        debugger;
        var subcategoryid = $('#ddlAccountCategory').val();
        var Range = $('#ddlAccountCategory').find(':selected').data('value');
        $('#AccountSubCategoryRange').val(Range);

        var request = {};
        request.companyid = parseInt(CompanyId);
        request.sortBy = "";
        request.startwith = 0;
        request.numberOfRecords = 0;
        request.subcategory = {};
        var subcategory = {};
        subcategory.id = parseInt(subcategoryid);
        subcategory.categoryid = 0;
        request.subcategory = subcategory;
        Common.Ajax('POST', url + 'getaccountsubcategory', JSON.stringify(request), 'json', getAccCodeHandler);
    });

    $('#bttnAddAccountType').click(function () {
        ClearAll();
        $('#addAccountTypepopup').modal('show');
    });

    $('body').on("click", "#tblAccountType .EditAccountType", function () {

        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();

        var AccountSubCategoryId = row.find(".AccountSubCategoryId").html();
        var Name = row.find(".Name").html();
        var FromAccount = row.find(".FromAccount").html();
        var ToAccount = row.find(".ToAccount").html();
        var IsActive = row.find(".IsActive").html();
        $('#hfAccountTypeId').val(Id);
        $('#ddlAccountCategory').val(AccountSubCategoryId).trigger('change');
        $('#AccountTypeName').val(Name);
        $('#AccountTypeFromNumber').val(FromAccount);
        $('#AccountTypeToNumber').val(ToAccount);
        if (IsActive == "Active") {
            $('#ChkIsAccountTypeActive').prop('checked', true);
        }
        else {
            $('#ChkIsAccountTypeActive').prop('checked', false);
        }

        $('#addAccountTypepopup').modal('show');

    });
    $('#btnSaveAccountType').click(function () {

        if ($('#ddlAccountCategory').val() == "0") {
            $('#ddlAccountCategory').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Category Required');
            $('#ddlAccountCategory').select2('open');

        }

        else if ($('#AccountTypeName').val() == "") {
            $('#AccountTypeName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Code Required');
            $('#AccountTypeName').focus();

        }
        else if ($('#AccountTypeFromNumber').val() == "") {
            $('#AccountTypeFromNumber').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Code Required');
            $('#AccountTypeFromNumber').focus();

        }
        else if ($('#AccountTypeToNumber').val() == "") {
            $('#AccountTypeToNumber').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Code Required');
            $('#AccountTypeToNumber').focus();

        }
        else {
            if ($('#hfAccountTypeId').val() == "") {
                SubmitAccountType();
            }
            else {
                UpdateAccountType();
            }
        }

    });
});
function getAccCodeHandler(response) {
    $('#AccountSubCategoryRange').val('');
    $('#AccountSubCategoryRange').val(response.model.results[0].Range);
}
function Validation() {
    $('#AccountTypeCode').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountTypeCode').focus();

        }
    });
    $('#AccountTypeName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountTypeName').focus();

        }
    });
    $('#AccountTypeFromNumber').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountTypeFromNumber').focus();

        }
    });
    $('#AccountTypeToNumber').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountTypeToNumber').focus();

        }
    });
}
function GetAccountTypeList() {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.type = {};
    var Type = {};
    Type.subcategoryid = 0;
    Type.id = 0;
    request.type = Type;

    Common.Ajax('POST', url + 'getaccounttype', JSON.stringify(request), 'json', getaccountTypeHandler);
}
function GetAccountCategoryList() {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.subcategory = {};
    var subcategory = {};
    subcategory.categoryid = 0;
    subcategory.id = 0;
    request.subcategory = subcategory;

    Common.Ajax('POST', url + 'getaccountsubcategory', JSON.stringify(request), 'json', getaccountCategoryHandler);
}
function getaccountCategoryHandler(response) {
    var row = '';
    $('#ddlAccountCategory').html('');
    row += '<option value=0>--Select--</option>';
    response.model.results.forEach(function (item) {

        row += '<option value=' + item.Id + '>' + item.Name + '</option>';
    });
    $('#ddlAccountCategory').html(row);
    $("#ddlAccountCategory").select2({
        dropdownParent: $("#addAccountTypepopup")
    });
}
function getaccountTypeHandler(response) {
    var row = '';
    $("#tblAccountType tbody").empty();
    response.model.results.forEach(function (item) {
        row += '<tr class="EditDriver">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=CompanyID>' + item.CompanyID + '</td>' +
            '<td hidden="hidden" class=AccountCategoryId>' + item.AccountCategoryId + '</td>' +
            '<td hidden="hidden" class=AccountSubCategoryId>' + item.AccountSubCategoryId + '</td>' +
            '<td hidden="hidden">' + item.CompanyName + '</td>' +
            //'<td class="Code">' + item.Code + '</td>' +
            '<td class="CategoryName">' + item.AccountCategoryName + '</td>' +
            '<td class="CategoryName">' + item.AccountSubCategoryName + '</td>' +
            '<td class="Name">' + item.Name + '</td>' +
            '<td hidden="hidden" class="FromAccount">' + item.FromAccount + '</td>' +
            '<td hidden="hidden" class="ToAccount">' + item.ToAccount + '</td>' +
            '<td>' + item.Range + '</td>' +
            '<td class="IsActive">' + item.IsActive + '</td>' +
            '<td><a class="btn btn-warning btn-sm EditAccountType" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
        
    });
    $("#tblAccountType tbody").append(row);
}
function SubmitAccountType() {
    var Isactive = false;
    if ($("#ChkIsAccountTypeActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.CompanyID = parseInt(CompanyId);
    request.AccountSubCategoryId = parseInt($('#ddlAccountCategory').val());
    request.Code = "1";// $('#AccountTypeCode').val();
    request.Name = $('#AccountTypeName').val();
    request.FromAccount = $('#AccountTypeFromNumber').val();
    request.ToAccount = $('#AccountTypeToNumber').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);


    Common.Ajax('POST', url + 'accounttype', JSON.stringify(request), 'json', SaveAccountTypeHandler);
}
function UpdateAccountType() {
    var Isactive = false;
    if ($("#ChkIsAccountTypeActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var Id = $('#hfAccountTypeId').val()
    var request = {};
    request.Id = parseInt(Id);
    request.CompanyID = parseInt(CompanyId);
    request.AccountSubCategoryId = parseInt($('#ddlAccountCategory').val());
    request.Code = "1";// $('#AccountTypeCode').val();
    request.Name = $('#AccountTypeName').val();
    request.FromAccount = $('#AccountTypeFromNumber').val();
    request.ToAccount = $('#AccountTypeToNumber').val();
    request.IsActive = Isactive;
    request.UpdatedBy = parseInt(UserId);
    Common.Ajax('POST', url + 'accounttype/for-edit', JSON.stringify(request), 'json', UpdateAccountTypeHandler);
}
function SaveAccountTypeHandler(response) {
    debugger;
    if (response.isSuccess == true) {
        $('#addAccountTypepopup').modal('hide');
        CommonFunction.MsgAlert('Account Type Add Successfully');

        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function UpdateAccountTypeHandler(response) {
    debugger;
    if (response.isSuccess == true) {
        $('#addAccountTypepopup').modal('hide');
        CommonFunction.MsgAlert('Account Type Updated Successfully');


        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function ClearAll() {
    $('#ddlAccountCategory').val(0).trigger('change');
    $('#AccountSubCategoryRange').val('');
    $('#AccountTypeName').val('');
    $('#AccountTypeFromNumber').val('');
    $('#AccountTypeToNumber').val('');
    $('#hfAccountTypeId').val('');
    GetAccountTypeList();
}