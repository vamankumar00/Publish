var url;

$(document).ready(function () {

    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    Common.Ajax('GET', url + 'accountnature', '', 'json', getaccountnatureHandler);
    $('#bttnAddAccount').click(function () {
       
        $('#addAccountNaturepopup').modal('show');
    });
});
function getaccountnatureHandler(response) {
    console.log(response);
}





