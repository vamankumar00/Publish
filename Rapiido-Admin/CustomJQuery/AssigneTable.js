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

    GetAssignTableList();
    GetWaiterList();
    
    $('#bttnAddAssignTable').click(function () {
        Clear();
        GetTableList();
        $('#addTableAssigneWaiterpopup').modal('show');
    });

    $('body').on("click", "#tblWaiterList .EditWaiter", function () {
        var row = $(this).closest("tr");
        var Id = row.find(".Id").html();
        var request = new Object();

        request.DefaultClientId = DefaultClientId;
        request.PurchaseID = Id;
    });

    $('#btnSaveAssignTable').click(function () {
        var Count = 0;
        var request = {};
        request.DefaultClientId = DefaultClientId;
        request.assigns = new Array();
        $('#tblTablesList input[type="checkbox"]:checked').each(function () {

            var row = $(this).closest("tr");
            var Id = row.find(".Id").html();
            
            var AssigneRequest = {};
            AssigneRequest.WaiterId = $('#ddlWaiter').val();
            AssigneRequest.TableId = Id;
            request.assigns.push(AssigneRequest)
            Count++;

        });
        if ($('#ddlWaiter').val() == "0") {
            CommonFunction.MsgAlertN("Waiter Required", "Error");
            $('#ddlWaiter').focus();
        }
        else if (Count < 1) {
            CommonFunction.MsgAlertN("Kindly Select Atleast One Table", "Error");
        }

        else {
            if ($('#hfAssignedId').val() == "") {
                console.log(JSON.stringify(request));
                Common.Ajax('POST', url + 'AssigendTableToWaiter', JSON.stringify(request), 'json',AssigendTableToWaiterHandler);
            }
            else {

            }

        }

    });
    $('#chkAllTable').click(function () {
        var isChecked = $(this).prop("checked");
        $('#tblTablesList TBODY tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
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
function AssigendTableToWaiterHandler(response) {
    console.log(response);
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        Clear();
        GetAssignTableList();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}
function GetAssignTableList() {
    var Request = new Object();

    Request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetAssignedTables', JSON.stringify(Request), 'json', GeAssignTableListHandler);
}
function GeAssignTableListHandler_(response) {
    $('#tblAssignTableList > tbody').html('');
    var row = ''
    $.each(response.Data, function (i, item) {
        row += '<tr class="EditVendor">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=WaiterId>' + item.WaiterId + '</td>' +
            '<td hidden="hidden" class=TableId>' + item.TableId + '</td>' +
            '<td class=WaiterName>' + item.WaiterName + '</td>' +
            '<td class=TableNo>' + item.TableNo + '</td>' +
            '<td class="text-right"><button class="btn btn-primary EditWaiter"><i class="fa fa-edit"></i></td>' +
            '</tr>';


    });
    $('#tblAssignTableList > tbody').prepend(row);
}
function GeAssignTableListHandler(response) {
    debugger
    console.log(response);
    var row = '';
    $("#tblAssignTableList tbody").empty();
    response.Data.forEach(function (item) {
     
        row += '<tr><td><img alt="" style="cursor: pointer" src="/Assets/Images/plus.png" /><div id="dvpurchases" style="display: none">';
        var html = '<table class="table table-sm" id="tblInvoiceListDetail"><thead><tr><th>Tables</th></tr></thead>';
        $.each(item.AssignTables, function (key, items) {

            html += '<tr>' +
                '<td class=TableNo>' + items.TableNo + '</td>' +
              
                '</tr>'
        });
       
        row += html + '</table></div></td>';
        row += '<td hidden="hidden" class=WaiterId>' + item.WaiterId + '</td>' +
            '<td class=WaiterName>' + item.WaiterName + '</td>' +

            '<td><a class="btn btn-warning btn-sm EditAssignedTable" href="javascript:;"><i class="fa fa-edit"></i></a></td>' +
            '</tr>';
    });
    $("#tblAssignTableList tbody").append(row);
}
function GetWaiterList() {
    var Request = new Object();

    Request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetWaiters', JSON.stringify(Request), 'json', GetWaiterListHandler);
}
function GetWaiterListHandler(response) {
    $('#ddlWaiter').html('');
    var row = ''
    row += '<option value=0>--Select--</option>';
    $.each(response.Data, function (i, item) {

        row += '<option value=' + item.Id + '>' + item.WaiterName + '</option>';
    });
    $('#ddlWaiter').prepend(row);
    $("#ddlWaiter").select2({
        dropdownParent: $("#addTableAssigneWaiterpopup")
    });
};
function GetTableList() {
    var Request = new Object();

    Request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetUnAssignedTable', JSON.stringify(Request), 'json', BindTablesHandler);
}
function BindTablesHandler(response) {
    var html = '';
    $('#tblTablesList > tbody').html('');
    $.each(response, function (i, item) {

        html += '<tr class="EditVendor">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td><input class="chkDetail" type="checkbox" /></td>' +
            '<td class=TableNo>' + item.TableNo + '</td>' +
            '</tr>';

    });
    $('#tblTablesList > tbody').html(html);
    $('#tblTablesList tr:has(td)').find('input[type="checkbox"]').click(function () {
        var isChecked = $(this).prop("checked");
        var isHeaderChecked = $("#chkAllTable").prop("checked");
        if (isChecked == false && isHeaderChecked)
            $("#chkAllTable").prop('checked', isChecked);
        else {
            $('#tblTablesList tr:has(td)').find('input[type="checkbox"]').each(function () {
                if ($(this).prop("checked") == false) {
                    isChecked = false;

                }


            });

            $("#chkAllTable").prop('checked', isChecked);
        }
    });
}
function Clear() {
    $('#hfAssignedId').val('');
    $('#ddlWaiter').val(0).trigger('change');
    $('#addTableAssigneWaiterpopup').modal('hide');
};