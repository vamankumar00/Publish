$(document).ready(function () {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var formattedDate = yyyy + '-' + mm + '-' + dd;

    if ($('#fromDate').val() == "") {
        $('#fromDate').val(formattedDate);
    }
    if ($('#toDate').val() == "") {
        $('#toDate').val(formattedDate);
    }

    var date_input = $('input[name="date"]');
    date_input.datepicker({
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
    });

    $('#departmentContainer').hide();

    $('#reportName').change(function () {
        if ($("#reportName").val() == "FOCOrdersReport") {
            $('#departmentContainer').show();
        } else {
            $('#departmentContainer').hide();
            //$('#ddlDepartment').val("0");
        }
    });

    $('#OrderType').change(function () {
        if ($("#OrderType").val() == "11") {
            $('#departmentContainer').show();
        } else {
            $('#departmentContainer').hide();
            //$('#ddlDepartment').val("0");
        }
    });

    $('#GenerateOrderReport').click(function () {
        var reportName = $('#reportName').val();
        var DepartmentId = $('#Department').val();
        var fromDate = $('#fromDate').val();
        var toDate = $('#toDate').val();
        var orderStatus = $('#OrderStatus').val();
        var orderFrom = $('#OrderFrom').val();
        var dateType = $('#dateType').val();
        var orderType = $('#OrderType').val();
        var paymentStatus = $('#PaymentStatus').val();
        var orderNo = $('#orderNo').val();
        var customerName = $('#customerName').val();
        var searchTerm = $('#searchTerm').val();
        var pageSize = parseInt($('#pageSizeSelect').val());
        loadReportData(reportName, DepartmentId, fromDate, toDate, orderStatus, orderFrom, dateType, orderType, paymentStatus, orderNo, customerName, page = 1, pageSize, searchTerm);
        $('#selectedReportName').text(reportName.replace(/([a-z])([A-Z])/g, '$1 $2'));
    });

    var activeReportXHR = null;

    function loadReportData(reportName, DepartmentId, fromDate, toDate, orderStatus, orderFrom, dateType, orderType, paymentStatus, orderNo, customerName, page = 1, pageSize = 10, searchTerm = "") {
        // Abort any in-flight request to prevent duplicate renders
        if (activeReportXHR) {
            activeReportXHR.abort();
            activeReportXHR = null;
        }

        $('#reportTableHeader').empty();
        $('#reportTableBody').empty();
        $('#reportTableFooter').empty();
        $('.TotalNetAmount').text('');
        $('.TotalEntries').text('');
        $('#pageSizeContainer').hide();
        $('#DownloadPdfBtn').hide();
        $('#DownloadExcelBtn').hide();

        var requestData = {
            ReportName: reportName,
            DepartmentId: DepartmentId,
            FromDate: fromDate,
            ToDate: toDate,
            OrderStatus: orderStatus,
            IsWeb: orderFrom,
            OrderFrom: orderFrom,
            DateType: dateType,
            OrderTypeId: orderType,
            PaymentStatus: paymentStatus,
            OrderNo: orderNo,
            CustomerName: customerName,
            DefaultClientId: DefaultClientId,
            PageNumber: page,
            PageSize: pageSize,
            SearchTerm: searchTerm
        };

        var url;
        $.ajax({
            url: '../data.txt',
            async: false,
            cache: false,
            dataType: "text",
            success: function (data) {
                url = data;
            }
        });

        activeReportXHR = $.ajax({
            url: url + 'GenerateReport1',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(requestData),
            success: function (response) {
                activeReportXHR = null;
                console.log(response)
                if (response.success) {
                    var headers = [];
                    var data = response.data;
                    console.log(data)
                    if (reportName === "OrderDetails") {
                        headers = ['Date', 'Order #', 'Table No', 'Status', 'Type', 'Amount', 'Tax%', 'Tax Amount', 'Discount%', 'Discount', 'Net Amount', 'Avg Rating', 'Feedback', 'Payment Type'];
                    } else if (reportName === "PartyLedger") {
                        headers = ['Date', 'Counter', 'User', 'Order#', 'Invoice#', 'Order Type', 'Table No.', 'Order From', 'Shift', 'Amount', 'Balance'];
                    } else if (reportName === "ShiftLedger") {
                        headers = ['Date', 'Day', 'Orders', 'Net Amount'];
                    } else if (reportName === "PettyCash") {
                        headers = ['Sno', 'Date', 'Counter', 'User', 'Voucher#', 'Expense Head', 'Description', 'Amount'];
                    } else if (reportName === "DepartmentSummary") {
                        headers = ['Department', 'Amount', 'Discount', 'Tax', 'Net Amount'];
                    } else if (reportName === "DiscountReport") {
                        headers = ['Date', 'Order Type', 'Order No#', 'Order From', 'Given-By', 'Amount', 'Discount Name', 'Discount%', 'Discount', 'Tax Name', 'Tax%', 'Tax', 'Net Amount'];
                    } else if (reportName === "RiderSummary") {
                        headers = ['S.No', 'Name', 'Phone-No', 'Deliveries', 'Total Sale'];
                    } else if (reportName === "RiderDetails") {
                        headers = ['S.No', 'Date', 'Order#', 'Delivered From', 'Driver Name'];
                    } else if (reportName === "DailySalesReport") {
                        headers = ['S.No', 'Date', 'Orders', 'Items Sold', 'Net Amount', 'Discount Amount', 'Tax'];
                    } else if (reportName === "ItemReport") {
                        headers = ['S.No', 'Item-Id', 'Item Name', 'Amount', 'Sold Qty', 'Net Amount', 'Order Type'];
                    } else if (reportName === "CategoryReport") {
                        headers = ['S.No', 'Category-Id', 'Category', 'Item Sold ', 'Net Amount'];
                    } else if (reportName === "CustomerFeedBack") {
                        headers = ['S.No', 'Day', 'Date', 'Order-No', 'Customer Name', 'FeedBack', 'Ratings', 'Waiter', 'Table No'];
                    } else if (reportName === "WaiterReport") {
                        headers = ['S.No', 'Date', 'Order', 'Order Type', 'Waiter', 'Table No'];
                    } else if (reportName === "WaiterOrdersReport") {
                        headers = ['S.No', 'Waiter Name', 'Orders', 'Item Sold', 'Net Amount'];
                    } else if (reportName === "SellingItemsByDay") {
                        headers = ['S.No', 'Day Of Week', 'Day Passed', 'Top Order', 'Top Item Name', 'Orders', 'Net Amount'];
                    } else if (reportName === "DeliveryReport") {
                        headers = ['S.No', 'Date', 'Order-No', 'Customer Name', 'Contact No.', 'Address', 'Quantity', 'Net Amount', 'Delivery-Charges', 'Driver', 'Order Type', 'Status'];
                    } else if (reportName === "MonthlyReport") {
                        headers = ['S.No', 'Month', 'Orders', 'Orders Range', 'Owner Orders', 'Customer Orders', 'Payable Amount'];
                    } else if (reportName === "OrderSummeryReport") {
                        headers = ['S.No', 'OrderType', 'Orders', 'Total Items'];
                    } else if (reportName === "FOCOrdersReport") {
                        headers = ['S.No', 'Order no', 'Order Type', 'OrderDate', 'Time', 'FOC-By', 'FOC-To', 'Total ITems', 'Item Names', 'Department Name'];
                    } else if (reportName === "BankWiseReport") {
                        headers = ['S.No', 'Bank Name', 'Card Type', 'Customer Count', 'Net Amount'];
                    } else if (reportName === "FOCFinancialReport") {
                        headers = ['S.No', 'Date', 'Lounge Name', 'Department', 'Person Name', 'Item Name', 'Quantity', 'Unit Cost', 'Total Cost', 'Reference'];
                    }
                    setupPagination(response.totalCount || totalEntries, page, pageSize, function (newPage, newPageSize) {
                        const finalPageSize = newPageSize === -1 ? 1000000 : newPageSize;
                        loadReportData(
                            reportName, DepartmentId, fromDate, toDate,
                            orderStatus, orderFrom, dateType,
                            orderType, paymentStatus, orderNo,
                            customerName, newPage, finalPageSize, searchTerm
                        );
                    });


                    $('#pageSizeContainer').show();
                    $('#DownloadPdfBtn').show();
                    $('#DownloadExcelBtn').show();


                    setupPageSizeSelect(function (newPage, newPageSize) {
                        const finalPageSize = newPageSize === -1 ? 1000000 : newPageSize;
                        loadReportData(
                            reportName, DepartmentId, fromDate, toDate,
                            orderStatus, orderFrom, dateType,
                            orderType, paymentStatus, orderNo,
                            customerName, newPage, finalPageSize, searchTerm
                        );
                    });


                    // Generate headers
                    var thead = '<tr>';
                    headers.forEach(function (header) {
                        thead += '<th>' + header + '</th>';
                    });
                    thead += '</tr>';
                    $('#reportTableHeader').append(thead);

                    var totalEntries = 0;
                    var columnTotals = {};
                    headers.forEach(function (header) {
                        if (
                            header === 'Amount' || header === 'Tax Amount' || header === 'Discount Amount' || header === 'Net Amount' ||
                            header === 'Discount' || header === 'Tax' || header === 'Net Total' || header === 'Balance' || header === 'Total Tax' ||
                            header === 'Total Orders' || header === 'Total Amount' || header === 'Orders' || header === 'Deliveries' || header === 'Total Sale' || header === 'Total Order' ||
                            header === 'Customer Count' || header === 'Unit Cost' || header === 'Total Cost'
                        ) { columnTotals[header] = 0 }
                    });

                    let serialNo = 1;
                    data.forEach(function (row) {
                        var tr = '<tr>';
                        if (headers.includes("S.No")) {
                            tr += '<td>' + serialNo++ + '</td>';
                        }
                        for (var key in row) {
                            if (row.hasOwnProperty(key)) {
                                if (key === 'OrderId') continue;


                                else if (key === 'Amountt') continue;


                                else if (reportName === 'Shift Ledger' && key === 'TotalDiscount') continue;


                                var cellValue = row[key];

                                var lowerKey = key.toLowerCase();
                                if (lowerKey === 'orderdate' || lowerKey === 'date' || lowerKey === 'shiftdate') {
                                    if (cellValue && typeof cellValue === 'string' && cellValue.includes('/Date(')) {
                                        var dateString = cellValue.replace('/Date(', '').replace(')/', '');
                                        var date = new Date(parseInt(dateString));
                                        cellValue = date.toLocaleDateString();
                                    } else if (cellValue) {
                                        var date = new Date(cellValue);
                                        if (!isNaN(date.getTime())) {
                                            cellValue = date.toLocaleDateString();
                                        }
                                    }
                                }
                                if (lowerKey === 'time') {
                                    if (cellValue && typeof cellValue === 'string' && cellValue.includes('/Date(')) {
                                        var dateString = cellValue.replace('/Date(', '').replace(')/', '');
                                        var date = new Date(parseInt(dateString));
                                        cellValue = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                    } else if (cellValue) {
                                        var date = new Date(cellValue);
                                        if (!isNaN(date.getTime())) {
                                            cellValue = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                        }
                                    }
                                }





                                if (lowerKey === 'rating' || lowerKey === 'ratings') {
                                    var stars = '';
                                    var rating = parseInt(cellValue);
                                    for (var i = 0; i < 5; i++) {
                                        stars += i < rating ? '★' : '☆';
                                    }
                                    cellValue = stars;
                                }

                                var headerKey = key;
                                if (lowerKey === 'ordernetamount' || lowerKey === 'netamount') headerKey = 'Net Amount';
                                if (lowerKey === 'totaltax' || lowerKey === 'tax') headerKey = 'Tax';
                                if (lowerKey === 'totaldiscount' || lowerKey === 'discount') headerKey = 'Discount Amount';
                                if (lowerKey === 'orderamount' || lowerKey === 'amount') headerKey = 'Amount';
                                if (lowerKey === 'totalamount') headerKey = 'Net Amount';
                                if (lowerKey === 'openingbalance') headerKey = 'Balance';
                                if (lowerKey === 'totalorders' || lowerKey === 'orders') headerKey = 'Orders';
                                if (lowerKey === 'itemssold' || lowerKey === 'itemsold') headerKey = 'Item Sold';
                                if (lowerKey === 'allordersnetamount') headerKey = 'Net Amount';
                                if (lowerKey === 'allordersqty') headerKey = 'Orders';
                                if (lowerKey === 'orderid') headerKey = 'Orders';
                                if (lowerKey === 'totaldeliveries') headerKey = 'Deliveries';
                                if (lowerKey === 'totalsales') headerKey = 'Total Sale';
                                if (lowerKey === 'customercount') headerKey = 'Customer Count';
                                if (lowerKey === 'cardtype') headerKey = 'Card Type';
                                if (lowerKey === 'unitcost') headerKey = 'Unit Cost';
                                if (lowerKey === 'totalcost') headerKey = 'Total Cost';
                                if (lowerKey === 'quantity') headerKey = 'Quantity';

                                if (headers.includes(headerKey) && columnTotals.hasOwnProperty(headerKey)) {
                                    columnTotals[headerKey] += parseFloat(cellValue) || 0;
                                }
                                // Add " Rs" only if headerKey is NOT "Orders" or "Item Sold"
                                if (headerKey !== 'Orders' && headerKey !== 'Item Sold' && headerKey !== 'Deliveries' && headerKey !== 'Customer Count' && headerKey !== 'Quantity' && columnTotals.hasOwnProperty(headerKey)) {
                                    tr += '<td> Rs.' + cellValue + ' </td>';
                                }

                                else if (lowerKey === 'rating' || lowerKey === 'ratings') { tr += '<td class="rating-stars">' + cellValue + '</td>'; }

                                else if (lowerKey === 'feedback') {
                                    var shortText = cellValue && cellValue.length > 10 ? cellValue.substring(0, 10) + '...' : cellValue;
                                    if (cellValue && cellValue.length > 10) { tr += '<td><span class="feedback-preview" data-feedback="' + cellValue.replace(/"/g, '&quot;') + '">' + shortText + '</span></td>'; }
                                    else { tr += '<td>' + shortText + '</td>'; }
                                }
                                else if (lowerKey === 'item names' || lowerKey === 'itemnames') {
                                    var shortText = cellValue && cellValue.length > 10
                                        ? cellValue.substring(0, 10) + '...'
                                        : cellValue;

                                    if (cellValue && cellValue.length > 10) {
                                        tr += '<td><span class="feedback-preview" data-feedback="' +
                                            cellValue.replace(/"/g, '&quot;') + '">' + shortText + '</span></td>';
                                    } else {
                                        tr += '<td>' + shortText + '</td>';
                                    }
                                }

                                else if (lowerKey === 'orderno' || lowerKey === 'orderno1' || lowerKey === 'jobrefno' || lowerKey === 'orders') {

                                    const orderId = row.OrderMasterId || row.orderMasterId || row.OrderId || row.orderId || row.Id || row.id;

                                    const shortText = cellValue && cellValue.length > 15 ? cellValue.substring(0, 15) : cellValue;
                                    tr += `<td><span class="order-popup" data-orderid="${orderId}" style="cursor:pointer;color:blue;">${shortText}</span></td>`;
                                }

                                else if (reportName === "ShiftLedger" && lowerKey === "day") {
                                    tr += `<td class="expandable-Ledger" data-day="${cellValue}" style="cursor:pointer;text-decoration:underline;">${cellValue}</td>`;

                                }

                                else if (reportName === "SellingItemsByDay" && lowerKey === "dayname") { tr += `<td class="expandable-day" data-day="${cellValue}" style="cursor:pointer;text-decoration:underline;">${cellValue}</td>`; }

                                else if (reportName === "MonthlyReport" && lowerKey === "reportmonth") {
                                    tr += `<td class="expandable-month" data-month="${cellValue}" style="cursor:pointer;text-decoration:underline;">${cellValue}</td>`;
                                }


                                else { tr += '<td>' + cellValue + '</td>'; }

                            }
                        }
                        tr += '</tr>';
                        $('#reportTableBody').append(tr);
                        totalEntries++;



                        if (reportName === "ShiftLedger") {
                            $('#reportTableBody').append('<tr class="sub-row" data-day="' + row.Day + '" style="display:none;"><td colspan="' + headers.length + '"><div class="part-of-day-container"></div></td></tr>');
                        }


                        if (reportName === "SellingItemsByDay") { $('#reportTableBody').append('<tr class="sub-row" data-day="' + row.DayName + '" style="display:none;"><td colspan="' + headers.length + '"><div class="part-of-day-container"></div></td></tr>'); }


                        if (reportName === "MonthlyReport") {
                            $('#reportTableBody').append(
                                '<tr class="sub-row" data-month="' + row.ReportMonth + '" style="display:none;">' +
                                '<td colspan="' + headers.length + '">' +
                                '<div class="daily-report-container"></div>' +
                                '</td>' +
                                '</tr>'
                            );
                        }



                    });


                    var tfoot = '<tr class="total-row">';
                    headers.forEach(function (header) {
                        if (columnTotals.hasOwnProperty(header)) {
                            // Add "Rs" only for monetary fields
                            if (header !== 'Orders' && header !== 'Item Sold' && header !== 'Deliveries' && header !== 'Total Order' && header !== 'Customer Count') {
                                tfoot += '<td>Total ' + header + ': Rs.' + columnTotals[header].toFixed(0) + ' </td>';
                            } else {
                                tfoot += '<td>Total ' + header + ': ' + columnTotals[header].toFixed(0) + '</td>';
                            }
                        } else {
                            tfoot += '<td></td>';
                        }
                    });
                    tfoot += '</tr>';

                    $('#reportTableFooter').append(tfoot);
                    $('.TotalEntries').text(totalEntries);

                    if (response.success) {
                        const data = response.data;

                        // render the report data...

                        if (data && data.length > 0) {
                            $('#DownloadPdfBtn').prop('disabled', false);
                        } else {
                            $('#DownloadPdfBtn').prop('disabled', true);
                        }
                    }

                }
                else {
                    alert('Kindly Select Report Name To Generate Report: ' + response.message);
                }
            },
            error: function () {
                alert('An error occurred while fetching the report data.');
            }
        });
    }

    // Expandable sub-table handler
    $('#reportTableBody').on('click', '.expandable-day', function () {
        var day = $(this).data('day');
        var subRow = $('.sub-row[data-day="' + day + '"]');
        var container = subRow.find('.part-of-day-container');
        var isVisible = subRow.is(':visible');

        if (isVisible) { subRow.hide(); }

        else {
            if (!container.hasClass('loaded')) {
                // Read base URL again
                var baseUrl = '';
                $.ajax(
                    {
                        url: '../data.txt',
                        async: false,
                        cache: false,
                        dataType: "text",
                        success: function (data) {
                            baseUrl = data;
                        }
                    });

                var requestData1 =
                {

                    ReportName: 'PartOfDaySellsReport',
                    FromDate: $('#fromDate').val(),
                    ToDate: $('#toDate').val(),
                    OrderStatus: $('#OrderStatus').val(),
                    IsWeb: $('#OrderFrom').val(),
                    DateType: $('#dateType').val(),
                    OrderTypeId: $('#OrderType').val(),
                    PaymentStatus: $('#PaymentStatus').val(),
                    OrderNo: $('#orderNo').val(),
                    CustomerName: $('#customerName').val(),
                    DefaultClientId: DefaultClientId


                };

                $.ajax(
                    {
                        url: baseUrl + 'GenerateReport',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(requestData1),
                        success: function (response) {
                            if (response.success && response.data) {
                                var html = '<table class="table table-bordered table-sm mb-0"><thead><tr><th>Part Of Day</th><th>Orders</th><th>Items Sold</th></tr></thead><tbody>';
                                var hasData = false;

                                response.data.forEach(function (row) {
                                    if (row.DayOfWeek && row.DayOfWeek.trim().toLowerCase() === day.trim().toLowerCase()) {
                                        html += '<tr>';
                                        html += '<td>' + row.PartOfDay + '</td>';

                                        html += '<td>' + row.Orders + '</td>';
                                        html += '<td>' + row.ItemsSold + '</td>';

                                        html += '</tr>';
                                        hasData = true;
                                    }
                                });

                                html += '</tbody></table>';

                                if (!hasData) { html = '<div class="text-muted">No part-of-day data available for ' + day + '.</div>'; }

                                container.html(html).addClass('loaded');
                                subRow.show();
                            }
                            else {
                                container.html('<div class="text-danger">Failed to load detail.</div>');
                                subRow.show();
                            }
                        },
                        error: function () {
                            container.html('<div class="text-danger">Error loading data.</div>');
                            subRow.show();
                        }
                    });
            } else { subRow.show(); }
        }
    });


    $('#reportTableBody').on('click', '.order-popup', function () {
        const orderId = $(this).data('orderid');
        const clientId = "SC_0728";

        $.ajax({
            url: url + 'GetOrderByOrderId',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                OrderId: orderId,
                DefaultClientId: clientId
            }),
            success: function (response) {
                if (response && response.length > 0) {
                    const first = response[0];

                    let headerHtml = `
                    <div style="margin-bottom:10px;">
                        <strong>Order No:</strong> ${first.JobRefNo}<br />
                        <strong>Table:</strong> ${first.TableNo}<br />
                        <strong>Total Amount:</strong> ${first.OrderNetAmount}
                    </div>
                `;

                    let detailHtml = `
                    <table border="1" style="width:100%;border-collapse:collapse;text-align:left;">
                        <thead>
                            <tr style="background:#f0f0f0;">
                                <th>Item</th>
                                <th>Quantity</th>

                            </tr>
                        </thead>
                        <tbody>
                `;

                    let allPaid = true;

                    response.forEach(function (item) {
                        const isPaid = item.IsFinalPaid === true;
                        if (!isPaid) allPaid = false;

                        detailHtml += `
                        <tr>
                            <td>${item.ItemDesc || '-'}</td>
                            <td>${item.ItemQty}</td>

                        </tr>
                    `;
                    });

                    detailHtml += `
                        </tbody>
                    </table>
                `;

                    let footerHtml = `
                    <div style="margin-top:15px; text-align:Right;">
                        <strong>Payment Collected:</strong> ${allPaid ? 'Yes' : 'No'}
                    </div>
                `;

                    showFeedbackPopup(headerHtml + detailHtml + footerHtml);
                } else {
                    showFeedbackPopup("No details found for this order.");
                }
            },
            error: function () {
                showFeedbackPopup("Error fetching order details.");
            }
        });
    });


    $('#reportTableBody').on('click', '.expandable-month', function () {
        var month = $(this).data('month');
        var subRow = $('.sub-row[data-month="' + month + '"]');
        var container = subRow.find('.daily-report-container');
        var isVisible = subRow.is(':visible');

        var fromDate = new Date("1 " + month);
        var toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);


        var fromDateStr = fromDate.toISOString().split('T')[0];
        var toDateStr = toDate.toISOString().split('T')[0];

        if (isVisible) {
            subRow.hide();
        } else {
            if (!container.hasClass('loaded')) {
                var baseUrl = '';
                $.ajax({
                    url: '../data.txt',
                    async: false,
                    cache: false,
                    dataType: "text",
                    success: function (data) {
                        baseUrl = data;
                    }
                });

                var requestData = {
                    ReportName: 'PayableSalesReport',
                    FromDate: fromDateStr,
                    ToDate: toDate,
                    OrderStatus: $('#OrderStatus').val(),
                    IsWeb: $('#OrderFrom').val(),
                    DateType: $('#dateType').val(),
                    OrderTypeId: $('#OrderType').val(),
                    PaymentStatus: $('#PaymentStatus').val(),
                    OrderNo: $('#orderNo').val(),
                    CustomerName: $('#customerName').val(),
                    DefaultClientId: DefaultClientId

                };

                $.ajax({
                    url: baseUrl + 'GenerateReport',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(requestData),
                    success: function (response) {
                        if (response.success && response.data) {
                            var html = '<table class="table table-bordered table-sm mb-0"><thead><tr><th>Date</th><th>Total Orders</th><th>Owner\'s Order</th><th>Customer\'s Order</th><th>Amount</th></tr></thead><tbody>';
                            response.data.forEach(function (row) {
                                let dateValue = row.OrderDate;
                                if (typeof dateValue === "string" && dateValue.includes('/Date(')) {
                                    let millis = parseInt(dateValue.replace('/Date(', '').replace(')/', ''));
                                    dateValue = new Date(millis).toLocaleDateString();
                                }

                                html += '<tr>';
                                html += '<td>' + dateValue + '</td>';
                                html += '<td>' + row.TotalOrders + '</td>';
                                html += '<td>' + row.FOCOrders + '</td>';
                                html += '<td>' + row.OrdersWithoutFoc + '</td>'
                                html += '<td>' + row.Amountt + '</td>';
                                html += '</tr>';
                            });

                            html += '</tbody></table>';
                            container.html(html).addClass('loaded');
                            subRow.show();
                        } else {
                            container.html('<div class="text-danger">No data found for ' + month + '</div>');
                            subRow.show();
                        }
                    },
                    error: function () {
                        container.html('<div class="text-danger">Error loading daily data.</div>');
                        subRow.show();
                    }
                });
            } else {
                subRow.show();
            }
        }
    });


    $('#reportTableBody').on('click', '.expandable-Ledger', function () {
        var day = $(this).data('day'); // e.g., "Tuesday"
        var subRow = $('.sub-row[data-day="' + day + '"]');
        var container = subRow.find('.part-of-day-container');
        var isVisible = subRow.is(':visible');

        if (isVisible) {
            subRow.hide();
            return;
        }

        if (container.hasClass('loaded')) {
            subRow.show();
            return;
        }

        var baseUrl = '';
        $.ajax({
            url: '../data.txt',
            async: false,
            cache: false,
            dataType: "text",
            success: function (data) {
                baseUrl = data;
            }
        });

        var requestData1 = {
            ReportName: 'ShiftDropDown',  // Your backend should load full ShiftLedger list
            FromDate: '', // You can leave these blank if not used
            ToDate: '',
            OrderStatus: $('#OrderStatus').val(),
            OrderFrom: $('#OrderFrom').val(),
            DateType: $('#dateType').val(),
            OrderType: $('#OrderType').val(),
            PaymentStatus: $('#PaymentStatus').val(),
            OrderNo: $('#orderNo').val(),
            CustomerName: $('#customerName').val(),
            DefaultClientId: DefaultClientId
        };

        $.ajax({
            url: baseUrl + 'GenerateReport',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(requestData1),
            success: function (response) {
                if (response.success && response.data) {
                    var html = '<table class="table table-bordered table-sm mb-0"><thead><tr><th>Shift</th><th>From-To</th><th>Orders</th><th>Net Amount</th></tr></thead><tbody>';
                    var hasData = false;

                    response.data.forEach(function (row) {
                        var rowDay = new Date(row.ShiftDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                        if (rowDay === day.trim().toLowerCase()) {
                            html += '<tr>';
                            html += '<td>' + row.Shift + '</td>';
                            html += '<td>' + row.Label + '</td>';
                            html += '<td>' + row.Orders + '</td>';
                            html += '<td>' + row.NetAmount + '</td>';
                            html += '</tr>';
                            hasData = true;
                        }
                    });

                    html += '</tbody></table>';

                    if (!hasData) {
                        html = '<div class="text-muted">No shift data available for ' + day + '.</div>';
                    }

                    container.html(html).addClass('loaded');
                    subRow.show();
                } else {
                    container.html('<div class="text-danger">Failed to load detail.</div>');
                    subRow.show();
                }
            },
            error: function () {
                container.html('<div class="text-danger">Error loading data.</div>');
                subRow.show();
            }
        });
    });




    $('#searchTerm').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#GenerateOrderReport').click();
        }
    });

    $('#DownloadPdfBtn').click(function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape A4

        const reportNameText = $('#reportName option:selected').text().trim();
        const reportName = reportNameText.replace(/\s+/g, '_');

        const fromDate = $('#fromDate').val() || '';
        const toDate = $('#toDate').val() || '';
        const dateRangeText = fromDate && toDate ? `From ${fromDate} to ${toDate}` : '';

        const headers = [];
        $('#reportTableHeader th').each(function () {
            headers.push($(this).text().trim());
        });

        const data = [];
        const columnTotals = {};

        // Define which headers should be totaled (must match header text exactly)
        const totalColumns = [
            'Orders',
            'Amount',
            'Net Amount',
            'Tax',
            'Discount Amount',
            'Balance',
            'Deliveries',
            'Total Sale',
            'Total Order',
            'Customer Count',
            'Unit Cost',
            'Total Cost'
        ];

        $('#reportTableBody > tr').each(function () {
            if ($(this).hasClass('sub-row') || $(this).find('table').length > 0) return;

            const row = [];
            $(this).find('td').each(function (index) {
                let cellValue;
                const header = headers[index];

                // Check if cell has a feedback-preview span (Feedback or Item Names)
                const span = $(this).find('.feedback-preview');
                if (span.length) {
                    cellValue = span.data('feedback');  // full text
                } else {
                    cellValue = $(this).text().trim(); // normal text
                }

                // Handle ratings
                if ((header === 'Rating' || header === 'Ratings') && (cellValue.includes('★') || cellValue.includes('?'))) {
                    const rating = (cellValue.match(/[★?]/g) || []).length;

                    let stars = '';
                    for (let i = 0; i < 5; i++) {
                        stars += i < rating ? '★' : '☆';
                    }
                    cellValue = stars;
                }

                // Clean Rs., commas, and spaces
                let cleanValue = cellValue.replace(/Rs\.?/gi, '').replace(/,/g, '').trim();
                const numericValue = parseFloat(cleanValue);

                if (!isNaN(numericValue) && totalColumns.includes(header)) {
                    if (!columnTotals[header]) columnTotals[header] = 0;
                    columnTotals[header] += numericValue;
                }

                row.push(cellValue);
            });



            data.push(row);
        });

        // Create total row
        let totalRow = null;
        if (Object.keys(columnTotals).length > 0) {
            totalRow = headers.map((header, index) => {
                if (columnTotals.hasOwnProperty(header)) {
                    // Add Rs. only for monetary columns
                    const isMonetary = !['Orders', 'Item Sold', 'Deliveries', 'Total Order', 'Customer Count', 'Quantity'].includes(header);
                    return isMonetary
                        ? 'Rs. ' + columnTotals[header].toFixed(0)
                        : columnTotals[header].toFixed(0);
                } else if (index === 0) {
                    return 'Total';
                } else {
                    return '';
                }
            });
        }

        let currentY = 15;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(reportNameText, 14, currentY);

        if (dateRangeText) {
            currentY += 7;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(dateRangeText, 14, currentY);
        }

        const pageContentFooter = function (data) {
            let str = `Page ${doc.internal.getNumberOfPages()}`;
            doc.setFontSize(9);
            doc.text(str, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
        };

        doc.autoTable({
            head: [headers],
            body: totalRow ? [...data, totalRow] : data,
            startY: currentY + 10,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [40, 40, 40] },
            didDrawCell: function (data) {
                if (totalRow && data.row.index === data.table.body.length - 1) {
                    const { doc, cell } = data;
                    doc.setLineWidth(0.8);
                    doc.setDrawColor(0);
                    doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
                }
            },
            didDrawPage: function (data) {
                pageContentFooter(data);
            }
        });

        doc.save(`${reportName}_Report.pdf`);
    });


    // ── Excel Export ──────────────────────────────────────────────────────────
    $('#DownloadExcelBtn').click(function () {
        const reportNameText = $('#reportName option:selected').text().trim();
        const reportFileName = reportNameText.replace(/\s+/g, '_');
        const fromDate = $('#fromDate').val() || '';
        const toDate = $('#toDate').val() || '';

        // Read headers from table
        const headers = [];
        $('#reportTableHeader th').each(function () {
            headers.push($(this).text().trim());
        });

        // Read data rows
        const rows = [];
        $('#reportTableBody > tr').each(function () {
            if ($(this).hasClass('sub-row') || $(this).find('table').length > 0) return;
            const row = [];
            $(this).find('td').each(function () {
                const span = $(this).find('.feedback-preview, .itemnames-preview');
                const val = span.length
                    ? (span.data('feedback') || span.data('fullnames') || span.text())
                    : $(this).text().trim();
                // Strip Rs. prefix and convert numeric values to numbers
                const clean = val.replace(/Rs\.?\s*/gi, '').trim();
                const num = parseFloat(clean);
                row.push(!isNaN(num) && clean !== '' ? num : val);
            });
            rows.push(row);
        });

        // Read totals footer row
        const footerCells = [];
        $('#reportTableFooter tr').first().find('td').each(function () {
            const raw = $(this).text().trim().replace(/Rs\.?\s*/gi, '').trim();
            const num = parseFloat(raw);
            footerCells.push(!isNaN(num) && raw !== '' ? num : $(this).text().trim());
        });
        if (footerCells.some(function (v) { return v !== ''; })) rows.push(footerCells);

        // Build worksheet
        const wsData = [headers].concat(rows);
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Auto column widths
        ws['!cols'] = headers.map(function (h, i) {
            const maxLen = Math.max(h.length, ...rows.map(function (r) { return String(r[i] !== undefined ? r[i] : '').length; }));
            return { wch: Math.min(maxLen + 4, 45) };
        });

        // Build workbook and save
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, reportFileName.substring(0, 31));
        const suffix = (fromDate ? fromDate : 'All') + '_to_' + (toDate ? toDate : 'All');
        XLSX.writeFile(wb, reportFileName + '_Report_' + suffix + '.xlsx');
    });


    // Delegate click for both feedback and item names




    // Delegate click for both feedback and item names
    $(document).on("click", ".feedback-preview, .itemnames-preview", function () {
        var fullHtml = $(this).attr("data-feedback") || $(this).attr("data-fullnames");
        showFeedbackPopup(fullHtml);
    });









});
function setupPagination(totalCount, currentPage, pageSize, onPageClick) {
    const defaultPageSize = 10;
    const effectivePageSize = pageSize === -1 ? defaultPageSize : pageSize;
    const totalPages = Math.ceil(totalCount / effectivePageSize);
    const $pagination = $('#pagination');
    $pagination.empty();

    const maxVisiblePages = 5;

    // Shared button styles
    const baseStyles = {
        margin: '0 3px',
        padding: '6px 12px',
        backgroundColor: '#343a40',
        color: 'white',
        border: '1px solid #343a40',
        borderRadius: '4px',
        cursor: 'pointer'
    };

    const activeStyles = {
        backgroundColor: 'white',
        color: '#343a40'
    };

    function createButton(text, isDisabled, onClick, customStyles = {}) {
        return $('<button>')
            .text(text)
            .css(isDisabled ? { ...baseStyles, opacity: 0.5, cursor: 'not-allowed', ...customStyles } : { ...baseStyles, ...customStyles })
            .prop('disabled', isDisabled)
            .click(function () {
                if (!isDisabled) onClick();
            });
    }

    // Previous button
    const $prevBtn = createButton('Previous', currentPage === 1, () => onPageClick(currentPage - 1, pageSize));
    $pagination.append($prevBtn);

    // Page numbers
    const visiblePageCount = Math.min(totalPages, maxVisiblePages);
    for (let i = 1; i <= visiblePageCount; i++) {
        const isActive = currentPage === i;
        const $btn = $('<button>')
            .text(i)
            .css(isActive ? { ...baseStyles, ...activeStyles } : baseStyles)
            .prop('disabled', isActive)
            .click(() => onPageClick(i, pageSize));
        $pagination.append($btn);
    }

    // Ellipsis after 5 if there are more pages
    if (totalPages > maxVisiblePages) {
        $pagination.append($('<span>').text('...').css({ margin: '0 5px', color: '#343a40', fontWeight: 'bold' }));
    }

    // Next button
    const $nextBtn = createButton('Next', currentPage >= totalPages, () => onPageClick(currentPage + 1, pageSize));
    $pagination.append($nextBtn);

    // All button
    const $allBtn = $('<button>')
        .text('All')
        .css(pageSize === -1 ? { ...baseStyles, ...activeStyles } : baseStyles)
        .click(function () {
            onPageClick(1, -1); // Load all
        });

    $pagination.append($allBtn);
}


function setupPageSizeSelect(onPageSizeChange) {
    $('#pageSizeSelect').off('change').on('change', function () {
        const newPageSize = parseInt($(this).val());
        onPageSizeChange(1, newPageSize); // Reset to page 1 when page size changes
    });
}


function showFeedbackPopup(fullHtml) {
    document.getElementById('fullFeedbackText').innerHTML = fullHtml;
    document.getElementById('feedbackModal').classList.add('active');
}


function closeFeedbackPopup() { document.getElementById('feedbackModal').classList.remove('active'); }


window.onclick = function (event) {
    var modal = document.getElementById('feedbackModal');
    if (event.target === modal) { closeFeedbackPopup(); }
};