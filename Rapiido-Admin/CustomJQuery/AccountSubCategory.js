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

    GetAccountSubcategoryList();
    GetAccountCategoryList();
    Validation();

    $('#bttnAddAccountSubCategory').click(function () {
        ClearAll();
        $('#addAccountsubcategorypopup').modal('show');
    });
    $('#ddlAccountCategory').change(function () {
        debugger;
        var categoryid = $('#ddlAccountCategory').val();
        var Range = $('#ddlAccountCategory').find(':selected').data('value');
        $('#AccountCategoryRange').val(Range);

        var request = {};
        request.companyid = parseInt(CompanyId);
        request.sortBy = "";
        request.startwith = 0;
        request.numberOfRecords = 0;
        request.category = {};
        var category = {};
        category.id = parseInt(categoryid);
        category.natureid = 0;
        request.category = category;
        Common.Ajax('POST', url + 'getaccountcategory', JSON.stringify(request), 'json', getAccCodeHandler);
    });
    $('#btnSaveAccountType').click(function () {

        if ($('#ddlAccountCategory').val() == "0") {
            $('#ddlAccountCategory').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('SubCategory Required');
            $('#ddlAccountCategory').select2('open');

        }

        else if ($('#AccountSubCategoryName').val() == "") {
            $('#AccountSubCategoryName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Name Required');
            $('#AccountSubCategoryName').focus();

        }
        else if ($('#AccountSubCategoryFromAccount').val() == "") {
            $('#AccountSubCategoryFromAccount').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('From account Required');
            $('#AccountSubCategoryFromAccount').focus();

        }
        else if ($('#AccountSubCategoryToAccount').val() == "") {
            $('#AccountSubCategoryToAccount').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Toaccount Required');
            $('#AccountSubCategoryToAccount').focus();

        }
        else {
            if ($('#hfAccountsubcategoryId').val() == "") {
                SubmitAccountType();
            }
            else {
                UpdateAccountType();
            }
        }

    });
    $('body').on("click", "#tblAccountType .EditAccountType", function () {

        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();

        var AccountCategoryId = row.find(".AccountCategoryId").html();
        var CategoryRange = row.find(".CategoryRange").html();
        var Name = row.find(".Name").html();
        var FromAccount = row.find(".FromAccount").html();
        var ToAccount = row.find(".ToAccount").html();
        var IsActive = row.find(".IsActive").html();
        $('#hfAccountsubcategoryId').val(Id);
        $('#ddlAccountCategory').val(AccountCategoryId).trigger('change');
        $('#AccountCategoryRange').val(CategoryRange);
        $('#AccountSubCategoryName').val(Name);
        $('#AccountSubCategoryFromAccount').val(FromAccount);
        $('#AccountSubCategoryToAccount').val(ToAccount);
        if (IsActive == "Active") {
            $('#ChkIsAccountSubCategoryActive').prop('checked', true);
        }
        else {
            $('#ChkIsAccountSubCategoryActive').prop('checked', false);
        }

     
        $('#addAccountsubcategorypopup').modal('show');

    });

});
function getAccCodeHandler(response) {
    $('#AccountCategoryRange').val('');
    if (response.model.results[0].Range != '') {
        $('#AccountCategoryRange').val(response.model.results[0].Range);
    }
}
function Validation() {
    //$('#AccountTypeCode').blur('input', function () {
    //    var input = $(this);
    //    var is_name = input.val();
    //    if (is_name) {
    //        input.removeClass("invalid").addClass("valid");

    //    }
    //    else {
    //        input.removeClass("valid").addClass("invalid");
    //        $('#AccountTypeCode').focus();

    //    }
    //});
    $('#AccountSubCategoryName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountSubCategoryName').focus();

        }
    });
    $('#AccountSubCategoryFromAccount').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountSubCategoryFromAccount').focus();

        }
    });
    $('#AccountSubCategoryToAccount').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountSubCategoryToAccount').focus();

        }
    });
}
function GetAccountSubcategoryList() {
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

    Common.Ajax('POST', url + 'getaccountsubcategory', JSON.stringify(request), 'json', getaccountTypeHandler);
}
function GetAccountCategoryList() {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.category = {};
    var category = {};
    category.natureid = 0;
    category.id = 0;
    request.category = category;

    Common.Ajax('POST', url + 'getaccountcategory', JSON.stringify(request), 'json', getaccountCategoryHandler);
}
function getaccountCategoryHandler(response) {
    var row = '';

    $('#ddlAccountCategory').html('');
    row += '<option value=0>--Select--</option>';
    response.model.results.forEach(function (item) {

      //  row += '<option value=' + item.Id + '>' + item.Name + '</option>';
        row += '<option value=' + item.Id + ' data-value= "' + item.Range + '">' + item.Name + '</option>';
    });
    $('#ddlAccountCategory').html(row);
    $("#ddlAccountCategory").select2({
        dropdownParent: $("#addAccountsubcategorypopup")
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
            '<td hidden="hidden">' + item.CompanyName + '</td>' +
            '<td class="CategoryName">' + item.AccountCategoryName + '</td>' +
            '<td>' + item.CategoryRange + '</td>' +
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
    if ($("#ChkIsAccountSubCategoryActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.CompanyID = parseInt(CompanyId);
    request.AccountCategoryId = parseInt($('#ddlAccountCategory').val());
    request.Code = "1";// $('#AccountTypeCode').val();
    request.Name = $('#AccountSubCategoryName').val();
    request.FromAccount = $('#AccountSubCategoryFromAccount').val();
    request.ToAccount = $('#AccountSubCategoryToAccount').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);


    Common.Ajax('POST', url + 'accountsubcategory', JSON.stringify(request), 'json', SaveAccountTypeHandler);
}
function UpdateAccountType() {
    var Isactive = false;
    if ($("#ChkIsAccountSubCategoryActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var Id = $('#hfAccountsubcategoryId').val()
    var request = {};
    request.Id = parseInt(Id);
    request.CompanyID = parseInt(CompanyId);
    request.AccountCategoryId = parseInt($('#ddlAccountCategory').val());
    request.Code = "1";//$('#AccountTypeCode').val();
    request.Name = $('#AccountSubCategoryName').val();
    request.FromAccount = $('#AccountSubCategoryFromAccount').val();
    request.ToAccount = $('#AccountSubCategoryToAccount').val();
    request.IsActive = Isactive;
    request.UpdatedBy = parseInt(UserId);
    Common.Ajax('POST', url + 'accountsubcategory/for-edit', JSON.stringify(request), 'json', UpdateAccountTypeHandler);
}
function SaveAccountTypeHandler(response) {
    debugger;
    if (response.isSuccess == true) {
        $('#addAccountsubcategorypopup').modal('hide');
        CommonFunction.MsgAlert('Account SubCategory Added Successfully');

        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function UpdateAccountTypeHandler(response) {
    debugger;
    if (response.isSuccess == true) {
        $('#addAccountsubcategorypopup').modal('hide');
        CommonFunction.MsgAlert('Account SubCategory Updated Successfully');


        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function ClearAll() {
      $('#ddlAccountCategory').val(0).trigger('change');
    $('#AccountSubCategoryName').val('');
    $('#AccountCategoryRange').val('');
    $('#AccountSubCategoryFromAccount').val('');
    $('#AccountSubCategoryToAccount').val('');
    $('#hfAccountsubcategoryId').val('');
    GetAccountSubcategoryList();
}