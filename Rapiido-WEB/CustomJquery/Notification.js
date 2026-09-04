if (window.localStorage.getItem("IsOffline") == 0) {
    var url;
    $(function () {
        $.ajax({
            url: '../data.txt',
            async: false,   // asynchronous request? (synchronous requests are discouraged...)
            cache: false,   // with this, you can force the browser to not make cache of the retrieved data
            dataType: "text",  // jQuery will infer this, but you can set explicitly
            success: function (data, textStatus, jqXHR) {
                url = data;
            }
        });
        var token = null;
        //var config = {
        //    apiKey: "AIzaSyAvgBCG4XHU-0LHWlkamGuStKiob0LdT0M",
        //    authDomain: "mvcwithandroid.firebaseapp.com",
        //    databaseURL: "https://mvcwithandroid-default-rtdb.firebaseio.com/",
        //    projectId: "mvcwithandroid",
        //    storageBucket: "mvcwithandroid.appspot.com",
        //    messagingSenderId: "211019319524",
        //    appId: "1:211019319524:web:ee83f718742db68460c4f1",
        //    measurementId: "G-20D7LELFKG"

        //};
        var config = {
            apiKey: "AIzaSyCFsw_k-e4T2wt1Deewq2zuGiyeemS5mxg",
            authDomain: "rapiido-3ba11.firebaseapp.com",
            projectId: "rapiido-3ba11",
            storageBucket: "rapiido-3ba11.appspot.com",
            messagingSenderId: "640585084960",
            appId: "1:640585084960:web:6aa15d2bc197b1b862cc45",
            measurementId: "G-QM01D1Y6M8"
        };
        firebase.initializeApp(config);

        const messaging = firebase.messaging();

        messaging.requestPermission()
            .then(function () {
                console.log("granted");
                if (isTokenSentToServer()) {
                    console.log("already granted");
                    getRegtoken();

                } else {

                    getRegtoken();
                }
            });
        function getRegtoken() {
            messaging.getToken({ vapidKey: 'BGM0CHQyQXEVN8GequTOTHNLTtxxhbgS4kjW3Yad3-oS903jnYVeUpk8xqoB5NJ8a8LC8BEGa8N7t-eMTLbweCE' }).then((currentToken) => {
                //messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    console.log(currentToken);
                    UpdateDeviceId(currentToken);
                    setTokenSentToServer(true);
                    /*saveToken(currentToken)*/
                    //updateUIForPushEnabled(currentToken);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                    setTokenSentToServer(false);
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                setTokenSentToServer(false);
            });

        }
        function setTokenSentToServer(sent) {
            window.localStorage.setItem('sentToServer', sent ? 1 : 0);
        }
        function isTokenSentToServer() {
            return window.localStorage.getItem('sentToServer') === '1';
        }
        messaging.onMessage(function (payload) {
            //GetTodayOrder();
            //debugger;
            var CurrentPage = window.location.pathname;


            if (CurrentPage.includes("OrderList")) {
                GetOrderListReport();
            }
            if (CurrentPage.includes("Dinein")) {
                GetTotalSales();
            }

            console.log('Message received. ', payload);

            notificationTitle = payload.notification.title;
            notificationOptions = {
                title: payload.notification.title,
                body: payload.notification.body
                /*icon: payload.notification.icon*/
            };

            var notification = new Notification(notificationTitle, notificationOptions);

        });

    });
    function GetTodayOrder() {

        /*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/
        /*var url = 'https://localhost:44322/HOME/';*/
        GetCurrentOrder(url);
        AvailableDrivers(url);
        DriverOnJobs(url);
        //alert('Moazzam');
    }
    function UpdateDeviceId(DeviceId) {
        /*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/
        /*var url = 'https://localhost:44322/HOME/';*/
        //debugger;
        var request = {};
        request.ResturantId = $('#SessionResturantId').val();
        request.UserId = $('#SessionUserId').val();
        request.DeviceId = DeviceId;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'UpdateWebDeviceId', JSON.stringify(request), 'json', UpdateDeviceIdHandler);
    }
    function UpdateDeviceIdHandler(response) {
        console.log(response);
    }

}
else
{
    var WDApp = function () {
        var self = this;
        self.ws = {};

        self.onopne = function () {
            $(".connStatus").html("connected");
        };

        self.onmessage = function (event) {

            if (event.data instanceof ArrayBuffer) {
                var binary = '';
                var bytes = new Uint8Array(event.data);
                for (var i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                // Add image
                $(".note").find("ul").append("<li><span class=\"unchecked\"></span><span class=\"todo\"><img src=\"data:image/png");
            }
            console.log("Raw message from WebSocket:", event.data);

            var returnAction;
            try {
                returnAction = JSON.parse(event.data);
            } catch (e) {
                console.error("Non-JSON message received from WebSocket:", event.data);
                return;
            }

            //alert(returnAction.Message);
            if (returnAction && returnAction.message && returnAction.message.notification) {
                showBrowserNotification(returnAction.message.notification.title);
            }

            if (returnAction.Action == "new") {
                $(".note").find("ul").append("<li><span class=\"unchecked\"></span><span class=\"todo\">"
                    + returnAction.Message + "</span><span class=\"delete\"></span></li>");

                // Optionally, you can use browser notification API for desktop notifications
                showBrowserNotification(returnAction.Message);

            } else if (returnAction.Action == "check") {
                var item = $("ul").find("li:nth-child(" + (parseInt(returnAction.Message) + 1) + ")").find("span:first");
                item.removeClass("unchecked");
                item.addClass("checked");
            } else if (returnAction.Action == "uncheck") {
                var item = $("ul").find("li:nth-child(" + (parseInt(returnAction.Message) + 1) + ")").find("span:first");
                item.removeClass("checked");
                item.addClass("unchecked");
            } else if (returnAction.Action == "delete") {
                var item = $("ul").find("li:nth-child(" + (parseInt(returnAction.Message) + 1) + ")");
                item.remove();
            }
            //yahan add kara hai
            var CurrentPage = window.location.pathname;
            if (CurrentPage.includes("OrderList")) {
                GetOrderListReport();
            }
            if (CurrentPage.includes("Dinein")) {
                GetTotalSales();
            }

            console.log('Message received. ', event.data);
            //yahan tk

            //$(".connStatus").html("connection error");
        };

        self.onerror = function (evt) {
            $(".connStatus").html("disconnected");
        };

        self.onclose = function (evt) {

        };

        self.init = function () {
            //debugger;
            var port = window.location.port;
            port = 8010;

            if ('WebSocket' in window) {
                self.ws = new WebSocket("ws://" + window.location.hostname + ":" + (port == "" ? "80" : port) +
                    "/api/WebSocket?UserId=" + window.localStorage.getItem("UserId") +
                    "&RestaurantId=" + window.localStorage.getItem("ResturantId") +
                    "&DefaultClientId=" + window.localStorage.getItem("DefaultClientId"));
            } else if ('MozWebSocket' in window) {
                self.ws = new WebSocket("ws://" + window.location.hostname + ":" + (port == "" ? "80" : port) +
                    "/api/WebSocket?UserId=" + window.localStorage.getItem("UserId") +
                    "&RestaurantId=" + window.localStorage.getItem("ResturantId") +
                    "&DefaultClientId=" + window.localStorage.getItem("DefaultClientId"));
            } else {
                return;
            }

            self.ws.binaryType = "arraybuffer";
            $(".connStatus").html("connecting....");
            self.setupSocketEvents();
            self.setupDomEvents();
        };

        self.send = function (action, message) {
            if (self.ws.readyState == WebSocket.OPEN) {
                var str = JSON.stringify({
                    Action: action,
                    Message: message
                });
                self.ws.send(str);
            }
        };

        self.close = function () {

        };

        self.setupDomEvents = function () {

            $("#add_image").change(function (event) {
                var fileReader = new FileReader();
                fileReader.readAsArrayBuffer($("#add_image")[0].files[0]);
                fileReader.onload = function (e) {
                    self.ws.send(e.target.result);
                };
            });
            $(document.body).delegate("span.delete", "click", function () {
                var pos = $(this).parent().index();
                self.send("delete", pos);
            });
            $(document.body).delegate("span.checked", "click", function () {
                var pos = $(this).parent().index();
                self.send("uncheck", pos);
            });
            $(document.body).delegate("span.unchecked", "click", function () {
                var pos = $(this).parent().index();
                self.send("check", pos);
            });
            $(".new_todo").keydown(function (event) {
                if (event.keyCode == 13) {
                    var message = $(this).val();
                    if (message != "")
                        self.send("new", message);

                    $(".new_todo").val("");
                    return false;
                }
            });
        }

        self.setupSocketEvents = function () {
            self.ws.onopen = function (evt) { self.onopne(evt); };
            self.ws.onmessage = function (evt) { self.onmessage(evt); };
            self.ws.onerror = function (evt) { self.onerror(evt); };
            self.ws.onclose = function (evt) { self.onclose(evt); };
        }
    }

    if ('WebSocket' in window || 'MozWebSocket' in window) {
        var wdApp;
        wdApp = new WDApp();
        wdApp.init();
    } else {
        $("section").remove();
        $("header").html("Your browser doesn't support WebSockets. ");
    }

    function showBrowserNotification(message) {
        // Check if Notification permission is granted
        if (Notification.permission === "granted") {
            new Notification(message);
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }


}