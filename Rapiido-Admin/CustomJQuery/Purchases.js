
var url;
var DeleteRow;
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
    GetUOM();
    GetSupplierInfo();
    GetPurchasesList();
    $('#txtInvoceDate').val(GetCurrentDate());

    $('#bttnPurchases').click(function () {
        ClearDetail();
        ClearHeader();
        //$('#txtInvoceDate').trigger("change");
        $('#addPurchasespopup').modal('show');
    });

    $('body').on("click", "#tblPurRawMaterial .DeleteRawMateralInvoice", function () {

        var row = $(this).closest("tr");
        DeleteRow = $(this).closest("tr");
        var MaterialDesc = row.find(".MaterialDesc").html()
        $('#hfRawMaterialId').val(row.find(".Id").html());
        $('#Msg').html("Are You Sure You Want To Delete! " + MaterialDesc);
        $('#ConfirmationPopup').modal('show');

    });
    $('#bttnYesConfirmation').click(function () {
        DeleteRawMaterial();
    });

    $('body').on("click", "#tblInvoiceListMaster .EditInvoiceMaster", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var request = new Object();

        request.DefaultClientId = DefaultClientId;
        request.PurchaseID = Id;
        Common.Ajax('POST', url + 'GetPurchases_ByID', JSON.stringify(request), 'json', GetPurchasesByIDHandler);
    });
    $('body').on("click", "#tblPurRawMaterial .EditRawMateralInvoice", function () {
        var row = $(this).closest("tr");
        $('#hfRawMaterialId').val(row.find(".RawMaterialId").html());
        $('#ddlUOM').val(row.find(".UOMID").html()).trigger('change');
        $('#txtMaterial').val(row.find(".MaterialDesc").html());
        $('#txtSize').val(row.find(".SizeDesc").html());
        parseFloat($('#txtQty').val(row.find(".Quantity").html()));
        parseFloat($('#txtRate').val(row.find(".Rate").html()));
    });
    $('#bttnAddRawMaterial').click(function () {
        if ($('#hfRawMaterialId').val() == "") {
            CommonFunction.MsgAlertN("Required Material", "Error");
            $('#txtMaterial').removeClass("valid").addClass("invalid");
            $('#txtMaterial').focus();
        }
        else if ($('#ddlUOM').val() == "0") {
            CommonFunction.MsgAlertN("Required UOM", "Error");
            $('#ddlUOM').removeClass("valid").addClass("invalid");
            $('#ddlUOM').focus();
        }
        else if ($('#txtSize').val() == "") {
            CommonFunction.MsgAlertN("Required Size", "Error");
            $('#txtSize').removeClass("valid").addClass("invalid");
            $('#txtSize').focus();
        }
        else if ($('#txtSize').val() <= 0) {
            CommonFunction.MsgAlertN("Size must be Greater then Zero", "Error");
            $('#txtSize').removeClass("valid").addClass("invalid");
            $('#txtSize').focus();
        }
        else if ($('#txtQty').val() == "") {
            CommonFunction.MsgAlertN("Required Quantity", "Error");
            $('#txtQty').removeClass("valid").addClass("invalid");
            $('#txtQty').focus();
        }
        else if ($('#txtQty').val() <= 0) {
            CommonFunction.MsgAlertN("Quantity must be Greater then Zero", "Error");
            $('#txtQty').removeClass("valid").addClass("invalid");
            $('#txtQty').focus();
        }
        else if ($('#txtRate').val() == "") {
            CommonFunction.MsgAlertN("Required Rate", "Error");
            $('#txtRate').removeClass("valid").addClass("invalid");
            $('#txtRate').focus();
        }
        else if ($('#txtRate').val() <= 0) {
            CommonFunction.MsgAlertN("Rate  must be Greater then Zero", "Error");
            $('#txtRate').removeClass("valid").addClass("invalid");
            $('#txtRate').focus();
        }
        else {
            var html = '';
            var Qty = $('#txtQty').val();
            var Rate = $('#txtRate').val();
            var Amount = parseFloat(Qty) * parseFloat(Rate);
            if (CheckDetailExists()) {
                html += '<tr>' +
                    '<td hidden="hidden" class="RawMaterialId">' + $("#hfRawMaterialId").val() + '</td>' +
                    '<td hidden="hidden" class=UOMID>' + $('#ddlUOM').val() + '</td>' +
                    '<td class=MaterialDesc>' + $('#txtMaterial').val() + '</td>' +
                    '<td class=UOMDEsc>' + $('#ddlUOM option:selected').text() + '</td>' +
                    '<td class=SizeDesc >' + $('#txtSize').val() + '</td>' +
                    '<td class=Quantity >' + parseFloat(Qty) + '</td>' +
                    '<td class=Rate >' + parseFloat(Rate) + '</td>' +
                    '<td class=Amount >' + parseFloat(Amount) + '</td>' +
                    '<td><a class="btn btn-warning btn-sm EditRawMateralInvoice" href="javascript:;"><i class="fa fa-edit"></i></a> <a class="btn btn-danger btn-sm DeleteRawMateralInvoice" href="javascript:;"><i class="fa fa-trash"></i></a></td>' +

                    '</tr>';
                $('#tblPurRawMaterial tbody').append(html);
            }
            else {
                $("#tblPurRawMaterial tbody").find("tr").each(function () {

                    var RawMaterialId = $(this).find(".RawMaterialId").text();
                    var Id = $('#hfRawMaterialId').val();
                    if (RawMaterialId == Id) {
                        $(this).find(".RawMaterialId").text($('#hfItemId').val());
                        $(this).find(".UOMID").text($('#ddlUOM').val());
                        $(this).find(".MaterialDesc").text($('#txtMaterial').val());
                        $(this).find(".UOMDEsc").text($('#ddlUOM option:selected').text());
                        $(this).find(".SizeDesc").text($('#txtSize').val());
                        $(this).find(".Quantity").text(parseFloat(Qty));
                        $(this).find(".Rate").text(parseFloat(Rate));
                        $(this).find(".Amount").text(parseFloat(Amount));
                    }
                });
            }
            ClearDetail();
        }

    })
    $('#txtInvoceDate').change(function () {
        var date = $('#txtInvoceDate').val();
        var day = date.split('-');
        //"2022-04-19"
        var formatteddate = day[0] + '-' + day[1] + '-' + day[2];
        var request = new Object();
        request.InvoiceDate = formatteddate;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetInvoiceNo', JSON.stringify(request), 'json', GetInvoiceNoHandler);
    });
    $('#txtMaterial').autocomplete({
        
        source: function (request, response) {
            debugger;
            var request = new Object();
            request.MaterialDesc = $('#txtMaterial').val();
            request.DefaultClientId = DefaultClientId;
            $("#hfRawMaterialId").val('');
            var autocompleteUrl = url + 'GetRawMaterial';
            $.ajax({
                url: autocompleteUrl,
                type: 'POST',
                cache: false,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(request),
                success: function (json) {
                    // call autocomplete callback method with results 
                    debugger;
                    if (json.length == 0) {
                        $('#txtMaterial').val('');
                        $("#hfRawMaterialId").val('');
                    }
                    response($.map(json, function (data, id) {
                        return {
                            label: data.MaterialDesc,
                            value: data.MaterialDesc,
                            Id: data.Id
                        };
                    }));
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    console.log('some error occured', textStatus, errorThrown);
                }
            });
        },
        minLength: 2,

        select: function (event, ui) {
            $('#txtMaterial').val(ui.item.label);
            $("#hfRawMaterialId").val(ui.item.Id);

            return false;
        }
    });

    $('#btnSaveInvoice').click(function () {
        if ($('#txtInvoceDate').val() == "") {
            CommonFunction.MsgAlertN("Invoice Date Required", "Error");
        }
        else if ($('#ddlVendor').val() == "0") {
            CommonFunction.MsgAlertN("Required Vendor", "Error");
            $('#ddlVendor').removeClass("valid").addClass("invalid");
            $('#ddlVendor').focus();
        }
        else if ($('#ddlPaymentMode').val() == "0") {
            CommonFunction.MsgAlertN("Required Payment", "Error");
            $('#ddlPaymentMode').removeClass("valid").addClass("invalid");
            $('#ddlPaymentMode').focus();
        }
        else if ($("#tblPurRawMaterial tbody tr").length < 1) {
            CommonFunction.MsgAlertN("Required atleast one item", "Error");
        }
        else {
            if ($('#hfPurchaseId').val() == "") {
                AddPurchases();
            }
            else {
                UpdatePurchase();
            }

        }

    });
    $("body").on("click", "[src*=plus]", function () {
        $(this).closest("tr").after("<tr><td></td><td colspan = '999'>" + $(this).next().html() + "</td></tr>")
        $(this).attr("src", "/Assets/Images/minus.png");
    });
    $("body").on("click", "[src*=minus]", function () {
        $(this).attr("src", "/Assets/Images/plus.png");
        $(this).closest("tr").next().remove();
    });
});
function DeleteRawMaterial() {
    DeleteRow.closest("tr").remove();
    $('#ConfirmationPopup').modal('hide');
    DeleteRow = '';
}
function GetPurchasesByIDHandler(response) {
    response.Data.forEach(function (item) {
        $('#hfPurchaseId').val(item.Id);
        $('#txtInvoceDate').val(item.strPurchaseDate);
        $('#txtInvoceNo').val(item.InvoiceNumber);
        $('#ddlVendor').val(item.SupplierInfoId).trigger('change');
        $('#ddlPaymentMode').val(item.PaymentType).trigger('change');
        var html = '';
        $.each(item.PurchaseDetails, function (key, items) {
            html += '<tr>' +
                '<td hidden="hidden" class="RawMaterialId">' + items.RawMaterialId + '</td>' +
                '<td hidden="hidden" class=UOMID>' + items.UOMId + '</td>' +
                '<td class=MaterialDesc>' + items.MaterialDesc + '</td>' +
                '<td class=UOMDEsc>' + items.UnitType + '</td>' +
                '<td class=SizeDesc >' + items.SizeDesc + '</td>' +
                '<td class=Quantity >' + parseFloat(items.QtyDesc) + '</td>' +
                '<td class=Rate >' + parseFloat(items.Rate) + '</td>' +
                '<td class=Amount >' + parseFloat(items.Amount) + '</td>' +
                '<td><a class="btn btn-warning btn-sm EditRawMateralInvoice" href="javascript:;"><i class="fa fa-edit"></i></a> <a class="btn btn-danger btn-sm DeleteRawMateralInvoice" href="javascript:;"><i class="fa fa-trash"></i></a></td>' +

                '</tr>';
        });
        $('#tblPurRawMaterial tbody').append(html);
    });
    $('#addPurchasespopup').modal('show');
}
function CheckDetailExists() {
    debugger;
    var Result = true;
    var RawMaterialId = $('#hfRawMaterialId').val();
    var UomId = $('#ddlUOM').val();

    $("#tblPurRawMaterial tbody TR").each(function () {
        var row = $(this);
        var tdRawMaterialId = row.find(".RawMaterialId").html();
        var tdUomId = row.find(".UOMID").html();

        if (tdRawMaterialId == RawMaterialId && tdUomId == UomId) {
            Result = false;
            return false;
        }
        else {
            Result = true;
        }
    });
    return Result;


}
function AddPurchases() {

    var Isactive = false;
    if ($("#ChkIsInvoiceActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.SupplierInfoId = $('#ddlVendor').val();
    request.PaymentType = $('#ddlPaymentMode').val();
    request.InvoiceNumber = $('#txtInvoceNo').val();
    request.PurchaseDate = $('#txtInvoceDate').val();
    request.CreatedBy = parseInt(UserId);
    request.IsActive = Isactive;
    request.DefaultClientId = DefaultClientId;
    request.PurchaseDetails = new Array();
    $("#tblPurRawMaterial TBODY TR").each(function () {
        var Detail = {};
        var row = $(this);
        Detail.PurchasesId = parseInt(0);
        Detail.UOMId = row.find(".UOMID").html();
        Detail.RawMaterialId = row.find(".RawMaterialId").html();
        Detail.SizeDesc = parseFloat(row.find(".SizeDesc").html());
        Detail.QtyDesc = parseFloat(row.find(".Quantity").html());
        Detail.Rate = parseFloat(row.find(".Rate").html());
        Detail.Amount = parseFloat(row.find(".Amount").html());
        request.PurchaseDetails.push(Detail);
    });
    JSON.stringify(request);
    Common.Ajax('POST', url + 'InsertPurchases', JSON.stringify(request), 'json', InsertPurchasesHandler);


}
function UpdatePurchase() {

    var Isactive = false;
    if ($("#ChkIsInvoiceActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = {};
    request.Id = $('#hfPurchaseId').val();
    request.SupplierInfoId = $('#ddlVendor').val();
    request.PaymentType = $('#ddlPaymentMode').val();
    request.InvoiceNumber = $('#txtInvoceNo').val();
    request.PurchaseDate = $('#txtInvoceDate').val();
    request.CreatedBy = parseInt(UserId);
    request.IsActive = Isactive;
    request.DefaultClientId = DefaultClientId;
    request.PurchaseDetails = new Array();
    $("#tblPurRawMaterial TBODY TR").each(function () {
        var Detail = {};
        var row = $(this);
        Detail.PurchasesId = parseInt(0);
        Detail.UOMId = row.find(".UOMID").html();
        Detail.RawMaterialId = row.find(".RawMaterialId").html();
        Detail.SizeDesc = parseFloat(row.find(".SizeDesc").html());
        Detail.QtyDesc = parseFloat(row.find(".Quantity").html());
        Detail.Rate = parseFloat(row.find(".Rate").html());
        Detail.Amount = parseFloat(row.find(".Amount").html());
        request.PurchaseDetails.push(Detail);
    });
    JSON.stringify(request);
    Common.Ajax('POST', url + 'UpdatePurchases', JSON.stringify(request), 'json', InsertPurchasesHandler);


}
function GetPurchasesList() {

    var request = new Object();

    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetPurchases', JSON.stringify(request), 'json', GetPurchasesListHandler);
}
function GetPurchasesListHandler(response) {
    debugger
    console.log(response);
    var row = '';
    $("#tblInvoiceListMaster tbody").empty();
    response.Data.forEach(function (item) {
        var amount = 0
        row += '<tr><td><img alt="" style="cursor: pointer" src="/Assets/Images/plus.png" /><div id="dvpurchases" style="display: none">';
        var html = '<table class="table table-sm" id="tblInvoiceListDetail"><thead><tr><th>Material</th><th>UnitType</th><th>Size</th><th>Rate</th><th>Qty</th><th>Amount</th></tr></thead>';
        $.each(item.PurchaseDetails, function (key, items) {

            html += '<tr>' +
                '<td class=MaterialDesc>' + items.MaterialDesc + '</td>' +
                '<td class=UnitType>' + items.UnitType + '</td>' +
                '<td class=SizeDesc>' + items.SizeDesc + '</td>' +
                '<td class=Rate>' + items.Rate + '</td>' +
                '<td class=QtyDesc>' + items.QtyDesc + '</td>' +
                '<td class=Amount>' + items.Amount + '</td>' +
                '</tr>'
            amount += parseFloat(items.Amount);
        });
        html += '<tfoot><tr><td></td><td></td><td></td><td></td><td style="font-weight: 700;">Total</td><td style="font-weight: 700;">' + amount + '</td></tr></tfoot>';
        row += html + '</table></div></td>';
        row += '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=SupplierInfoId>' + item.SupplierInfoId + '</td>' +
            '<td hidden="hidden" class=PaymentType>' + item.PaymentType + '</td>' +
            '<td class=SupplierName>' + item.SupplierName + '</td>' +
            '<td class=InvoiceNumber>' + item.InvoiceNumber + '</td>' +
            '<td class=PaymentDesc>' + item.PaymentDesc + '</td>' +
            '<td class=strPurchaseDate>' + item.strPurchaseDate + '</td>' +
            '<td class="UserName">' + item.UserName + '</td>' +

            '<td><a class="btn btn-warning btn-sm EditInvoiceMaster" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblInvoiceListMaster tbody").append(row);
}
function GetCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    //"2022-04-19"
    today = yyyy + '-' + mm + '-' + dd;
    //today = mm + '/' + dd + '/' + yyyy;

    return today;
}
function GetInvoiceNoHandler(response) {
    console.log(response);
    if (response.HasError == false) {
        $('#txtInvoceNo').val(response.Message);
    }
    else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function InsertPurchasesHandler(response) {
    console.log(response);
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearDetail();
        ClearHeader();
    }
    else {
        CommonFunction.MsgAlertN(response.Message, "Error");
    }
}
function GetUOM() {
    var request = new Object();

    request.ClientId = DefaultClientId;
    Common.Ajax('GET', url + 'GetUOM', request, 'json', GetUOMHandler);
}
function GetUOMHandler(response) {

    var row = '';
    $('#ddlUOM').html('');
    row += '<option value=0>--Select--</option>';
    response.forEach(function (item) {

        row += '<option value=' + item.Id + '>' + item.UnitType + '</option>';
    });
    $('#ddlUOM').html(row);
    $("#ddlUOM").select2({
        dropdownParent: $("#addPurchasespopup")
    });
}
function GetSupplierInfo() {
    var LoginRequest = new Object();

    LoginRequest.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetSupplierInfo', JSON.stringify(LoginRequest), 'json', GetVendosHandler);
}
function GetVendosHandler(response) {
    $('#ddlVendor').html('');
    var row = ''
    row += '<option value=0>--Select--</option>';
    $.each(response, function (i, item) {
        row += '<option value=' + item.Id + '>' + item.FirstName + '</option>';



    });
    $('#ddlVendor').prepend(row);
    $("#ddlVendor").select2({
        dropdownParent: $("#addPurchasespopup")
    });
}
function ClearDetail() {
    $('#txtMaterial').val('');
    $('#ddlUOM').val(0).trigger('change');
    $('#txtSize').val('');
    $('#txtQty').val('');
    $('#txtRate').val('');
    $('#hfRawMaterialId').val('');
}
function ClearHeader() {
    $('#txtInvoceDate').val(GetCurrentDate());
    $('#txtInvoceDate').trigger("change");
    $('#ddlVendor').val(0).trigger('change');
    $('#ddlPaymentMode').val(0).trigger('change');
    $('#tblPurRawMaterial tbody').html('');
    $('#addPurchasespopup').modal('hide');
    $('#ConfirmationPopup').modal('hide');
    $('#hfPurchaseId').val('');
    GetPurchasesList();
}