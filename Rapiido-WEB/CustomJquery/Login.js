var url;
$(document).ready(function () {
/*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/

    /*var url = 'https://localhost:44322/HOME/';*/

    // Show the loader when an AJAX request starts
    $(document).ajaxStart(function () {
        $('#loader').show();  // Show loader
    });

    // Hide the loader when the AJAX request completes
    $(document).ajaxStop(function () {
        $('#loader').hide();
    });


    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    $('#bttnLogin').click(function () {
        $('#loader').show();
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
        alert('Invalid Credentials');
    }
    if (response.HasError == true) {
        alert(response.Message);
    }
    if (response.HasError == false) {
        console.log(response);
        var WebLogin = {};
        WebLogin = response.Data.webLogin;
        console.log(WebLogin);
        if (window.location.origin == "https://app.rapiidoc.com") {
            IsOffline = 0;
        }
        else {
            IsOffline = 1;
        }
        //debugger;
        DefaultClientId = $('#defaultclientid').val();

        window.localStorage.setItem('isLogin', "1");
        window.localStorage.setItem("DefaultClientId", DefaultClientId);
        window.localStorage.setItem("UserId", WebLogin.UserId);
        window.localStorage.setItem("ResturantId", WebLogin.ResturantId);
        window.localStorage.setItem("UserName", WebLogin.UserName);
        window.localStorage.setItem("RestaurantShortName", WebLogin.RestaurantShortName);
        window.localStorage.setItem("RestaurantName", WebLogin.RestaurantName);
        window.localStorage.setItem("ISBackOffice", WebLogin.ISBackOffice);
        window.localStorage.setItem("IsOffline", IsOffline);

        sessionStorage.setItem("DefaultClientId", DefaultClientId);
        sessionStorage.setItem("UserId", WebLogin.UserId);
        sessionStorage.setItem("ResturantId", WebLogin.ResturantId);
        sessionStorage.setItem("UserName", WebLogin.UserName);
        sessionStorage.setItem("RestaurantShortName", WebLogin.RestaurantShortName);
        sessionStorage.setItem("RestaurantName", WebLogin.RestaurantName);
        sessionStorage.setItem("ISBackOffice", WebLogin.ISBackOffice);
        sessionStorage.setItem("IsOffline", IsOffline);
        window.location = "../Dinein/Dinein";
       /* Common.Ajax('POST', "LoginResponse", JSON.stringify(WebLogin), 'json', SessionHandler);*/
        /*window.location = "../Home/Index";*/
    }
}
function SessionHandler(response) {
    console.log(response);
    if (response == "success") {
        /*window.location = "../Home/Index";*/
        window.location = "../Dinein/Dinein";
    }
}