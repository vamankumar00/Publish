var url;
var currentPage = 1;
var pageSize = 10;
$(document).ready(function () {
    GetOrderListReport();
    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
   
    //setInterval(function () {
    //    GetOrderListReport();
    //},2000);

    //var today = new Date();
    //var formattedDate = today.toISOString().split('T')[0];
    //$("#OrderDetailfromDate").val(formattedDate);
    //$("#OrderDetailtoDate").val(formattedDate);
//new
	// Create a new date object
var today = new Date();

// Convert to Pakistani time by adding 5 hours (UTC+5)
today.setHours(today.getHours() + (today.getTimezoneOffset() / 60) + 5);

// Format the date as YYYY-MM-DD
var year = today.getFullYear();
var month = String(today.getMonth() + 1).padStart(2, '0');
var day = String(today.getDate()).padStart(2, '0');
var formattedDate = `${year}-${month}-${day}`;

// Set the formatted date in the input fields
$("#OrderDetailfromDate").val(formattedDate);
$("#OrderDetailtoDate").val(formattedDate);

    var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';

    Common.Ajax('POST', url + 'GetOrderTypes', CientId, 'json', BindOrderTypesHandlerOL);

    //$(document).ajaxStart(function () {
    //    $('#loader').show();  // Show loader
    //});

    // Hide the loader when the AJAX request completes
    $(document).ajaxStop(function () {
        $('#loader').hide();
    });

    $('#HFOrderMasterId').val('');
    GetOrderListReport();

    $('#GenerateOrderReport').click(function () {
        $('#loader').show();
        $('#HFOrderMasterId').val('');
        GetOrderListReport();
    });

    $("#OrderMaster_table").on('click', '.View', function () {
        $('#loader').show();
        $('#HFOrderMasterId').val('');
        var currentRow = $(this).parents("tr");
        var OrderId = currentRow.find("td:eq(0)").text();
        var JobRefNo = currentRow.find(".JobRefNo").text();
        $(".ordernoOM").text(JobRefNo);
        /*var OrderMasterId = '{"Id":"' + OrderId + '"}';*/
        var request = {};
        request.OrderId = OrderId;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetOrderDetail', JSON.stringify(request), 'json', GetViewOderDetailHandler);
        $('#ViewOrder').modal('show');
    });

    $("#OrderMaster_table").on('click', '.RatingView', function () {
        $('#loader').show();
        $('#HFOrderMasterId').val('');
        var currentRow = $(this).parents("tr");
        var OrderId = currentRow.find("td:eq(0)").text();
        /*var OrderMasterId = '{"Id":"' + OrderId + '"}';*/
        var request = {};
        request.OrderId = OrderId;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetRatingDetail', JSON.stringify(request), 'json', GetViewRatings);
        $('#ViewRating').modal('show');
    });

    $("#OrderMaster_table").on('click', '.Payment', function () {
        $('#loader').show();
        $('#HFOrderMasterId').val('');
        var currentRow = $(this).parents("tr");
        var OrderId = currentRow.find("td:eq(0)").text();
        var NetAmount = currentRow.find(".NetAmount").text();
        var PaymentType = currentRow.find(".PaymentType").text();
        var JobRefNo = currentRow.find(".JobRefNo").text();
        var OrderAmount = currentRow.find(".OrderAmount").text();
        var TaxPer = currentRow.find(".TaxPer").text();
        var DiscountPer = currentRow.find(".DiscountPer").text();
        var DiscountAmount = currentRow.find(".DiscountAmount").text();
        var OrderStatus = currentRow.find(".OrderStatus").text();

        var request = {};
        request.OrderId = OrderId;
        request.DefaultClientId = DefaultClientId;
        request.NetAmount = NetAmount;
        request.PaymentType = PaymentType;
        request.JobRefNo = JobRefNo;
        request.OrderAmount = OrderAmount;
        request.TaxPer = TaxPer;
        request.DiscountPer = DiscountPer;
        request.DiscountAmount = DiscountAmount;
        request.OrderStatus = OrderStatus;
        GetViewPaymentReceive(request);

        var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
        Common.Ajax('POST', url + 'GetBankDiscounts', CientId, 'json', GetBankDiscountsHandler);
        $(".BankDetails").hide();
        $('#ViewPaymentReceive').modal('show');
    });

    $("#ddlPaymentType").change(function () {

        OrderAmount = $('#txtOrderAmount').val();
        DiscountPer = $('#hfDiscountPer').val();
        TaxPer = $('#hfTaxPer').val();
        NetAmount = $('#txtNetAmount').val();

        if ($("#ddlPaymentType").val() == "CARD") {
            $(".BankDetails").show();
            var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
            Common.Ajax('POST', url + 'GetBankDiscounts', CientId, 'json', GetBankDiscountsHandler);

        }
        else {
            GetNetAmount(DiscountPer);
            $(".BankDetails").hide();
        }
    });

    $("#ddlBank").change(function () {

        var dataId = $(this).find(':selected').data('discountper');
        GetNetAmount(dataId);
    });

    $("#OrderMaster_table").on('click', '.AssignWaiter', function () {
        $('#loader').show();
        var currentRow = $(this).parents("tr");
        var OrderId = currentRow.find("td:eq(0)").text();
        var JobRefNo = currentRow.find(".JobRefNo").text();
        $('#HFOrderMasterId').val(OrderId);
        $(".ordernoW").text(JobRefNo);


        var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
        Common.Ajax('POST', url + 'GetWaiters', CientId, 'json', GetWaitersHandler);

        $('#AssignWaiterModal').modal('show');
    });

    $("#OrderMaster_table").on('click', '.Print', function () {
        var currentRow = $(this).parents("tr");
        var OrderId = currentRow.find("td:eq(0)").text();
        $('#HFOrderMasterId').val(OrderId);
        $('#bttnYes').html('Print');
        $('#Msg').html("Sure, you want to print this receipt?");
        $('#SavePopup').modal('show');
    });
    $('#bttnYes').click(function () {
        $('#loader').show();
        var request = {};
        request.OrderId = $('#HFOrderMasterId').val();
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'PrintOrder', JSON.stringify(request), 'json', ReprintHandler);
    });
    $('#SubmitPayment').click(function () {
        $('#loader').show();
        $(this).prop('disabled', true);
        if ($('#ddlPaymentType').val() == "0" || $('#ddlPaymentType').val() == "") {
           
            CommonFunction.MsgAlert('Payment Type Required');
            $('#ddlPaymentType').css('border-color', 'red');
            $('#ddlPaymentType').focus();
            return false;
        }

        if ($('#txtRecamt').val() == "") {
            CommonFunction.MsgAlert('Amount is Required');
            $('#txtRecamt').css('border-color', 'red');
            $('#txtRecamt').focus();
            return false;
        }


        var payment = {};
        payment.OrderId = $("#OrderId").val();
        payment.OrderNo = $(".orderno").text();
        payment.PaymentType = $('#ddlPaymentType').val();
        payment.BankId = $('#ddlBank').find(':selected').data('bankid');
        payment.BankName = $('#ddlBank').find(':selected').data('bankname');
        payment.CardType = $('#ddlBank').find(':selected').data('cardtype');
        payment.DiscountPer = $('#ddlBank').find(':selected').data('discountper');
        payment.DiscountAmount = $('#hfDiscountAmount').val();
        payment.BankDiscountId = $('#ddlBank').val();
        payment.AmountRec = $('#txtRecamt').val();
        payment.Ordernetamount = $('#txtNetAmount').val();
        payment.Recby = window.localStorage.getItem("UserId"); //sessionStorage.getItem("UserId");
        payment.PaymentCollectionRemarks = $('#txtRemarks').val();
        payment.DefaultClientId = DefaultClientId;
        payment.OrderStatus = $("#hfOrderStatus").val();
        payment.IsOffline = window.localStorage.getItem("IsOffline");
        //console.log(JSON.stringify(payment));
        Common.Ajax('POST', url + 'PaymentRecFromWeb', JSON.stringify(payment), 'json', AddPaymentHandler);
    });

    $('#SubmitWaiter').click(function () {
        $('#loader').show();
        if (($('#ddlWaiter').val() == "0" || $('#ddlWaiter').val() == "") && ($('#ddlWaiterCollection').val() == "0" || $('#ddlWaiterCollection').val() == "")) {
            if ($('#ddlWaiter').val() == "0" || $('#ddlWaiter').val() == "") {
                CommonFunction.MsgAlert('Waiter Required');
                $('#ddlWaiter').css('border-color', 'red');
                $('#ddlWaiter').focus();
                return false;
            }

            if ($('#ddlWaiterCollection').val() == "0" || $('#ddlWaiterCollection').val() == "") {
                CommonFunction.MsgAlert('Waiter Required');
                $('#ddlWaiterCollection').css('border-color', 'red');
                $('#ddlWaiterCollection').focus();
                return false;
            }
            return false;
        }
        else {

            var request = {};
            request.OrderId = $("#HFOrderMasterId").val();
            request.OrderNo = $(".ordernoW").text();
            request.WaiterId = $('#ddlWaiter').find(':selected').data('waiterid');
            request.WaiterName = $('#ddlWaiter').find(':selected').data('waitername');
            request.PaymentReceiveBy = $('#ddlWaiterCollection').find(':selected').data('waiterid');
            request.PaymentReceiveByName = $('#ddlWaiterCollection').find(':selected').data('waitername');
            request.DefaultClientId = DefaultClientId;
            console.log(JSON.stringify(request));
            Common.Ajax('POST', url + 'AssignWaiterFromWeb', JSON.stringify(request), 'json', AssignWaiterHandler);
        }
    });


});

