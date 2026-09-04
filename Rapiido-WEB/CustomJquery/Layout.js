

$(document).ready(function () {
    GetSessionValue();
    //debugger;
    var checkLogin = window.localStorage.getItem('isLogin');
    if (checkLogin == null || checkLogin === undefined) {
        if (checkLogin != "1") {
            window.location = "../Login/Login";
        }
    }
    //if ($('#SessionUserId').val() == '') {
    //    window.location = "../Login/Login";
    //}
});


function GetSessionValue() {
    //var UserId = sessionStorage.getItem("UserId");
    //var ResturantId = sessionStorage.getItem("ResturantId");
    //var UserName = sessionStorage.getItem("UserName");
    //var RestaurantShortName = sessionStorage.getItem("RestaurantShortName");
    //var RestaurantName = sessionStorage.getItem("RestaurantName");

    var UserId = window.localStorage.getItem("UserId");
    var ResturantId = window.localStorage.getItem("ResturantId");
    var UserName = window.localStorage.getItem("UserName");
    var RestaurantShortName = window.localStorage.getItem("RestaurantShortName");
    var RestaurantName = window.localStorage.getItem("RestaurantName");

    $('#SessionUserId').val(UserId);
    $('#SessionResturantId').val(ResturantId);
    $('#SessionUserName').val(UserName);
    $('#SessionRestaurantShortName').val(RestaurantShortName);
    $('#SessionRestaurantName').val(RestaurantName);


}

// Function to display connectivity status
//function updateGlobalStatus(message, color) {
//    const statusDiv = document.getElementById('globalStatus');
//    statusDiv.innerText = message;
//    statusDiv.style.backgroundColor = color;
//    statusDiv.style.display = 'block';
//}

//// Function to hide the status bar after a few seconds
//function hideGlobalStatus() {
//    const statusDiv = document.getElementById('globalStatus');
//    setTimeout(() => {
//        statusDiv.style.display = 'none';
//    }, 3000); // Hide after 3 seconds
//}

//// Check connectivity
//function checkConnectivity() {
//    if (!navigator.onLine) {
//        updateGlobalStatus('No Internet! Check Your Connection', '#fff3ce');
//    }
//    //    else {
//    //    updateGlobalStatus('Connected to the Internet.', 'green');
//    //    hideGlobalStatus();
//    //}
//}

//// Check internet speed
//async function checkSpeed() {
//    try {
//        const startTime = performance.now();
//        await fetch('/Home/Ping', { method: 'HEAD', cache: 'no-store' });
//        const duration = performance.now() - startTime;

//        if (duration > 2000) { // Threshold for slow connection
//            updateGlobalStatus('Internet connection is slow!', '#fff3ce');
//        } else {
//            hideGlobalStatus();
//        }
//    }
//    catch (error) {
//        updateGlobalStatus('No Internet! Check Your Connection', '#fff3ce');
//    }
//}

//// Periodic monitoring
//setInterval(() => {
//    checkConnectivity();
//    checkSpeed();
//}, 10000); // Check every 10 seconds

//// Initial checks
//checkConnectivity();
//checkSpeed();

//// Monitor connectivity changes
//window.addEventListener('online', () => {
//    updateGlobalStatus('Connected to the Internet.', '#b8e1a3');
//    hideGlobalStatus();
//});
//window.addEventListener('offline', () => {
//    updateGlobalStatus('No Internet Connection!', '#fff3ce');
//});

if (typeof clientIp === 'undefined' ||
    (clientIp !== '172.16.16.2' && clientIp !== '127.0.0.1' && clientIp !== '::1')) {
    // Function to display connectivity status
    function updateGlobalStatus(message, color) {
        const statusDiv = document.getElementById('globalStatus');
        statusDiv.innerText = message;
        statusDiv.style.backgroundColor = color;
        statusDiv.style.display = 'block';
    }

    // Function to hide the status bar after a few seconds
    function hideGlobalStatus() {
        const statusDiv = document.getElementById('globalStatus');
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // Check connectivity
    function checkConnectivity() {
        if (!navigator.onLine) {
            updateGlobalStatus('No Internet! Check Your Connection', '#fff3ce');
        }
    }

    // Check internet speed
    async function checkSpeed() {
        try {
            const startTime = performance.now();
            await fetch('/Home/Ping', { method: 'HEAD', cache: 'no-store' });
            const duration = performance.now() - startTime;

            if (duration > 2000) {
                updateGlobalStatus('Internet connection is slow!', '#fff3ce');
            } else {
                hideGlobalStatus();
            }
        } catch (error) {
            updateGlobalStatus('No Internet! Check Your Connection', '#fff3ce');
        }
    }

    // Periodic monitoring
    setInterval(() => {
        checkConnectivity();
        checkSpeed();
    }, 10000);

    // Initial checks
    checkConnectivity();
    checkSpeed();

    // Monitor connectivity changes
    window.addEventListener('online', () => {
        updateGlobalStatus('Connected to the Internet.', '#b8e1a3');
        hideGlobalStatus();
    });

    window.addEventListener('offline', () => {
        updateGlobalStatus('No Internet Connection!', '#fff3ce');
    });
}


