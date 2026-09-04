$(document).ready(function () {
    var date_input = $('input[name="date"]');
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    });

    $('#GenerateItemReport').on('click', function () {

        //$('#HFFlightDetailsMasterId').val('');
        GetItemReport();

    });


});


function GetItemReport() {
    var request = {};
    request.DefaultClientId = DefaultClientId;
    request.FromDate = $('#FromDate').val();
    request.ToDate = $('#ToDate').val();
    request.ShiftIdCollection = $('#ddlShiftId').val();
    
    Common.Ajax('POST', url + 'GetItemDetailsByShift', JSON.stringify(request), 'json', GetItemListHandler);
}

function GetItemListHandler(response) {

    var row = '';

    $('#ItemDetails_table > tbody').html('');

    if (response && response.length > 0) {

        var TotalOrders = 0;
        var TotalSold = 0;
        var TotalAmount = 0;
        var TotalDiscount = 0;
        var TotalNetAmount = 0;

        $.each(response, function (index, item) {
            TotalOrders += item.Orders;
            TotalSold += item.SoldQty;
            TotalAmount += item.Amount;
            TotalDiscount += item.OrderDiscountPer;
            TotalNetAmount += item.NetAmount;

            var row = '<tr>' +
                '<td>' + item.ItemDesc + '</td>' +
                '<td>' + item.Orders + '</td>' +
                '<td>' + item.SoldQty + '</td>' +
                '<td>' + item.Amount + '</td>' +
                '<td>' + item.OrderDiscountPer + '</td>' +
                '<td>' + item.NetAmount + '</td>' +
                '<td>' + item.ShiftDate.substring(0, 10) + '</td>' +                
                '<td>' + item.Shift + '</td>' +                
                '</tr>';
            $('#ItemDetails_table tbody').append(row);
        });

        //SubTotal Footer
        var footerrow = '<tr>' +
            '<td>Total</td>' +
            '<td>' + TotalOrders + '</td>' +
            '<td>' + TotalSold + '</td>' +
            '<td>' + TotalAmount + '</td>' +
            '<td>' + TotalDiscount + '</td>' +
            '<td>' + TotalNetAmount + '</td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>';
        $('#ItemDetails_table tbody').append(footerrow);

    }
    else {
        var noDataRow = '<tr><td colspan="12" class="text-center">No data available</td></tr>';
        $('#ItemDetails_table tbody').append(noDataRow);
    }

}
// Function to handle printing
function printTable() {
    var printWindow = window.open('', '', 'height=500, width=800');

    // Gather Shift Date and Shift Name data (if available)
    var shiftDate = $('#ItemDetails_table tbody tr').first().find('td:nth-child(7)').text(); // Get the Shift Date from the first row
    var shiftName = $('#ItemDetails_table tbody tr').first().find('td:nth-child(8)').text(); // Get the Shift Name from the first row

    // Adding the necessary HTML content for printing
    printWindow.document.write('<html><head><title>Shift Print</title>');
    printWindow.document.write('<style>');

    // Table style adjustments
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-size: 12px; margin-left: 0; margin-right: 0; }'); // Increased font size
    printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }'); // Slightly larger padding for better readability
    printWindow.document.write('th { background-color: #f2f2f2; }');

    // Body styling and margin adjustments
    printWindow.document.write('body { margin: 0; padding: 0; width: 100%; }'); // Remove excessive margins and padding

    // Hide the Shift Date and Shift Name columns in the print version
    printWindow.document.write('@media print {');
    printWindow.document.write('table th:nth-child(2), table td:nth-child(2), table th:nth-child(7), table td:nth-child(7), table th:nth-child(8), table td:nth-child(8) { display: none; }');

    // Ensure no content overflow and prevent extra pages
    printWindow.document.write('table { page-break-inside: auto; }'); // Avoid page breaks within the table
    printWindow.document.write('tr { page-break-inside: avoid; page-break-after: auto; }');

    // Adjust page size and margins to fit content within the printable area
    printWindow.document.write('@page { size: A4; margin-left: 10mm; margin-right: 10mm; margin-top: 10mm; margin-bottom: 10mm; }');
    printWindow.document.write('body { width: 100%; height: auto; padding: 10px; }');
    printWindow.document.write('}');

    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');

    // Display Shift Date and Shift Name on top of the print content
    printWindow.document.write('<h2>Shift Details</h2>');
    printWindow.document.write('<p><strong>Shift Date:</strong> ' + shiftDate + '</p>');
    printWindow.document.write('<p><strong>Shift Name:</strong> ' + shiftName + '</p>');

    // Append the table content to print window (excluding Shift Date and Shift Name)
    printWindow.document.write(document.getElementById('ItemDetails_table').outerHTML);

    printWindow.document.write('</body></html>');
    printWindow.document.close(); // Close the document to ensure rendering
    printWindow.onload = function () {
        printWindow.print(); // Trigger print after the document is loaded
    };
}