function AddPaymentHandler(response) {
    if (response.HasError = false) {
        $('#ViewPaymentReceive').modal('hide');

    }
    else {
        $("#SubmitPayment").prop('disabled', false);
        $('#ViewPaymentReceive').modal('hide');
    }
    CommonFunction.MsgAlert(response.Message);
    GetOrderListReport();
}
function AssignWaiterHandler(response) {
    if (response.HasError = false) {
        $('#AssignWaiterModal').modal('hide');

    }
    else {
        $('#AssignWaiterModal').modal('hide');
    }
    CommonFunction.MsgAlert(response.Message);
    //GetOrderListReport();
}
function GetBankDiscountsHandler(response) {

    var bank = '';
    $('#ddlBank').html(bank);
    bank += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        bank += '<option data-BankId=' + item.BankId + ' data-BankName="' + item.BankName + '" data-CardType="' + item.CardType + '" data-DiscountPer= ' + item.DiscountPer + ' value=' + item.BankDiscountId + '>' + item.BankName + " - " + item.CardType + " - " + item.DiscountPer + ' %</option>';
    });
    $('#ddlBank').html(bank);

    //var card = '';
    //$('#ddlCardType').html(card);
    //card += "<option value =''>Select</option>";
    //$.each(response, function (i, item) {
    //    card += '<option data-BankId=' + item.CardType + ' value=' + item.Id + '>' + item.CardType + " - " + '</option>';
    //});
    //$('#ddlCardType').html(card);
        
}
function GetWaitersHandler(response) {

    var waiter = '';
    $('#ddlWaiter').html(waiter);
    $('#ddlWaiterCollection').html(waiter);
    waiter += "<option value =''>Select</option>";
    $.each(response.Data, function (i, item) {
        waiter += '<option data-WaiterId=' + item.Id + ' data-WaiterName="' + item.WaiterName + '" value=' + item.Id + '>' + item.WaiterName + ' </option>';
    });
    $('#ddlWaiter').html(waiter);
    $('#ddlWaiterCollection').html(waiter);

}
function ReprintHandler(response) {
    $('#HFOrderMasterId').val('');
    CommonFunction.MsgAlert(response);
    $('#SavePopup').modal('hide');
}
function GetViewOderDetailHandler(response) {

    var row = '';
    var tot = 0;
    $('#tblOrderDetails > tbody').html('');
    $.each(response, function (i, item) {
        tot += item.Amount;
        row += '<tr><td>' + item.ItemDesc + '</td><td>' + item.ShortDesc + '</td><td>' + item.Option1Desc + '</td><td>' + item.Variation + '</td><td>' + item.Notes + '</td><td>' + item.ItemQty + '</td><td>' + item.Rate + '</td><td>' + item.Amount + '</td></tr>'

    });
    row += '<tr><td colspan = 6 ></td><td><b>TOTAL: </b></td><td>' + tot + '</td></tr>';
    $('#tblOrderDetails').append(row);
}

