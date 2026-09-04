$(document).ready(function () {

    // Hide the loader when the AJAX request completes
    $(document).ajaxStop(function () {
        $('#loader').hide();
    });


    var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
    Common.Ajax('POST', url + 'GetAllBanks', CientId, 'json', BindBanksHandler_FD);

    var date_input = $('input[name="date"]');
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";

    date_input.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    });

    $('#GenerateFlightReport').on('click', function () {
        $('#loader').show();
        $('#HFFlightDetailsMasterId').val('');
        GetFlightReport();

    });

    // Add click event to the export button
    $('#exportExcelBtn').click(function () {
        GetFlightReportExcel();

    });

    $("#FlightDetails_table").on('click', '.OrderView', function () {
        $('#loader').show();

        // Get OrderId directly from the anchor text
        var OrderId = $(this).text().trim();
        EntryDate = $(this).data("entrydate");

        var request = {
            OrderId: OrderId,
            DefaultClientId: DefaultClientId
        };

        Common.Ajax('POST', url + 'GetOrderDetail', JSON.stringify(request), 'json', GetFlightCustomerOrderHandler);
        $('#ViewFlightOrder').modal('show');
    });

});

var currentPage = 1;
var pageSize = 50; // Customize this as needed
var totalCount = 0;
var EntryDate = "";
function GetFlightCustomerOrderHandler(response) {

    var row = '';

    $('#tblCustomerOrder > tbody').html('');
    $.each(response, function (i, item) {
        $(".ordernoFD").text(item.JobRefNo);
        row += '<tr><td>' + EntryDate + '</td><td>' + ConvertJsonDateStringFD(item.CreateDate) + '</td><td>' + item.ItemDesc + '</td><td>' + item.ItemQty + '</td></tr>'

    });

    $('#tblCustomerOrder').append(row);
}

function GetFlightReport(pageNumber = 1) {
    currentPage = pageNumber;

    var request = {};
    request.DefaultClientId = DefaultClientId;
    request.FromDate = $("#FlightfromDate").val();
    request.ToDate = $('#FlighttoDate').val();
    request.FlightNo = $('#FlightNo').val();
    request.PaymentStatus = $('#ddlPaymentBy').val();
    request.PaymentType = $('#ddlPaymentType').val();
    request.BankId = $('#ddlBank_Card').val();
    request.FTPayment = $('#ddlFTPayment').val();
    request.BinNo = $('#BinNo').val();
    request.PageNumber = pageNumber;
    request.PageSize = pageSize;

    Common.Ajax('POST', url + 'GetFlightDetails', JSON.stringify(request), 'json', GetFlightListHandler);
}

function GetFlightListHandler(responseJson) {
    var response = typeof responseJson === "string" ? JSON.parse(responseJson) : responseJson;
    var flightsArray = [];
    if (Array.isArray(response)) {
        flightsArray = response;
    } else if (response && response.Flights) {
        flightsArray = response.Flights.$values || response.Flights;
    } else if (response && response.$values) {
        flightsArray = response.$values;
    }

    totalCount = flightsArray.length > 0 ? (flightsArray[0].TotalCount || 0) : (response.TotalCount || 0);
    var totalPages = Math.ceil(totalCount / pageSize);

    $('#recordSummary').html(`Showing page ${currentPage} of ${Math.ceil(totalCount / pageSize) || 1} | Total Records: ${totalCount}`);

    $('#FlightDetails_table > tbody').html('');
    flightData = [];

    if (flightsArray && flightsArray.length > 0) {
        flightData.push(['ID', 'Order Date', 'LOC', 'Bank Name', 'Card Product', 'Flight No',
            'BinNo-PIN', 'Passenger Name', 'Guests', 'No of Guest', 'No of Meals', 'Children', 'GRO', 'Airline']);

        $.each(flightsArray, function (index, item) {
            var createdDate = item.CreatedDate ? ConvertJsonDateStringFD(item.CreatedDate) : '';
            var orderIdStr = item.OrderId || '';

            var row = '<tr>' +
                '<td>' + item.Id + '</td>' +
                '<td>' + createdDate + '</td>' +
                '<td>' + item.LOC + '</td>' +
                '<td>' + (item.BankName ?? '') + '</td>' +
                '<td>' + (item.CardProduct ?? '') + '</td>' +
                '<td>' + (item.FlightNo ?? '') + '</td>' +
                '<td>' + (item.BinNo ?? '') + "-" + (item.PIN ?? '') + '</td>' +
                '<td>' + (item.PassengerName ?? '') + '</td>' +
                '<td>' + (item.Guests ?? '') + '</td>' +
                '<td>' + item.noofguest + '</td>' +
                '<td>' + item.NoofMeals + '</td>' +
                '<td>' + (item.Children ?? '') + '</td>' +
                '<td>' + item.GRO + '</td>' +
                '<td>' + (item.Airline ?? '') + '</td>' +
                '<td>' + (item.ReceiptNo ?? '') + '</td>' +
                '<td><p><a href="#" class="OrderView" data-entrydate="' + createdDate + '">' + orderIdStr + '</a></p></td>' +
                '<td>' + (item.Scan ?? '') + '</td>' +
                '<td>' + (item.ScanDate ?? '') + '</td>' +
                '<td><button class="btn btn-info btn-sm">Action</button></td>' +
                '</tr>';
            $('#FlightDetails_table tbody').append(row);
        });
    } else {
        var noDataRow = '<tr><td colspan="15" class="text-center">No data available</td></tr>';
        $('#FlightDetails_table tbody').append(noDataRow);
    }

    RenderPaginationControls(totalPages);
}

