var url;

$(document).ready(function () {

    $.ajax({
        url: '../data.txt',
        async: false,
        cache: false,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    GetVoucherList();
    $("body").on("click", "[src*=plus]", function () {
        $(this).closest("tr").after("<tr><td></td><td colspan = '999'>" + $(this).next().html() + "</td></tr>")
        $(this).attr("src", "/Assets/Images/minus.png");
    });
    $("body").on("click", "[src*=minus]", function () {
        $(this).attr("src", "/Assets/Images/plus.png");
        $(this).closest("tr").next().remove();
    });
    $('body').on("click", "#tblVoucherListMaster .EditVoucher", function () {
        //BindDropDown();
        var row = $(this).closest("tr");
        //var Detailid = row.find(".Detailid").html();
        var Voucherid = row.find(".Voucherid").html();
        sessionStorage.setItem("Voucherid", Voucherid);
        window.location = "../Home/Voucher";
        


    });
});
function GetVoucherList() {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.voucher = {};
    var Voucher = {};
    Voucher.search = "";
    Voucher.id = 0;
    request.voucher = Voucher;
    Common.Ajax('POST', url + 'getvoucher', JSON.stringify(request), 'json', getVoucherListHandler);
}

function getVoucherListHandler(response) {
    console.log(response);

    var row = '';
    $("#tblVoucherListMaster tbody").empty();
    response.model.results.forEach(function (item) {
        debugger;
        row += '<tr><td><img alt="" style="cursor: pointer" src="/Assets/Images/plus.png" /><div id="dvOrders" style="display: none">';
        var html = '<table class="table table-sm" id="tblVoucherListDetail"><thead><tr><th>Account</th><th>Party</th><th>Department</th><th>Reference</th><th>Narration</th><th>Debit</th><th>Credit</th></tr></thead>';
        $.each(item.Details, function (key, items) {
            var ItemCode = '';
            if (items.Customer != null) {
                ItemCode = items.Customer.CustomerCode + '-' + items.Customer.CustomerName;
            }
            debugger;
            html += '<tr><td hidden="hidden" class=Detailid>' + items.id + '</td>' +
                '<td hidden="hidden" class=DepartmentCode>' + items.DepartmentCode + '</td>' +
                '<td hidden="hidden" class=DepartmentName>' + items.DepartmentName + '</td>' +
                '<td hidden="hidden" class=CustomerCode>' + items.CustomerCode + '</td>' +
                '<td hidden="hidden" class=CustomerName>' + items.CustomerName + '</td>' +
                '<td hidden="hidden" class=AccCode>' + items.AccCode + '</td>' +
                '<td hidden="hidden" class=AccountName>' + items.AccountName + '</td>' +
                '<td>' + items.AccCode + '-' + items.AccountName + '</td>' +
                '<td>' + ItemCode + '</td>' +
                '<td>' + items.DepartmentCode + '-' + items.DepartmentName + '</td>' +
               
                
                '<td>' + items.Reference + '</td>' +
                '<td>' + items.Narration + '</td>' +
                '<td>' + items.Debit + '</td>' +
                '<td>' + items.Credit + '</td>' +
                '</tr>';
        });
        row += html + '</table></div></td>';
        //row += '<tr class="EditDVoucher">' +
        row += '<td hidden="hidden" class=Voucherid>' + item.Voucherid + '</td>' +
            '<td hidden="hidden" class=CompanyID>' + item.CompanyID + '</td>' +
            '<td hidden="hidden" class=VoucherTypeId>' + item.VoucherTypeId + '</td>' +
            '<td hidden="hidden" class=VoucherTypeCode>' + item.VoucherTypeCode + '</td>' +
            '<td class=CompanyName>' + item.CompanyName + '</td>' +
            '<td class=VoucherNo>' + item.VoucherNo + '</td>' +
            '<td class=VoucherDate>' + item.VoucherDate + '</td>' +
            '<td class="VoucherTypeName">' + item.VoucherTypeName + '</td>' +
            '<td class="InvoiceType">' + item.InvoiceType + '</td>' +
            '<td class="HeaderReference">' + item.Reference + '</td>' +
            '<td class="HeaderNarration">' + item.Narration + '</td>' +
            '<td class="StatusName">' + item.StatusName + '</td>' +
            '<td class="CreatedBy">' + item.CreatedBy + '</td>' +
            '<td class="CreatedDate">' + item.CreatedDate + '</td>' +
            '<td class="UpdatedBy">' + item.UpdatedBy + '</td>' +
            '<td class="UpdatesDate">' + item.UpdatesDate + '</td>' +
            '<td><a class="btn btn-warning btn-sm EditVoucher" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblVoucherListMaster tbody").append(row);
}