function GetViewRatings(response) {

    var row = '';
    var tot = 0;
    $('#tblRatingDetails > tbody').html('');
    $.each(response, function (i, item) {
     
        row += '<tr><td>' + item.Category + '</td><td hidden class="Rating">' + item.Rating + '</td><td><td></tr>'

    });
    
    $('#tblRatingDetails').append(row);


    $("#tblRatingDetails TBODY TR").each(function () {
        var row = $(this);
        var Rating = row.find("TD").eq(1).html();
        row.find("td").eq(2).html('<td><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        if (Rating == 1) {
            row.find("td").eq(2).html('');
            row.find("td").eq(2).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 2) {
            row.find("td").eq(2).html('');
            row.find("td").eq(2).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 3) {
            row.find("td").eq(2).html('');
            row.find("td").eq(2).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 4) {
            row.find("td").eq(2).html('');
            row.find("td").eq(2).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 5) {
            row.find("td").eq(2).html('');
            row.find("td").eq(2).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span></td>');
        }

    });



}

function GetViewPaymentReceive(response) {

    $("#txtRecamt").val('');

    $('#ddlPaymentType').val(response.PaymentType);
    $('#txtNetAmount').val(response.NetAmount);
    $('#txtOrderAmount').val(response.OrderAmount);
    $('#hfTaxPer').val(response.TaxPer);
    $('#hfDiscountPer').val(response.DiscountPer);
    $('#hfDiscountAmount').val(response.DiscountAmount);
    $('#txtRemarks').val('');
    $(".orderno").text(response.JobRefNo);
    $("#OrderId").val(response.OrderId);
    $("#hfOrderStatus").val(response.OrderStatus);
}


