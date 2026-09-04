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

    var date_input = $('#ShiftDateFR'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    });

    Common.Ajax('GET', url + 'GetAllShifts?ClientId=' + DefaultClientId, DefaultClientId, 'json', bindShiftHandler);

    $("#btnSearchFR").click(function () {
        GetReport();
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

function GetReport() {

    var request = {};
    request.DefaultClientId = DefaultClientId;
    request.ShiftId = $("#ddlShiftFR").val();
    request.ShiftDate = $('#ShiftDateFR').val();
    Common.Ajax('POST', url + 'GetShiftDetailPrint', JSON.stringify(request), 'json', GetReportHandler);

}
function GetReportHandler(response) {
    console.log("Financial:" + response);
    if (response != null && response.length > 0) {
        $(".counter").text('CONSOLIDATED');
        $(".shift").text('');
        $(".gross_amount").text(response[0].TotalOrderAmount);
        $(".ent").text('0.00');
        $(".tax").text(response[0].CashTaxAmount);
        $(".discount").text(response[0].DiscountAmount);
        $(".s_charges").text('0.00');
        $(".e_charges").text('0.00');
        $(".sale_return").text('0.00');
        $(".net_sale").text(response[0].TotalOrderAmount);
        $(".credit").text(response[0].CardOrderAmount);
        $(".cash").text(response[0].CashOrderAmount);
        $(".voucher").text('0.00');
    }
    else {
        $(".counter").text('CONSOLIDATED');
        $(".shift").text('');
        $(".gross_amount").text('0.00');
        $(".ent").text('0.00');
        $(".tax").text('0.00');
        $(".discount").text('0.00');
        $(".s_charges").text('0.00');
        $(".e_charges").text('0.00');
        $(".sale_return").text('0.00');
        $(".net_sale").text('0.00');
        $(".credit").text('0.00');
        $(".cash").text('0.00');
        $(".voucher").text('0.00');
    }
}
function bindShiftHandler(response) {

    var row = '';
    row += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        row += '<option value=' + item.Id + '>' + item.Shift + "(" + item.StartTime + "-" + item.EndTime + ")" + '</option>';
    });

    $('#ddlShiftFR').html(row);

}
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