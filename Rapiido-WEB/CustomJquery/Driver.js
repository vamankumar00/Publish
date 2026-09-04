$(document).ready(function () {
    var url;
    /*CommonDataform.Ajax('POST', '../data.txt','', ReadFileHandler);*/
    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    var RestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';
    Common.Ajax('POST', url + 'GetAllDriverLists', RestaurantId, 'json', AllDriverListHandler);
    $('#AddDriver').click(function () {
        var request = {};
       
        request.DriverTypeId = 1;
        request.VehicleId = 1;
        request.ResturantId = $('#SessionResturantId').val();
        request.DriverName = $('#txtDriverName').val();
        request.DriverAddress = $('#txtDriverAddress').val();
        request.NIC = $('#txtCNIC').val();
        request.CellNo = $('#txtCellNo').val();
        request.DriverNo = $('#txtVehicleNumer').val();
        request.CreatedBy = $('#SessionUserId').val();
   

        request.UserName = $('#txtUserName').val();
        request.UserPassword = $('#txtDriverPassword').val();
        

        console.log(JSON.stringify(request));
        Common.Ajax('POST', url + 'InsertDriverDetails', JSON.stringify(request), 'json', InsertDriverHandler);
    });
    $("#txtDriverSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#Driverlist_table tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $('#ClearDriver').click(function () {
        ClearAll();
    });
});
function InsertDriverHandler(response) {
    $('#Alert').show();
    $('#Alert').html(response.Message);
    var RestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';
    Common.Ajax('POST', url + 'GetAllDriverLists', RestaurantId, 'json', AllDriverListHandler);
}
function AllDriverListHandler(response) {
 
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td>' + item.DriverName + '</td><td>' + item.UserName + '</td><td>' + item.UserPassword + '</td><td>' + item.NIC + '</td><td>' + item.CellNo + '</td>' +
            '<td>' + item.DriverNo + '</td><td style = "display:none" >' + item.Id + '</td></tr>'
        /*'<td class="text-right"><button class="btn btn-primary SubCategoryEdit"><i class="fa fa-edit"></i></button><button class="btn btn-danger Delete"><i class="fa fa-trash"></i></button></td></tr>'*/


    });
    $('#Driverlist_table > tbody').prepend(row);
}
function ClearAll() {
    $('#txtDriverName').val('');
    $('#txtVehicleNumer').val('');
    $('#txtUserName').val('');
    $('#txtDriverPassword').val('');
    $('#txtCNIC').val('');
    $('#txtCellNo').val('');
    $('#txtDriverAddress').val('');
    $('#Alert').hide();
}