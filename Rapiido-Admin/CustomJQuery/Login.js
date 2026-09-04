var url;
$(document).ready(function () {


    var urls = ['../Data.txt', 'Data.txt', '/Data.txt', '../data.txt', '/data.txt', 'data.txt'];
    for (var i = 0; i < urls.length; i++) {
        $.ajax({
            url: urls[i],
            async: false,
            cache: false,
            dataType: "text",
            success: function (data) {
                if (data && data.trim()) {
                    url = data.trim();
                }
            }
        });
        if (url) break;
    }
    $('#bttnLogin').click(function () {
        Login(url + 'SignInWebApp');
        
    });
});
function Login(URL) {
    var LoginRequest = new Object();
    LoginRequest.UserName = $('#username').val();
    LoginRequest.UserPassword = $('#password').val();
    LoginRequest.DefaultClientId = $('#defaultclientid').val();  //DefaultClientId;
    Common.Ajax('POST', URL, JSON.stringify(LoginRequest), 'json', LoginHandler);
}
function LoginHandler(response) {
  

    if (response.Message == "Invalid Credentials") {
        CommonFunction.MsgAlert('Invalid Credentials');
    }
    if (response.HasError == true) {
        CommonFunction.MsgAlert(response.Message);
    }
    if (response.HasError == false) {
        console.log(response);
        var WebLogin = {};
        WebLogin = response.Data.webLogin;

        DefaultClientId = $('#defaultclientid').val();

        window.localStorage.setItem("DefaultClientId", DefaultClientId);
        sessionStorage.setItem("DefaultClientId", DefaultClientId);

        CommoN.setCookie("DefaultClientId", DefaultClientId);
        CommoN.setCookie("BackendUserId", WebLogin.UserId);
        CommoN.setCookie("BackendResturantId", WebLogin.ResturantId);
        CommoN.setCookie("BackendUserName", WebLogin.UserName);
        CommoN.setCookie("BackendRestaurantShortName", WebLogin.RestaurantShortName);
        CommoN.setCookie("BackendRestaurantName", WebLogin.RestaurantName);
        window.location = "../Home/Index";

    }
}
