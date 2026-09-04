var UserId;
var UserName;
var CompanyId;
$(document).ready(function () {

    UserId = CommoN.getCookie("BackendUserId");
    UserName = CommoN.getCookie("BackendUserName");
    CompanyId = CommoN.getCookie("BackendCompanyID");
    if (UserId == null || typeof (UserId) == 'undefined' || UserId == "") {
      
        window.location = "../Home/Login";
    }
    $('#spanUserName').html(UserName);


    $(".numeric").keydown(function (event) {


        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }

        if ($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
            event.preventDefault();

    });
    $('.alpha').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var strigChar = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(strigChar)) {
            return true;
        }
        return false
    });
});
