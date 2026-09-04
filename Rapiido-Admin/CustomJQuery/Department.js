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
    //BindDropDown();
    $('#bttnAddAccountCategory').click(function () {
        ClearAll();
        $('#addAccountCategorypopup').modal('show');
    });
    $('#btnSaveAccountCategory').click(function () {

        if ($('#Code').val() == "") {
            $('##Code').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Code Required');
            $('##Code').focus();

        }

        else if ($('#AccountCategoryName').val() == "") {
            $('#AccountCategoryName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Name Required');
            $('#AccountCategoryName').focus();

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
        var IsActive = row.find(".IsActive").html();
        var CategoryName = row.find(".Name").html();
        var Code = row.find(".Code").html();
        $('#hfAccountCategoryId').val(Id);
        $('#Code').val(Code);
        $('#AccountCategoryName').val(CategoryName);
        if (IsActive == "Active") {
            $('#ChkIsAccountCategoryActive').prop('checked', true);
        }
        else {
            $('#ChkIsAccountCategoryActive').prop('checked', false);
        }

       

        $('#addAccountCategorypopup').modal('show');

    });
});

function Validation() {

    $('#Code').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#Code').focus();

        }
    });
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


}
function GetAccountCategoryList() {
    debugger;
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.department = {};
    var department = {};
    department.code = '';
    department.id = 0;
    request.department = department;

    Common.Ajax('POST', url + 'getdepartment', JSON.stringify(request), 'json', getaccountCategoryHandler);
}
function getaccountCategoryHandler(response) {

    var row = '';
    $("#tblAccountCategory tbody").empty();
    response.model.results.forEach(function (item) {
        row += '<tr class="EditDriver">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=CompanyID>' + item.CompanyID + '</td>' +
            '<td hidden="hidden">' + item.CompanyName + '</td>' +
            '<td class=Code>' + item.Code + '</td>' +
            '<td class=Name>' + item.Name + '</td>' +
            '<td class=IsActive>' + item.IsActive + '</td>' +
            '<td><a class="btn btn-warning btn-sm EditAccountCategory" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblAccountCategory tbody").append(row);
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
    request.Code = $('#Code').val();
    request.Name = $('#AccountCategoryName').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'department', JSON.stringify(request), 'json', SaveAvvountCategoryHandler);
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
    request.Code = $('#Code').val();
    request.Name = $('#AccountCategoryName').val();

    request.IsActive = Isactive;
    request.UpdatedBy = parseInt(UserId);
    console.log(request);
    Common.Ajax('POST', url + 'department/for-edit', JSON.stringify(request), 'json', UpdateCategoryHandler);
}
function UpdateCategoryHandler(response) {
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('Department Updated Successfully');
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
        CommonFunction.MsgAlert('Departmen Add Successfully');
        $('#addAccountCategorypopup').modal('hide');
        ClearAll();
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }

}
function ClearAll() {

    $('#Code').val('');

    $('#AccountCategoryName').val('');
    $('#hfAccountCategoryId').val('');
    GetAccountCategoryList();
}

