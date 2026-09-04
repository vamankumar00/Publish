var url;
$(document).ready(function () {

    //$('.MyDate').datepicker({ format: 'yyyy-mm-dd' });
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



    $('#GenerateOrderReport').click(function () {
        var RestaurantId = $('#SessionResturantId').val();
        var request = {};
        request.DefaultClientId = DefaultClientId;
        request.ResturantId = RestaurantId;
        request.FromDate = $('#OrderDetailfromDate').val();
        request.ToDate = $('#OrderDetailtoDate').val();
        Common.Ajax('POST', url + 'GetConsumptionReport', JSON.stringify(request), 'json', GetCurrentOrdersHandler);
    });
});
function GetCurrentOrdersHandler(response) {
    var row = '';
    $('#OrderMaster_table > tbody').html('');
    //console.log(response);
    $.each(response, function (i, item) {

        row += '<tr><td class=OrderId style= "display:none">' + item.ItemDesc + '</td><td class="show-details"></td><td class=OrderNo>' + item.ItemDesc + '</td><td>' + item.TotalQty + '</td><td>' + item.MaterialDesc + '</td><td>' + item.Qty + '</td><td>' + item.Consumption + '</td><td>' + item.ConsumptionUOM + '</td><td>' + item.CreatedDate + '</td>' +
            '<tr class=hideRow><td colspan=6><table class=table id=OrderDetail_table style=width:100%><thead class=thead-dark><tr><th>ItemDesc</th><th>Variation</th><th>ItemQty</th><th>Rate</th><th>Amount</th></tr></thead><tbody></tbody></table></td></tr>' +
            '</tr>'
    });

    $('#OrderMaster_table > tbody').prepend(row);

    ExpandTable();
}
function GetViewOderDetailHandler(response) {
    var DetailTable = '';
    $('#OrderDetail_table > tbody').html('');
    $.each(response, function (i, item) {
        DetailTable += '<tr><td>' + item.ItemDesc + '</td><td>' + item.Variation + '</td><td>' + item.ItemQty + '</td><td>' + item.Rate + '</td><td>' + item.Amount + '</td></tr>'

    });
    $('#OrderDetail_table > tbody').append(DetailTable);
}
function ExpandTable() {
    $('.show-details').on('click', function (e) {
        if (!$(this).hasClass('panel-collapsed')) {
            $(this).parent('tr').next().fadeIn(700);
            $(this).addClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
            var currentRow = $(this).parents("tr");
            /*alert(currentRow.find("td:eq(0)").text());*/
            var OrderMasterId = '{"Id":"' + currentRow.find("td:eq(0)").text() + '"}';
            Common.Ajax('POST', url + 'GetOrderDetail', OrderMasterId, 'json', GetViewOderDetailHandler);
        }
        else {
            $(this).parent('tr').next().fadeOut(700);
            $(this).removeClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }

        //
        // For the previous collapsed  row, if any:
        //
        var collapsed = $('.show-details.panel-collapsed').not(this);
        collapsed.parent('tr').next().fadeOut(700);
        collapsed.removeClass('panel-collapsed');
        collapsed.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    });
}