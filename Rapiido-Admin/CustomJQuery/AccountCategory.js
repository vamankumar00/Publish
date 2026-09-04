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

    GetAccountCategoryList();
    Validation();
    BindDropDown();
    $('#bttnAddAccountCategory').click(function () {
        //BindDropDown();
        ClearAll();
        $('#addAccountCategorypopup').modal('show');
    });
    $('#btnSaveAccountCategory').click(function () {

        if ($('#ddlAccountNature').val() == "0") {
            $('#ddlAccountNature').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Nature Required');
            $('#ddlAccountNature').select2('open');

        }

        else if ($('#AccountCategoryName').val() == "") {
            $('#AccountCategoryName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Name Required');
            $('#AccountCategoryName').focus();

        }
        else if ($('#AccountCategoryFromNumber').val() == "") {
            $('#AccountCategoryFromNumber').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('From account Required');
            $('#AccountCategoryFromNumber').focus();

        }
        else if ($('#AccountCategoryToNumber').val() == "") {
            $('#AccountCategoryToNumber').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('To account Required');
            $('#AccountCategoryToNumber').focus();

        }

        else {
            if ($('#hfAccountCategoryId').val() == "") {
                SubmitAccountCategory();
            }
            else {
                UpdateAccountCategory();
            }
            ClearAll();
            //
        }

    });
    $('body').on("click", "#tblAccountCategory .EditAccountCategory", function () {
        //BindDropDown();
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();

        var CategoryName = row.find(".CategoryName").html();
        var AccountNatureId = row.find(".AccountNatureId").html();
        var IsActive = row.find(".IsActive").html();
        var FromAccount = row.find(".FromAccount").html();
        var ToAccount = row.find(".ToAccount").html();
        $('#hfAccountCategoryId').val(Id);

        $('#AccountCategoryName').val(CategoryName);

        $('#AccountCategoryFromNumber').val(FromAccount);
        $('#AccountCategoryToNumber').val(ToAccount);
        if (IsActive == "Active") {
            $('#ChkIsAccountCategoryActive').prop('checked', true);
        }
        else {
            $('#ChkIsAccountCategoryActive').prop('checked', false);
        }

       
        $('#addAccountCategorypopup').modal('show');
        $('#ddlAccountNature').val(AccountNatureId).trigger('change');
    });
});
function BindDropDown() {
    var NatureRequest = {};
    NatureRequest.companyid = parseInt(CompanyId);
    Common.Ajax('POST', url + 'accountnature', JSON.stringify(NatureRequest), 'json', getaccountnatureHandler);
}
function Validation() {


    $('#AccountCategoryName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountCategoryName').focus();
        }
    });
    $('#AccountCategoryFromNumber').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountCategoryFromNumber').focus();
        }
    });
    $('#AccountCategoryToNumber').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#AccountCategoryToNumber').focus();
        }
    });



}
function GetAccountCategoryList() {
    debugger;
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.category = {};
    var Category = {};
    Category.natureid = 0;
    Category.id = 0;
    request.category = Category;

    Common.Ajax('POST', url + 'getaccountcategory', JSON.stringify(request), 'json', getaccountCategoryHandler);
}
function getaccountCategoryHandler(response) {

    var row = '';
    $("#tblAccountCategory tbody").empty();
    response.model.results.forEach(function (item) {
        row += '<tr class="EditDriver">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=CompanyID>' + item.CompanyID + '</td>' +
            '<td hidden="hidden" class=AccountNatureId>' + item.AccountNatureId + '</td>' +
            '<td hidden="hidden">' + item.CompanyName + '</td>' +

            '<td>' + item.AccountNatureName + '</td>' +
            '<td class=CategoryName>' + item.Name + '</td>' +
            '<td hidden="hidden" class="FromAccount">' + item.FromAccount + '</td>' +
            '<td hidden="hidden" class="ToAccount">' + item.ToAccount + '</td>' +
            '<td>' + item.Range + '</td>' +
            '<td class=IsActive>' + item.IsActive + '</td>' +
            '<td><a class="btn btn-warning btn-sm EditAccountCategory" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblAccountCategory tbody").append(row);
}
function getaccountnatureHandler(response) {

    var row = '';
    $('#ddlAccountNature').html('');
    row += '<option value=0>--Select--</option>';
    response.model.results.forEach(function (item) {

        row += '<option value=' + item.Id + '>' + item.Name + '</option>';
    });
    $('#ddlAccountNature').html(row);
    $("#ddlAccountNature").select2({
        dropdownParent: $("#addAccountCategorypopup")
    });
}
function SubmitAccountCategory() {
    var Isactive = false;
    if ($("#ChkIsAccountCategoryActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.CompanyID = parseInt(CompanyId);
    request.AccountNatureId = parseInt($('#ddlAccountNature').val());
    request.Code = "1";// $('#AccountCategoryCode').val();
    request.Name = $('#AccountCategoryName').val();
    request.FromAccount = $('#AccountCategoryFromNumber').val();
    request.ToAccount = $('#AccountCategoryToNumber').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'accountcategory', JSON.stringify(request), 'json', SaveAvvountCategoryHandler);
}
function UpdateAccountCategory() {
    var Isactive = false;
    if ($("#ChkIsAccountCategoryActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.Id = parseInt($('#hfAccountCategoryId').val());
    request.CompanyID = parseInt(CompanyId);
    request.AccountNatureId = parseInt($('#ddlAccountNature').val());
    request.Code = "1";// $('#AccountCategoryCode').val();
    request.Name = $('#AccountCategoryName').val();
    request.FromAccount = $('#AccountCategoryFromNumber').val();
    request.ToAccount = $('#AccountCategoryToNumber').val();
    request.IsActive = Isactive;
    request.UpdatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'accountcategory/for-edit', JSON.stringify(request), 'json', UpdateCategoryHandler);
}
function UpdateCategoryHandler(response) {
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('Account Category Updated Successfully');
        $('#addAccountCategorypopup').modal('hide');
        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }
}
function SaveAvvountCategoryHandler(response) {
    debugger;
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('Account Category Add Successfully');
        $('#addAccountCategorypopup').modal('hide');
        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function ClearAll() {

    $('#AccountCategoryFromNumber').val('');
    $('#AccountCategoryToNumber').val('');
    $('#AccountCategoryName').val('');
    $('#ddlAccountNature').val(0).trigger('change');
    $('#hfAccountCategoryId').val('');
}