function GetOrderListReport(pageNumber = 1) {
    currentPage = pageNumber;
    var request = {};
    request.DefaultClientId = DefaultClientId;
    request.OrderStatus = $('#ddlOrderStatus').val();
    request.IsWeb = $('#ddlOrderFrom').val();
    request.FromDate = $('#OrderDetailfromDate').val();
    request.ToDate = $('#OrderDetailtoDate').val();
    request.OrderNo = $('#OrderDetailorderNo').val();
    request.CustomerName = $('#OrderDetailcustomerName').val();
    request.OrderTypeId = $('#ddlOrderType').val();
    request.PaymentStatus = $('#ddlPaymentStatus').val();
    request.PageNumber = currentPage;
    request.PageSize = pageSize;

    Common.Ajax('POST', url + 'GetAllDineinOrders', JSON.stringify(request), 'json', GetOrderListHandler);
}
function GetOrderListHandler(response) {
    //console.log(response);
    
    var row = '';
    var totalwithdiscount = 0;
    var discountamount = 0;
    var totalamountwithtax = 0;
    var finalamountwithtax = 0;
    var totalNetAmount = 0;

    var rating = 0;
    $('#OrderMaster_table > tbody').html('');
    $.each(response, function (i, item) {

        discountamount = item.OrderAmount * (item.OrderDiscountPer / 100);
        totalwithdiscount = item.OrderAmount - discountamount;
        totalamountwithtax = totalwithdiscount * (item.TaxPer / 100);
        finalamountwithtax = totalamountwithtax + totalwithdiscount;

        rating = Math.round((item.Rating + item.ServiceRating + item.AmbianceRating) / 3);

        row += '<tr><td hidden class="OrderId">' + item.Id + '</td>' +
            '<td>' + item.OrderDate + '</td>' +
            '<td class="JobRefNo">' + item.JobRefNo + '</td>' +
            '<td>' + (item.TableNo ? item.TableNo.replace(/\?\?/g, '').trim() : '-') + '</td>' +
            '<td class="grn label OrderStatus" style="text-align: center; display: table-cell; vertical-align: middle;">' + item.OrderStatus + '</td>' +

            //'<td class="grn label OrderStatus">' + item.OrderStatus + '</td>' +
            '<td><span>' + item.IsWeb + '</span><br /><span>' + item.CustomerName + '</span></td>' +
            '<td class="OrderAmount">' + item.OrderAmount + '</td>' +
            '<td class="TaxPer">' + item.TaxPer + '</td>' +
            '<td>' + Math.round(totalamountwithtax, 0) + '</td>' +
            '<td class="DiscountPer">' + item.OrderDiscountPer + '</td>' +
            '<td class="DiscountAmount">' + Math.round(totalwithdiscount, 0) + '</td>' +
            /* '<td>' + item.OrderNetAmount + '</td>' +*/
            '<td class="NetAmount">' + Math.round(finalamountwithtax, 0) + '</td>' +
            '<td hidden class="Rating">' + rating + '</td>' +

            '<td></td>' +
            /*'<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span></td>' +*/
            '<td><p><a href="#" class="RatingView">' + item.FeedBackDesc + '</a></p></td>' +
            '<td class="PaymentType">' + item.PaymentType + '</td>' +
            '<td><button class="btn AssignWaiter"><i class="fa fa-user-plus"></i></button><button class="btn btn-danger Print"><i class="fa fa-print"></i></button><button class="btn btn-danger View"><i class="fa fa-eye"></i></button>';

        if (item.isPaymentCollected == 0) {
            row += '<button class="btn Payment"><i class="fa fa-money"></i></button>';
        }
        else {
            row += '<span class="label label-success">Paid</span>';
        }

        row += '</td> </tr>';

        totalNetAmount += finalamountwithtax;

    });
    $('#OrderMaster_table').append(row);

    $('.TotalNetAmount').html(Math.round(totalNetAmount, 0));

    $('#OrderMaster_table td.grn:contains("Pending")').addClass('label-danger blink');
    $('#OrderMaster_table td.grn:contains("Cancelled")').addClass('label-danger');
    $('#OrderMaster_table td.grn:contains("Cleared")').addClass('label-success');
    //$('#OrderMaster_table td.grn:contains("Pending")').closest('tr').addClass('blink');
    //$('#OrderMaster_table td.grn:contains("Pending")').addClass('label-warning');
    //$('#OrderMaster_table td.grn:contains("Cancelled")').addClass('label-danger');
    //$('#OrderMaster_table td.grn:contains("Cleared")').addClass('label-success');
    $("#OrderMaster_table TBODY TR").each(function () {
        var row = $(this);
        var Rating = row.find("TD").eq(12).html();
        row.find("td").eq(13).html('<td><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        if (Rating == 1) {
            row.find("td").eq(13).html('');
            row.find("td").eq(13).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 2) {
            row.find("td").eq(13).html('');
            row.find("td").eq(13).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 3) {
            row.find("td").eq(13).html('');
            row.find("td").eq(13).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 4) {
            row.find("td").eq(13).html('');
            row.find("td").eq(13).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span></td>');
        }
        if (Rating == 5) {
            row.find("td").eq(13).html('');
            row.find("td").eq(13).html('<td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span></td>');
        }

    });
    
    var totalCount = 0;
    if (response.length > 0) {
        totalCount = response[0].TotalCount;
    }
    RenderPagination(totalCount);
}

