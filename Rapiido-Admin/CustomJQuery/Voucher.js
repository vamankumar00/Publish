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

    //$('#reservationdate').datetimepicker({
    //    format: 'L',
    //    allowInputToggle: true
    //}); 
    BindVoucherType();
    var VoucherId = sessionStorage.getItem("Voucherid");
    if (VoucherId != null || typeof (VoucherId) == 'undefined') {

        GetVoucherList(VoucherId);
    }
  
    $('#btnClearVoucher').click(function () {
        location.reload(true);
    });
    $('#ddlVoucherType').change(function () {


        var VoucherTypeId = $('#ddlVoucherType').val();
        var date = $('#VoucherDate').val();
        if ($('#HFVoucherId').val() == "") {
            if (date != "" && VoucherTypeId != "") {
                GetVoucherNo();
            }
        }

    });

    $('#VoucherDate').change(function () {
        var VoucherTypeId = $('#ddlVoucherType').val();
        var date = $('#VoucherDate').val();
        if ($('#HFVoucherId').val() == "") {
            if (date != "" && VoucherTypeId != "0") {
                GetVoucherNo();
            }
        }
    });
    $('#txtDebit').change(function () {
        if ($('#txtDebit').val() > 0) {
            $('#txtCredit').attr("disabled", true);
            $('#txtDebit').attr("disabled", false);
            $('#txtCredit').val(0);
        }
        else {
            $('#txtDebit').attr("disabled", true);
            $('#txtCredit').attr("disabled", false);
            $('#txtCredit').focus();

        }

    });
    $('#txtCredit').change(function () {
        if ($('#txtCredit').val() > 0) {
            $('#txtDebit').attr("disabled", true);
            $('#txtCredit').attr("disabled", false);
            $('#txtDebit').val(0);
        }
        else {
            $('#txtCredit').attr("disabled", true);
            $('#txtDebit').attr("disabled", false);
            $('#txtDebit').focus();

        }

    });
    $('#txtAccountCode').autocomplete({

        source: function (request, response) {
            var Datarequest = {};
            Datarequest.companyid = parseInt(CompanyId);
            Datarequest.sortBy = "";
            Datarequest.startwith = 0;
            Datarequest.numberOfRecords = 0;
            Datarequest.coa = {};
            var Coa = {};
            Coa.code = request.term;
            Coa.id = 0;
            Datarequest.coa = Coa;
            var autocompleteUrl = url + 'getcoa';
            $.ajax({
                url: autocompleteUrl,
                type: 'POST',
                cache: false,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(Datarequest),
                success: function (json) {
                    // call autocomplete callback method with results 

                    if (json.length == 0) {

                    }
                    response($.map(json.model.results, function (data, id) {
                        return {
                            label: data.AccCode + '-' + data.AccountName,
                            value: data.AccCode + '-' + data.AccountName,
                            AccountName: data.AccountName,
                            AccID: data.AccID,
                            Code: data.AccCode
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
            $('#txtAccountCode').val(ui.item.label);
            $('#hfAccID').val(ui.item.AccID);
            $('#hfAccCode').val(ui.item.Code);
            $('#hfAccountName').val(ui.item.AccountName);
            var Datarequest = {};
            Datarequest.companyid = parseInt(CompanyId);
            Datarequest.sortBy = "";
            Datarequest.startwith = 0;
            Datarequest.numberOfRecords = 0;
            Datarequest.coa = {};
            var Coa = {};
            Coa.code = "";
            Coa.id = parseInt($('#hfAccID').val());
            Datarequest.coa = Coa;
            Common.Ajax('POST', url + 'coa/parties', JSON.stringify(Datarequest), 'json', getPartiesHandler);
            return false;
        }
    });
    $('#txtDepartment').autocomplete({

        source: function (request, response) {
            var Datarequest = {};
            Datarequest.companyid = parseInt(CompanyId);
            Datarequest.sortBy = "";
            Datarequest.startwith = 0;
            Datarequest.numberOfRecords = 0;
            Datarequest.department = {};
            var Department = {};
            Department.code = request.term;
            Department.id = 0;
            Datarequest.department = Department;
            var autocompleteUrl = url + 'getdepartment';
            $.ajax({
                url: autocompleteUrl,
                type: 'POST',
                cache: false,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(Datarequest),
                success: function (json) {
                    // call autocomplete callback method with results 

                    if (json.length == 0) {

                    }
                    response($.map(json.model.results, function (data, id) {
                        return {
                            label: data.Code + '-' + data.Name,
                            value: data.Code + '-' + data.Name,
                            Code: data.Code,
                            Name: data.Name,
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
            $('#txtDepartment').val(ui.item.label);
            $('#hfDepartmentId').val(ui.item.Id);
            $('#hfDepartmentCode').val(ui.item.Code);
            $('#hfDepartmentName').val(ui.item.Name);
            /* $('#hfAccID').val(ui.item.AccID);*/

            return false;
        }
    });

    var LineNumber = 0;
    $('#bttnAddVoucher').click(function () {
        var html = '';

        if ($('#txtAccountCode').val() == '') {
            CommonFunction.MsgAlert('Control code required');
            $('#txtAccountCode').focus();
            return;
        }
        if ($('#txtDepartment').val() == '') {
            CommonFunction.MsgAlert('Department code required');
            $('#txtDepartment').focus();
            return;
        }
        if ($('#txtDebit').val() == '' || $('#txtCredit').val() == '') {
            CommonFunction.MsgAlert('Debit/Credit required');
                       $('#txtCredit').focus();
            return;
        }
        if (CheckVoucherDetailExists()) {
            debugger;
            if ($('#HFVoucherDetailId').val() == "") {
                html += '<tr>' +
                    '<td hidden="hidden" class=AccID>' + $('#hfAccID').val() + '</td>' +
                    '<td hidden="hidden" class=RefDetail>' + $('#txtRefDetail').val() + '</td>' +
                    '<td hidden="hidden" class=CustomerId>' + $('#hfCustomerId').val() + '</td>' +
                    '<td hidden="hidden" class=VendorId>' + $('#hfVendorId').val() + '</td>' +
                    '<td hidden="hidden" class=LineNumber>' + LineNumber + '</td>' +
                    '<td hidden="hidden" class=DepartmentId>' + $('#hfDepartmentId').val() + '</td>' +
                    '<td class=AccCode>' + $('#hfAccCode').val() + '</td>' +
                    '<td class=AccountName>' + $('#hfAccountName').val() + '</td>' +
                    '<td class=PartCode >' + $('#hfCustomerCode').val() + '</td>' +
                    '<td class=PartDesc >' + $('#txtvendor').val() + '</td>' +
                    '<td class=CategoryCode >' + $('#txtCategory').val() + '</td>' +
                    '<td class=CategoryDesc >' + $('#txtCategory').val() + '</td>' +
                    '<td class=DepartmentCode >' + $('#hfDepartmentCode').val() + '</td>' +
                    '<td class=DepartmentName >' + $('#hfDepartmentName').val() + '</td>' +
                
                    '<td class=Narration >' + $('#txtNarration').val() + '</td>' +
                    '<td class=debit >' + $('#txtDebit').val() + '</td>' +
                    '<td class=credit >' + $('#txtCredit').val() + '</td>' +
                    '</tr>';
                $('#tblVoucher tbody').append(html);
                LineNumber++;
            }
            else {
                debugger;
                $("#tblVoucher tbody").find("tr").each(function () {

                    var DetailId = $(this).find(".id").text();
                    var Id = $('#HFVoucherDetailId').val();
                    if (DetailId == Id) {
                        $(this).find(".AccID").text($('#hfAccID').val());
                        $(this).find(".RefDetail").text($('#txtRefDetail').val());
                        $(this).find(".CustomerId").text($('#hfCustomerId').val());
                        $(this).find(".VendorId").text($('#hfVendorId').val());
                        //$(this).find(".LineNumber").text($('#txtCredit').val());
                        $(this).find(".DepartmentId").text($('#hfDepartmentId').val());
                        $(this).find(".AccCode").text($('#hfAccCode').val());
                        $(this).find(".AccountName").text($('#hfAccountName').val());
                        $(this).find(".PartCode").text($('#hfCustomerCode').val());
                        $(this).find(".PartDesc").text($('#txtvendor').val());
                        $(this).find(".CategoryCode").text($('#txtCategory').val());
                        $(this).find(".CategoryDesc").text($('#txtCategory').val());
                        $(this).find(".DepartmentCode").text($('#hfDepartmentCode').val());
                        $(this).find(".DepartmentName").text($('#hfDepartmentName').val());
                        
                        $(this).find(".Narration").text($('#txtNarration').val());
                        $(this).find(".debit").text($('#txtDebit').val());
                        $(this).find(".credit").text($('#txtCredit').val());
                    }
                });
            }
            DetailClear(); 
        }
        else {
            CommonFunction.MsgAlert('Same Record Alredy Exists');
        }
       
        calculateColumn();
        //DetailClear();
    });
    $('body').on("click", "#tblVoucher .EditVoucher", function () {
        var row = $(this).closest("tr");
        var Accid = row.find(".AccID").html();

        $('#hfAccID').val(row.find(".AccID").html());
        $('#txtRefDetail').val(row.find(".RefDetail").html());
        $('#hfCustomerId').val(row.find(".CustomerId").html());
        $('#hfVendorId').val(row.find(".VendorId").html());
        $('#hfLineNumber').val(row.find(".LineNumber").html());
        $('#hfDepartmentId').val(row.find(".DepartmentId").html());
        $('#hfAccCode').val(row.find(".AccCode").html());
        $('#hfAccountName').val(row.find(".AccountName").html());
        $('#hfCustomerCode').val(row.find(".PartCode").html());
        $('#txtvendor').val(row.find(".PartCode").html() + '-' + row.find(".PartDesc").html());
        $('#hfDepartmentCode').val(row.find(".DepartmentCode").html());
        $('#hfDepartmentName').val(row.find(".DepartmentName").html());
        $('#txtDepartment').val(row.find(".DepartmentCode").html() + '-' + row.find(".DepartmentName").html());
        $('#txtAccountCode').val(row.find(".AccCode").html() + '-' + row.find(".AccountName").html());
        $('#txtCategory').val(row.find(".CategoryCode").html());
        $('#txtNarration').val(row.find(".Narration").html());
        $('#txtDebit').val(row.find(".debit").html());
        $('#txtCredit').val(row.find(".credit").html());
        var Id = row.find(".id").html();
        $('#HFVoucherDetailId').val(Id);
        var Datarequest = {};
        Datarequest.companyid = parseInt(CompanyId);
        Datarequest.sortBy = "";
        Datarequest.startwith = 0;
        Datarequest.numberOfRecords = 0;
        Datarequest.coa = {};
        var Coa = {};
        Coa.code = "";
        Coa.id = parseInt($('#hfAccID').val());
        Datarequest.coa = Coa;
        Common.Ajax('POST', url + 'coa/parties', JSON.stringify(Datarequest), 'json', getPartiesHandler);
    });
    $('#btnSaveAccountType').click(function () {
        if ($('#VoucherDate').val() == '' || $('#VoucherDate').val() == 'undefined') {
            CommonFunction.MsgAlert('Date is required');

            $('#VoucherDate').focus();
           
            return;
        }
        if ($('#HFVoucherId').val() == "") {
            debugger;
            var request = {};
            request.CompanyID = parseInt(CompanyId);
            request.VoucherNo = $('#txtVoucherNo').val();
            request.VoucherDate = $('#VoucherDate').val();
            request.VoucherTypeId = $('#ddlVoucherType').val();
            request.InvoiceType = $('#ddlInvoiceType option:selected').text();
            request.Reference = $('#txtHeaderRef').val();
            request.CustomerVendorDescription = "";
            request.FileName = "";
            request.StatusId = 1;
            request.CreatedBy = parseInt(UserId);
            request.Details = new Array();
            $("#tblVoucher TBODY TR").each(function () {
                var row = $(this);
                var voucherDetail = {};
                voucherDetail.AccID = row.find(".AccID").html();
                voucherDetail.AccCode = row.find(".AccCode").html();
                voucherDetail.Debit = parseFloat(row.find(".debit").html());
                voucherDetail.Credit = parseFloat(row.find(".credit").html());
                voucherDetail.Reference = row.find(".RefDetail").html();
                voucherDetail.Narration = row.find(".Narration").html();
                voucherDetail.LineNumber = row.find(".LineNumber").html();
                voucherDetail.CustomerId = row.find(".CustomerId").html() == "" || row.find(".CustomerId").html() == "undefined"  ? null : row.find(".CustomerId").html();
                voucherDetail.VendorId = row.find(".VendorId").html() == "" || row.find(".VendorId").html() == "undefined" ? null : row.find(".VendorId").html();
                voucherDetail.ItemId = 0;
                voucherDetail.DepartmentId = row.find(".DepartmentId").html();
                request.Details.push(voucherDetail);

            });
            console.log(JSON.stringify(request));
            var file = new FormData();
            var files = $("#VoucherInputFile").get(0).files;

            file.append("file", files[0]);
            file.append("request", JSON.stringify(request));
            CommonDataform.Ajax('POST', url + 'voucher', file, AddVoucherHandler);
        }
        else {
            var request = {};
            request.Id = $('#HFVoucherId').val();
            request.CompanyID = parseInt(CompanyId);
            request.VoucherNo = $('#txtVoucherNo').val();
            request.VoucherDate = $('#VoucherDate').val();
            request.VoucherTypeId = $('#ddlVoucherType').val();
            request.InvoiceType = $('#ddlInvoiceType option:selected').text();
            request.Reference = $('#txtHeaderRef').val();
            request.CustomerVendorDescription = "";
            request.FileName = "";
            request.StatusId = 1;
            request.UpdatedBy = parseInt(UserId);
            request.Details = new Array();
            $("#tblVoucher TBODY TR").each(function () {
                var row = $(this);
                var voucherDetail = {};
                voucherDetail.AccID = row.find(".AccID").html();
                voucherDetail.AccCode = row.find(".AccCode").html();
                voucherDetail.Debit = parseFloat(row.find(".debit").html());
                voucherDetail.Credit = parseFloat(row.find(".credit").html());
                voucherDetail.Reference = row.find(".RefDetail").html();
                voucherDetail.Narration = row.find(".Narration").html();
                voucherDetail.LineNumber = row.find(".LineNumber").html();
                voucherDetail.CustomerId = row.find(".CustomerId").html() == "" || row.find(".CustomerId").html() == "undefined" ? null : row.find(".CustomerId").html();
                voucherDetail.VendorId = row.find(".VendorId").html() == "" || row.find(".VendorId").html() == "undefined" ? null : row.find(".VendorId").html();

                voucherDetail.ItemId = 0;
                voucherDetail.DepartmentId = row.find(".DepartmentId").html();
                request.Details.push(voucherDetail);

            });
            debugger;
            console.log(JSON.stringify(request));
            var file = new FormData();
            var files = $("#VoucherInputFile").get(0).files;

            file.append("file", files[0]);
            file.append("request", JSON.stringify(request));
            CommonDataform.Ajax('POST', url + 'voucher/for-edit', file, UpdateVoucherHandler);
        }


    });
});
function CheckVoucherDetailExists() {
    debugger;
    var Result = true;
    //AccID, CustomerId, VendorId, DepartmentId, amount
    var Accid = $('#hfAccID').val();
    var CustomerId = $('#hfCustomerId').val();
    var VendorId = $('#hfVendorId').val();
    var DepartmentId = $('#hfDepartmentId').val();
    $("#tblVoucher TBODY TR").each(function () {
        var row = $(this);
        var tdAccid = row.find(".AccID").html();
        var tdCustomerId = row.find(".CustomerId").html();
        var tdVendorId = row.find(".VendorId").html();
        var tdDepartmentId = row.find(".DepartmentId").html();

        if (tdAccid == Accid && (tdCustomerId == CustomerId || tdVendorId == VendorId) && tdDepartmentId == DepartmentId) {
            Result = false;
            return false;
        }
        else {
            Result = true;
        }
    });
    return Result;

    
}

function UpdateVoucherHandler(response) {
    debugger;
    console.log(response);
    if (response.isSuccess == true) {
        CommonFunction.MsgAlert('Voucher#:' + response.voucherNo + ' has been Updated Successfully');
        HeaderClear();
        DetailClear();

    }
    else {
        CommonFunction.MsgAlert(response.errors);
    }
     
}
function DetailClear() {
    $('#hfAccID').val('');
    $('#txtRefDetail').val('');
    $('#hfCustomerId').val('');
    $('#hfVendorId').val('');
    $('#hfLineNumber').val('');
    $('#hfDepartmentId').val('');
    $('#hfAccCode').val('');
    $('#hfAccountName').val('');
    $('#hfCustomerCode').val('');
    $('#txtvendor').val('');
    $('#hfDepartmentCode').val('');
    $('#hfDepartmentName').val('');
    $('#txtDepartment').val('');
    $('#txtAccountCode').val('');
    $('#txtCategory').val('');
    $('#txtNarration').val('');
    $('#txtDebit').val('');
    $('#txtCredit').val('');
    $('#HFVoucherDetailId').val('');
}
function HeaderClear() {
    $('$ddlVoucherType').val(0).trigger('change');
    $('#VoucherDate').val('');
    $('#txtVoucherNo').val('');
    $('#txtHeaderRef').val('');
    $('#VoucherInputFile').val('')
}
function GetVoucherList(Id) {
    var request = {};
    request.companyid = parseInt(CompanyId);
    request.sortBy = "";
    request.startwith = 0;
    request.numberOfRecords = 0;
    request.voucher = {};
    var Voucher = {};
    Voucher.search = "";
    Voucher.id = parseInt(Id);
    request.voucher = Voucher;
    Common.Ajax('POST', url + 'getvoucher', JSON.stringify(request), 'json', getVoucherListHandler);
}
function getVoucherListHandler(response) {
    debugger;
    //response.model.results[0].documents[0].fileNameWithExtension
    //response.model.results[0].documents[0].id
    //var DocId = response.model.results[0].documents[0].id;

    //var URL = "http://116.71.130.253/api/v1/voucher" + parseInt(DocId)
    //$('#DownloadFile').attr("href", "http://116.71.130.253/api/v1/voucher/16/documents/as-download/11");
    console.log(response);
    response.model.results.forEach(function (item) {
        debugger;
        if (item.documents != null) {
            var DocId = item.documents[0].id;
            var URL = "http://116.71.130.253/api/v1/voucher/" + parseInt(item.Voucherid) + "/documents/as-download/" + parseInt(DocId);
            $('#DownloadFile').show();
            $('#DownloadFile').attr("href", URL);
        }
        
        console.log(item.VoucherDate);
        var day = item.VoucherDate.split('/');
        $('#HFVoucherId').val(item.Voucherid);
        $('#txtVoucherNo').val(item.VoucherNo);
        $('#VoucherDate').val(day[2] + '-' + day[1] + '-' + day[0]) 
        $('#ddlVoucherType').val(item.VoucherTypeId).trigger('change');
        $('#ddlInvoiceType option:selected').text(item.InvoiceType);
        $('#txtHeaderRef').val(item.Reference);

        var html = '';
        $.each(item.Details, function (key, items) {
            var CustomerId;
            var VendorId;
            var PartyCode;
            var PartyDesc;
            if (items.Customer != null) {
                CustomerId = items.Customer.CustomerId;
                PartyCode = items.Customer.CustomerCode;
                PartyDesc = items.Customer.CustomerName;
            }
            if (items.Vendor != null) {
                VendorId = items.Vendor.VendorId;
                PartyCode = items.Vendor.VendorCode;
                PartyDesc = items.Vendor.VendorName;
            }
            html += '<tr>' +
                '<td hidden="hidden" class=AccID>' + items.AccID + '</td>' +
                '<td hidden="hidden" class=RefDetail>' + items.Reference + '</td>' +
                '<td hidden="hidden" class=CustomerId>' + CustomerId + '</td>' +
                '<td hidden="hidden" class=VendorId>' + VendorId + '</td>' +
                '<td hidden="hidden" class=LineNumber>' + items.LineNumber + '</td>' +
                '<td hidden="hidden" class=DepartmentId>' + items.DepartmentId + '</td>' +
                '<td class=AccCode>' + items.AccCode + '</td>' +
                '<td class=AccountName>' + items.AccountName + '</td>' +
                '<td class=PartCode >' + PartyCode + '</td>' +
                '<td class=PartDesc >' + PartyDesc + '</td>' +
                '<td class=CategoryCode > </td>' +
                '<td class=CategoryDesc ></td>' +
                '<td class=DepartmentCode >' + items.DepartmentCode + '</td>' +
                '<td class=DepartmentName >' + items.DepartmentName + '</td>' +
                
                '<td class=Narration >' + items.Narration + '</td>' +
                '<td class=debit >' + items.Debit + '</td>' +
                '<td class=credit >' + items.Credit + '</td>' +
                '<td hidden="hidden" class=id >' + items.id + '</td>' +
                '<td><a class="btn btn-warning btn-sm EditVoucher" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
                '</tr>';


        });
        $('#tblVoucher tbody').append(html);
        calculateColumn();
    });
    sessionStorage.removeItem("Voucherid");
}
function AddVoucherHandler(response) {
    debugger;
    console.log(response);
    if (response.isSuccess == true) {

        CommonFunction.MsgAlert('New Voucher Added Successfully & Voucher#:' + response.voucherNo);
        HeaderClear();
        DetailClear();
    }
    else {
        CommonFunction.MsgAlert(response.errors);
    }
}
function calculateColumn() {
    $('#tblVoucher tfoot td').eq(9).text('');
    $('#tblVoucher tfoot td').eq(10).text('');
    var Drtotal = 0;
    var Crtotal = 0;
    $('#tblVoucher tbody tr').each(function () {
        debugger;
        var Drvalue = parseInt($('td', this).eq(15).text());
        var Crvalue = parseInt($('td', this).eq(16).text());
        if (!isNaN(Drvalue)) {
            Drtotal += Drvalue;
        }
        if (!isNaN(Crvalue)) {
            Crtotal += Crvalue;
        }
    });
    $('#tblVoucher tfoot td').eq(9).text(Drtotal);
    $('#tblVoucher tfoot td').eq(10).text(Crtotal);
    if (Drtotal == Crtotal) {
        $('#btnSaveAccountType').removeAttr("disabled");
    }
    else {
        $("#btnSaveAccountType").attr("disabled", true);
    }
}
function getPartiesHandler(response) {
    debugger;
    if (response.model.results[0].Customers.length > 0) {
        console.log(response.model.results[0].Customers);
        var Datarequest = {};
        Datarequest.companyid = parseInt(CompanyId);
        Datarequest.sortBy = "";
        Datarequest.startwith = 0;
        Datarequest.numberOfRecords = 0;
        Datarequest.customer = {};
        var Customer = {};
        Customer.code = "";
        Customer.id = 0;
        Datarequest.customer = Customer;

        $('#txtvendor').autocomplete({

            source: function (request, response) {
                var Datarequest = {};
                Datarequest.companyid = parseInt(CompanyId);
                Datarequest.sortBy = "";
                Datarequest.startwith = 0;
                Datarequest.numberOfRecords = 0;
                Datarequest.customer = {};
                var Customer = {};
                Customer.code = request.term;
                Customer.id = 0;
                Datarequest.customer = Customer;
                var autocompleteUrl = url + 'getcustomer';
                $.ajax({
                    url: autocompleteUrl,
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(Datarequest),
                    success: function (json) {
                        // call autocomplete callback method with results 

                        if (json.length == 0) {

                        }
                        response($.map(json.model.results, function (data, id) {
                            return {
                                label: data.CustomerDescription,
                                value: data.CustomerDescription,
                                Id: data.Id,
                                Code: data.Code
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
                $('#txtvendor').val(ui.item.label);
                $('#hfCustomerId').val(ui.item.Id);
                $('#hfCustomerCode').val(ui.item.Code);
                return false;
            }
        });


        //Common.Ajax('POST', url + 'coa/getcustomer', JSON.stringify(Datarequest), 'json', getPartiesHandler);

    }
    else if (response.model.results[0].Vendors.length > 0) {
        console.log(response.model.results[0].Vendors);
        var Datarequest = {};
        Datarequest.companyid = parseInt(CompanyId);
        Datarequest.sortBy = "";
        Datarequest.startwith = 0;
        Datarequest.numberOfRecords = 0;
        Datarequest.vendor = {};
        var Vendor = {};
        Vendor.code = "";
        Vendor.id = 0;
        Datarequest.vendor = Vendor;
        $('#txtvendor').autocomplete({

            source: function (request, response) {
                var Datarequest = {};
                Datarequest.companyid = parseInt(CompanyId);
                Datarequest.sortBy = "";
                Datarequest.startwith = 0;
                Datarequest.numberOfRecords = 0;
                Datarequest.vendor = {};
                var Vendor = {};
                Vendor.code = "";
                Vendor.id = 0;
                Datarequest.vendor = Vendor;
                var autocompleteUrl = url + 'getvendor';
                $.ajax({
                    url: autocompleteUrl,
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(Datarequest),
                    success: function (json) {
                        // call autocomplete callback method with results 

                        if (json.length == 0) {

                        }
                        response($.map(json.model.results, function (data, id) {
                            return {
                                label: data.VendorDescription,
                                value: data.VendorDescription,
                                value: data.VendorDescription,
                                Id: data.Id,
                                Code: data.Code
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
                $('#txtvendor').val(ui.item.label);
                $('#hfVendorId').val(ui.item.Id);
                $('#hfCustomerCode').val(ui.item.Code);
                return false;
            }
        });
        //Common.Ajax('POST', url + 'coa/getvendor', JSON.stringify(Datarequest), 'json', getPartiesHandler);
    }
}
function GetVoucherNo() {
    var VoucherTypeId = $('#ddlVoucherType').val();
    var date = $('#VoucherDate').val();
    var splitDate = date.split("-");
    var year = splitDate[0];
    var Request = {};
    Request.companyid = parseInt(CompanyId);
    Request.vouchertypeid = parseInt(VoucherTypeId);
    Request.year = year;
    Common.Ajax('POST', url + 'getVoucherNo', JSON.stringify(Request), 'json', getVoucherNoHandler);
}
function getVoucherNoHandler(response) {
    //if (response.isSuccess == true) {
    //    $('#txtVoucherNo').val(response.voucherNo);
    //}
    if (response.isSuccess == true) {
        $('#txtVoucherNo').val(response.voucherNo);
    }
    else {
        $('#txtVoucherNo').val('');
        $('#VoucherDate').focus();
        CommonFunction.MsgAlert(response.errors);

    }
}
function BindVoucherType() {
    Common.Ajax('GET', url + 'vouchertype?companyid=' + parseInt(CompanyId), '', 'json', getVoucherTypeHandler);
}
function getVoucherTypeHandler(response) {

    if (response.isSuccess == true) {
        var row = '';
        $('#ddlVoucherType').html('');
        row += '<option value=0>--Select--</option>';
        response.model.results.forEach(function (item) {

            row += '<option value=' + item.Id + '>' + item.Name + '</option>';
        });
        $('#ddlVoucherType').html(row);
    }
    else {
        CommonFunction.MsgAlert(response.errors[0]);
    }
}
