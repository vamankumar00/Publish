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
  
    GetWebUserList();

    $('#bttnAddUsers').click(function () {
        console.log("Btn clicked");
        ClearFieldValues();
        $('#addUserpopup').modal('show');
    });

    $('body').on("click", "#tblUserList .EditWebUser", function () {

        console.log("Edit button Clicked");

        var row = $(this).closest("tr");
        
        var IsActive = row.find(".WebUserStatus").html();
        if (IsActive == 'Active') {
            $('#ChkIsUserActive').prop('checked', true);
        }
        else {
            $('#ChkIsUserActive').prop('checked', false);
        }

        $('#hfUserId').val(row.find(".Id").html());
        $('#txtName').val(row.find(".Fname").html());
        $('#txtUserName').val(row.find(".UserName").html());
        $('#txtPassword').val(row.find(".UserPassword").html());
        
        $('#txtPassword').attr('readonly', true);

        var ISBackOffice = row.find(".ISBackOffice").html();

        if (ISBackOffice == '1') {
            $('#radioBackOfficeYes').prop('checked', true);}
        else {
        $('#radioBackOfficeNo').prop('checked', true);
    }

        $('#txtPhone').val(row.find(".MobileNo").html());
        $('#addUserpopup').modal('show');
    });
    $('body').on("click", "#tblUserList .LogoutWebUser", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var UserId = row.find(".UserId").html();
        var UserName = row.find(".UserName").html();
        var request = new Object();

        request.DefaultClientId = DefaultClientId;
        request.UserId = UserId;

        Common.Ajax('POST', url + 'LogoutWeb', JSON.stringify(request), 'json', submitWebUserHandler);
    });

    $('#btnSaveUser').click(function () {
        if ($('#txtName').val() == "") {
            CommonFunction.MsgAlertN("Name Required", "Error");
            $('#txtName').focus();
        }
        else if ($('#txtUserName').val() == "") {
            CommonFunction.MsgAlertN("User Name Required", "Error");
            $('#txtUserName').focus();
        }
        else if ($('#txtPassword').val() == "") {
            CommonFunction.MsgAlertN("Password Required", "Error");
            $('#txtPassword').focus();
        }
        else if ($('#txtPhone').val() == "") {
            CommonFunction.MsgAlertN("Password Required", "Error");
            $('#txtPhone').focus();
        }
        else {
            if ($('#hfUserId').val() == "") {
                AddUser();
            }
            else {
                UpdateUser();
            }

        }

    });
 
});
function AddUser() {
    var Isactive = false;
    if ($("#ChkIsUserActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.Fname = $('#txtName').val();
    request.UserName = $('#txtUserName').val();
    request.UserPassword = $('#txtUserPassword').val();
    request.MobileNo = $('#txtPhone').val();
    request.ISBackOffice = $('input[name="IsBackOffice"]:checked').val();
    request.WebUserStatus = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'InsertWebUserDetail', JSON.stringify(request), 'json', submitWebUserHandler);
}

function UpdateUser() {

    var Isactive = false;
    if ($("#ChkIsUserActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.UserId = $('#hfUserId').val();
    request.Fname = $('#txtName').val();
    request.UserName = $('#txtUserName').val();
    request.UserPassword = $('#txtUserPassword').val();
    request.MobileNo = $('#txtPhone').val();
    request.ISBackOffice = $('input[name="IsBackOffice"]:checked').val();
    request.WebUserStatus = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('PUT', url + 'UpdateWebUserDetail', JSON.stringify(request), 'json', submitWebUserHandler);
}
function submitWebUserHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearFieldValues();
        GetWebUserList();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}
function GetWebUserList() {
    var LoginRequest = new Object();

    LoginRequest.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetWebUsers', JSON.stringify(LoginRequest), 'json', GetWebUserListHandler);
}
function GetWebUserListHandler(response) {
    console.log(response);
    $('#tblUserList > tbody').html('');
    var row = ''
    $.each(response.Data, function (i, item) {
        row += '<tr class="EditWebUserList">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=UserId>' + item.UserId + '</td>' +
            '<td class=Fname>' + item.Fname + '</td>' +
            '<td class=UserName>' + item.UserName + '</td>' +
            '<td class=UserPassword>' + item.UserPassword + '</td>' +
            '<td class=MobileNo>' + item.MobileNo + '</td>' +
            '<td class=ISBackOffice>' + item.ISBackOffice + '</td>' +
            '<td class=WebUserStatus>' + item.WebUserStatus + '</td>' +
            '<td class=IsLogin>' + (item.IsLogin == 1 ? "Yes" : "No")  + '</td>' +
            '<td class=LoginDate>' + item.LoginDate + '</td>' +
            '<td class=LogoutDate>' + item.LogoutDate + '</td>' +
            '<td class="text-right"><button class="btn btn-primary EditWebUser"><i class="fa fa-edit"></i>' +
            (item.IsLogin === true ? '<button class="btn btn-danger LogoutWebUser"><i class="fas fa-sign-out-alt"></i></button>' : '') + 
            '</td>' +
            '</tr>';
    });
    $('#tblUserList > tbody').prepend(row);
}

function ClearFieldValues() {
    $('#txtName').val('');
    $('#txtUserName').val('');
    $('#txtPassword').val('');
    $('#txtPassword').val('').attr('readonly', false);
    $('#txtPhone').val('');
    $('#hfUserId').val('');
    $('#addUserpopup').modal('hide');
}