function GetFlightReportExcel() {
    const requestData = {
        DefaultClientId: DefaultClientId,
        FromDate: $("#FlightfromDate").val(),
        ToDate: $('#FlighttoDate').val(),
        FlightNo: $('#FlightNo').val(),
        PaymentStatus: $('#ddlPaymentBy').val(),
        PaymentType: $('#ddlPaymentType').val(),
        BankId: $('#ddlBank_Card').val(),
        FTPayment: $('#ddlFTPayment').val(),
        BinNo: $('#BinNo').val()
    };

    fetch(url + "ExportAllFlightsToExcel", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to export file");
            return response.blob();
        })
        .then(blob => {
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = "AllFlightData.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(err => {
            alert("Export failed: " + err.message);
        });
}


function GetFlightListExcelHandler(response) {
    var response = JSON.parse(response); // since your C# returns JSON string
    var flights = response.Flights;

    var flightData = [];

    if (flights && flights.$values.length > 0) {

        // Adding headers to the flightData array
        flightData.push([
            'ID', 'Order Date', 'LOC', 'Bank Name', 'Card Product', 'Flight No',
            'BinNo-PIN', 'Passenger Name', 'Guests', 'No of Guest', 'No of Meals', 'Children', 'GRO', 'Airline'
        ]);

        $.each(flights.$values, function (index, item) {
            let orderDate = ConvertJsonDateStringFD(item.CreatedDate);

            // Add the row data to the flightData array
            flightData.push([
                item.Id, orderDate, item.LOC,
                item.BankName ?? '', item.CardProduct ?? '',
                item.FlightNo ?? '', (item.BinNo ?? '') + "-" + (item.PIN ?? ''),
                item.PassengerName ?? '', item.Guests ?? '',
                item.noofguest, item.NoofMeals, item.Children ?? '', item.GRO, (item.Airline ?? '')
            ]);
        });

        var ws = XLSX.utils.aoa_to_sheet(flightData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Flight Details");

        // Export the file
        XLSX.writeFile(wb, "FlightDetails.xlsx");

    }
    else {

    }

}

function RenderPaginationControls(totalPages) {
    let html = '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">';

    if (totalPages > 1) {
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="javascript:void(0);" onclick="GetFlightReport(${currentPage > 1 ? currentPage - 1 : 1})">Previous</a>
                 </li>`;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="GetFlightReport(1)">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><a class="page-link" href="javascript:void(0);">...</a></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                        <a class="page-link" href="javascript:void(0);" onclick="GetFlightReport(${i})">${i}</a>
                     </li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><a class="page-link" href="javascript:void(0);">...</a></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="GetFlightReport(${totalPages})">${totalPages}</a></li>`;
        }

        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="javascript:void(0);" onclick="GetFlightReport(${currentPage < totalPages ? currentPage + 1 : totalPages})">Next</a>
                 </li>`;
    }

    html += '</ul></nav>';
    $('#paginationControls').html(html);
}

function ChangePageSize() {
    pageSize = parseInt($('#pageSizeSelector').val());
    GetFlightReport(1); // Reset to first page
}

function ConvertJsonDateStringFD(jsonDate) {
    if (!jsonDate) return null;

    let date;
    if (typeof jsonDate === 'string' && jsonDate.indexOf("/Date(") === -1) {
        // Handle ISO string format without shifting timezone
        date = new Date(jsonDate);
    } else {
        // Handle old /Date(...)/ format
        const timestamp = parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10);
        date = new Date(timestamp);
    }

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}


function BindBanksHandler_FD(response) {
    var html = '';
    $('#ddlBank_Card').html('');
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {

        html += "<option value=" + item.Id + " data-meals= '" + item.PersonCount + "' >" + item.BankName + "</option>";

    });
    $('#ddlBank_Card').html(html);
}

