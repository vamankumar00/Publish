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
  
    GetWaiterList();

    $('#bttnAddWaiters').click(function () {
        Clear();
        $('#addWaiterpopup').modal('show');
    });

    $('body').on("click", "#tblWaiterList .EditWaiter", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var request = new Object();

        request.DefaultClientId = DefaultClientId;
        request.PurchaseID = Id;
    });

    $('body').on("click", "#tblWaiterList .LogoutWaiter", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var UserName = row.find(".Waiter_UserName").html();
        var request = new Object();

        request.DefaultClientId = DefaultClientId;
        request.UserID = Id;
        request.UserName = UserName;

        waiter_url = "HOME"
        if (url.includes("HOME")) {
            waiter_url = url.replace("HOME", "Waiter");
        }
        Common.Ajax('POST', waiter_url + 'WaiterLogout', JSON.stringify(request), 'json', submitWaiterHandler);
    });

    $('#btnSaveWaiter').click(function () {
        if ($('#txtName').val() == "") {
            CommonFunction.MsgAlertN("Waiter Name Required", "Error");
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
        else {
            if ($('#hfWaiterId').val() == "") {
                AddWaiter();
            }
            else {
                UpdateWaiter();
            }

        }

    });
 
});
function AddWaiter() {
    var Isactive = false;
    if ($("#ChkIsWaiterActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.WaiterName = $('#txtName').val();
    request.Waiter_UserName = $('#txtUserName').val();
    request.Waiter_Password = $('#txtPassword').val();
    request.PhNo = $('#txtPhone').val();
    request.HomeAddress = $('#txtAddress').val();
    request.IsActive = Isactive;
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
    
    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'InsertWaiterDetail', JSON.stringify(request), 'json', submitWaiterHandler);
}
function submitWaiterHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        Clear();
        GetWaiterList();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}
function GetWaiterList() {
    var LoginRequest = new Object();

    LoginRequest.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetWaiters', JSON.stringify(LoginRequest), 'json', GetWaiterListHandler);
}
function GetWaiterListHandler(response) {
    console.log(response);
    $('#tblWaiterList > tbody').html('');
    var row = ''
    $.each(response.Data, function (i, item) {
        row += '<tr class="EditVendor">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td class=WaiterName>' + item.WaiterName + '</td>' +
            '<td class=Waiter_UserName>' + item.Waiter_UserName + '</td>' +
            '<td class=Waiter_Password>' + item.Waiter_Password + '</td>' +
            '<td class=PhNo>' + item.PhNo + '</td>' +
            '<td class=UserName>' + item.UserName + '</td>' +
            '<td class=WaiterStatus>' + item.WaiterStatus + '</td>' +
            '<td class=IsLogin>' + (item.IsLogin == 1 ? "Yes" : "No") + '</td>' +
            '<td class=LoginDate>' + item.LoginDate + '</td>' +
            '<td class=LogoutDate>' + item.LogoutDate + '</td>' +
            '<td class="text-right"><button class="btn btn-primary EditWaiter"><i class="fa fa-edit"></i>' +
            (item.IsLogin === true ? '<button class="btn btn-danger LogoutWaiter"><i class="fas fa-sign-out-alt"></i></button>' : '') + 
            '</td>' +
            '</tr>';
         //             <th>Name</th>
         //           <th>UserName</th>
         //           <th>Password</th>
         //           <th>Number</th>
         //           <th>Address</th>
         //           <th>Date</th>
         //           <th>CreatedBy</th>
         //           <th>Status</th>
         //           <th>Action</th>

    });
    $('#tblWaiterList > tbody').prepend(row);
}
function Clear() {
    $('#txtName').val('');
    $('#txtUserName').val('');
    $('#txtPassword').val('');
    $('#txtPhone').val('');
    $('#txtAddress').val('');
    $('#hfWaiterId').val('');
    $('#addWaiterpopup').modal('hide');
}