function RenderPagination(totalCount) {
    if (totalCount === 0) {
        $('#paginationButtons').html('');
        return;
    }

    var totalPages = Math.ceil(totalCount / pageSize);
    var startRecord = ((currentPage - 1) * pageSize) + 1;
    var endRecord = Math.min(currentPage * pageSize, totalCount);

    var html = '<div class="d-flex justify-content-between align-items-center flex-wrap">';
    html += '<div class="text-muted mb-2">Showing <b>' + startRecord + '</b> to <b>' + endRecord + '</b> of <b>' + totalCount + '</b> records</div>';
    
    html += '<nav aria-label="Page navigation"><ul class="pagination pagination-sm m-0">';

    // Previous Button
    html += '<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '">';
    html += '<a class="page-link" href="javascript:void(0)" onclick="GetOrderListReport(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
    html += '</li>';

    if (totalPages > 1) {
        for (var i = 1; i <= totalPages; i++) {
            if (i == 1 || i == totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += '<li class="page-item ' + (i == currentPage ? 'active' : '') + '">';
                html += '<a class="page-link" href="javascript:void(0)" onclick="GetOrderListReport(' + i + ')">' + i + '</a>';
                html += '</li>';
            } else if (i == currentPage - 3 || i == currentPage + 3) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
    }

    // Next Button
    html += '<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '">';
    html += '<a class="page-link" href="javascript:void(0)" onclick="GetOrderListReport(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
    html += '</li>';

    html += '</ul></nav></div>';
    $('#paginationButtons').html(html);
}


function GetNetAmount(DiscountPer) {
    OrderAmount = $('#txtOrderAmount').val();
    //DiscountPer = $('#hfDiscountPer').val();
    TaxPer = $('#hfTaxPer').val();
    NetAmount = $('#txtNetAmount').val();

    if ($("#ddlPaymentType").val() == "CARD") {
        discountamount = OrderAmount * (DiscountPer / 100);
        totalwithdiscount = OrderAmount - discountamount;
        totalamountwithtax = totalwithdiscount * (TaxPer / 100);
        finalamountwithtax = totalamountwithtax + totalwithdiscount;

        //$('#hfDiscountPer').val(DiscountPer);
        $('#hfDiscountAmount').val(Math.round(totalwithdiscount, 0));
        $('#txtNetAmount').val(Math.round(finalamountwithtax, 0));
    }
    else {
        //DiscountPer = 0;
        discountamount = OrderAmount * (DiscountPer / 100);
        totalwithdiscount = OrderAmount - discountamount;
        totalamountwithtax = totalwithdiscount * (TaxPer / 100);
        finalamountwithtax = totalamountwithtax + totalwithdiscount;

        //$('#hfDiscountPer').val(DiscountPer);
        $('#hfDiscountAmount').val(Math.round(totalwithdiscount, 0));
        $('#txtNetAmount').val(Math.round(finalamountwithtax, 0));

        $(".BankDetails").hide();
    }
}

let userIsViewingPage = true;
setInterval(focusChecker, 500);
function focusChecker() {
    if (document.hasFocus()) {
        if (!userIsViewingPage) {
            GetOrderListReport();
            //location.reload();
            userIsViewingPage = true;
        }
    }
    else {
        userIsViewingPage = false;
    }
}

function BindOrderTypesHandlerOL(response) {
    var html = '';
    $('#ddlOrderType').html('');
    html += "<option value=''>Select</option>";
    $.each(response, function (i, item) {

        html += '<option value=' + item.OrderTypeId + '>' + item.OrderType + '</option>';

    });
    $('#ddlOrderType').html(html);
}
