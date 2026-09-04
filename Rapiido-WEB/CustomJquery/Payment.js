$(document).ready(function () {
    var url;

    $.ajax({
        url: '../data.txt',
        async: false,
        cache: false,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    PopulateAirlines(); // This will override the default list with your new one

    // Hide the loader when the AJAX request completes
    $(document).ajaxStop(function () {
        $('#loader').hide();
    });

    var CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
    //Common.Ajax('POST', url + 'GetAllTables', CientId, 'json', BindTablesPaymentHandler);
    Common.Ajax('POST', url + 'GetAllBanks', CientId, 'json', BindBanksHandler);

    //$("#ddlBank_Card").select2();
    //$("#ddlBank_Card_AB").select2();
    $("#Add_BankCards").on('click', function () {
        $('#loader').show();
        $('#AddCardsModal').modal('show');
        $('#AddCardsModal input').val('');
        $('#ddlBank_Card_AB').prop('disabled', false);
        $('#ddlBank_Card_AB').val('');
        $('#ddlBank_Card_AB').val(null).trigger('change');
        $('#ddlCardType_AB').prop('disabled', false);
        $('#ddlCardType_AB').val('');
        $('#ddlCardType_AB').val(null).trigger('change');
        $('#ddlCardProduct_AB').val('');
        $('#ddlCardProduct_AB').val(null).trigger('change');
        Common.Ajax('POST', url + 'GetAllBanks', CientId, 'json', BindBanksABHandler);

    });

    $('#Bin_No').on('input', function () {
        var value = $(this).val().replace(/[^0-9]/g, '');

        // For Dragon Pass Bin No 8 digits 
        if ($("#ddlBank_Card").val() == "15") {
            if (value.length > 8) {
                value = value.slice(0, 8);
            }

            var formattedValue = '';

            if (value.length > 4) {
                formattedValue = value.slice(0, 4) + '-' + value.slice(4);
            } else {
                formattedValue = value;
            }

            $(this).val(formattedValue);
        }
        else {
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            var formattedValue = '';

            if (value.length > 6) {
                formattedValue = value.slice(0, 6) + '-' + value.slice(6);
            } else {
                formattedValue = value;
            }

            $(this).val(formattedValue);
        }
    });

    $('#Bin_No_AB').on('input', function () {
        var value = $(this).val().replace(/[^0-9]/g, '');

        // For Dragon Pass Bin No 8 digits 
        if ($("#ddlBank_Card_AB").val() == "15") {
            if (value.length > 8) {
                value = value.slice(0, 8);
            }

            var formattedValue = '';

            if (value.length > 4) {
                formattedValue = value.slice(0, 4) + '-' + value.slice(4);
            } else {
                formattedValue = value;
            }

            $(this).val(formattedValue);
        }
        else {
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            var formattedValue = '';

            if (value.length > 6) {
                formattedValue = value.slice(0, 6) + '-' + value.slice(6);
            } else {
                formattedValue = value;
            }

            $(this).val(formattedValue);
        }

    });

    $("#Bin_No").on("blur", function () {

        //Jubilee Bank
        if ($('#ddlBank_Card').val() == 6) {
            $("#hfmaxmeals").val(2);
            $('#ddlCardType').prop('disabled', false);
        }
        //Dragon Pass
        else if ($('#ddlBank_Card').val() == 15) {
            $("#hfmaxmeals").val(14);
        }
        //Priority Pass
        else if ($('#ddlBank_Card').val() == 16) {
            $("#hfmaxmeals").val(8);
        }
        else {
            $("#hfmaxmeals").val(1);
            var request = {};
            request.BinNo = $('#Bin_No').val().slice(0, 6);
            request.DefaultClientId = DefaultClientId;
            request.BankId = $('#ddlBank_Card').val();
            request.CardType = $('#ddlCardType').val();
            request.CardProduct = $('#ddlCardProduct').val();
            Common.Ajax('POST', url + 'GetBankBinInfo', JSON.stringify(request), 'json', GetBankBinInfoHandler);
        }

    });

    $("#Bin_No_AB").on("blur", function () {

        //Jubilee Bank
        if ($('#ddlBank_Card_AB').val() == 6) {
            $("#hfmeals").val(2);
            $('#ddlCardType_AB').prop('disabled', false);
        }
        //Dragon Pass
        else if ($('#ddlBank_Card_AB').val() == 15) {
            $("#hfmeals").val(14);
        }
        //Priority Pass
        else if ($('#ddlBank_Card_AB').val() == 16) {
            $("#hfmeals").val(8);
        }
        else {
            $("#hfmeals").val(0);
            var request = {};
            request.BinNo = $('#Bin_No_AB').val().slice(0, 6);
            request.DefaultClientId = DefaultClientId;
            request.BankId = $('#ddlBank_Card_AB').val();
            request.CardType = $('#ddlCardType_AB').val();
            request.CardProduct = $('#ddlCardProduct_AB').val();
            Common.Ajax('POST', url + 'GetBankBinInfo', JSON.stringify(request), 'json', GetBankBinInfoABHandler);
        }

    });

    $('#ddlMeals').on("blur", function () {
        var numMeals = parseInt($('#ddlMeals').val());

        var total = getTotalFromTfoot_P();
        var maxmeals = parseInt($("#hfmaxmeals").val()) + total;

        //Unlimited Meals for EFU Pass
        if (numMeals > maxmeals && $("#ddlPaymentType").val() == "CARD" && $('#ddlBank_Card').val() != 17) {
            CommonFunction.MsgAlertN('Number of Meals can not be greater than ' + maxmeals, 'Error');
            $('#ddlMeals').css('border-color', 'red');
            $('#ddlMeals').focus();
            $('#Submit_CustomerInfo').prop("disabled", true);
            return false;
        }
        else {
            $("#Submit_CustomerInfo").removeAttr("disabled", true);
        }
        var existingCustomers = $('#customerFields .customer-group').length;

        if (numMeals < existingCustomers) {
            $('#customerFields .customer-group:gt(' + (numMeals - 1) + ')').remove();
        }

        for (var i = existingCustomers; i < numMeals; i++) {
            var customerGroup = $('<div class="customer-group">');

            customerGroup.append('<div class="col-md-6"><div class="form-group"><label for="customerName' + i + '">Passenger Name:</label><input type="text" class="form-control" id="customerName' + i + '" name="customerName' + i + '" required></div></div>');
            //customerGroup.append('<input type="text" class="form-control" required id="customerName' + i + '" name="customerName' + i + '"></div></div>');
            customerGroup.append('<div class="col-md-6"><div class="form-group"><label for="customerContact' + i + '">Contact:</label><input type="text" class="form-control" maxlength="11" id="customerContact' + i + '" name="customerContact' + i + '"></div></div>');
            //customerGroup.append('<input type="text" class="form-control" required id="customerContact' + i + '" name="customerContact' + i + '"></div></div>');
            $('#customerFields').append(customerGroup);
        }
    });

    var ajaxRequestPending = false;
    $("#ddlTables").on("mousedown", function () {

        if (!ajaxRequestPending) {
            ajaxRequestPending = true;

            $('#ddlTables').html("<option value=''>Loading...</option>");
            Common.Ajax('POST', url + 'GetAllTables_SM', CientId, 'json', BindTablesPaymentHandler);
            ajaxRequestPending = false;

        }

    });

    $("#ddlWaiter").on("mousedown", function () {

        if (!ajaxRequestPending) {
            ajaxRequestPending = true;

            $('#ddlWaiter').html("<option value=''>Loading...</option>");
            Common.Ajax('POST', url + 'GetWaitersOnline', CientId, 'json', BindWaitersHandler);
            ajaxRequestPending = false;

        }

    });

    $("#ddlMeals").on("change", function () {
        if ($("#ddlMeals").val() == 2) {
            $("#Second_Customer_Name").removeAttr("disabled", true);
            $("#Second_ContactNo").removeAttr("disabled", true);
        }
        else {
            $("#Second_Customer_Name").prop("disabled", true);
            $("#Second_Customer_Name").val("");
            $("#Second_ContactNo").attr("disabled", true);
            $("#Second_ContactNo").val("");
        }
    });

    $("#ddlPaymentType").on("change", function () {
        if ($("#ddlPaymentType").val() == "CARD") {
            $("#ddlBank_Card").removeAttr("disabled", true);
            $("#Bin_No").removeAttr("readonly", true);
            $(".dvBin").css("display", 'block');
            $(".dvPOS").css("display", 'none');
            $("#ddlPaymentBy").val("");
            $(".dvPaymentBy").css("display", 'none');
            //$("#POS_No").removeAttr("required", true);
            $("#ddlAirline").val("");
            $(".dvAirline").css("display", 'none');

        }
        else {
            if ($("#ddlPaymentType").val() == "WALKIN") {
                $(".dvAirline").css("display", 'none');

                $(".dvPaymentBy").css("display", 'block');
                $(".dvBin").css("display", 'none');
            }
            else {
                $(".dvPaymentBy").css("display", 'none');
                $(".dvAirline").css("display", 'block');
                $("#ddlPaymentBy").val("");
                $(".dvBin").css("display", 'none');

            }

            $("#ddlBank_Card").prop("disabled", true);
            $("#ddlBank_Card").val("");
            $('#ddlCardType').val("");
            $('#ddlCardProduct').val("");
            $("#Bin_No").prop("readonly", true);
            $("#Bin_No").val("");
            //$('#ddlMeals').val(1);
            $("#ddlMeals").removeAttr("readonly", true);
            $(".dvPOS").css("display", 'none');

        }
    });

    $("#ddlPaymentBy").on("change", function () {

        if ($("#ddlPaymentBy").val() == "CASH") {
            $(".dvPOS").css("display", 'none');
            $('#ReceiptNo').val('');
            //$("#ReceiptNo").removeAttr("required", true);

        }
        else {
            $(".dvPOS").css("display", 'block');
            $("#ReceiptNo").prop("required", true);

        }

    });

    $("#ddlBank_Card").on("change", function () {

        $('#Bin_No').val('');
        var request = {};

        request.BankId = $('#ddlBank_Card').val();
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetBankCardType', JSON.stringify(request), 'json', BindCardTypeHandler);

    });

    $("#ddlBank_Card_AB").on("change", function () {

        $('#Bin_No_AB').val('');
        var request = {};

        request.BankId = $('#ddlBank_Card_AB').val();
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetBankCardType', JSON.stringify(request), 'json', BindCardTypeABHandler);

    });

    $("#ddlCardType").on("change", function () {

        var request = {};

        request.BankId = $('#ddlBank_Card').val();
        request.CardType = $('#ddlCardType').val();
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetBankCardProduct', JSON.stringify(request), 'json', BindCardProductHandler);

    });

    $("#ddlCardType_AB").on("change", function () {

        var request = {};

        request.BankId = $('#ddlBank_Card_AB').val();
        request.CardType = $('#ddlCardType_AB').val();
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetBankCardProduct', JSON.stringify(request), 'json', BindCardProductABHandler);

    });

    $("#Children").on("blur", function () {
        //var meals = parseInt($("#ddlMeals").val(), 10) || 0;
        //var addmeals = parseInt($("#Children").val(), 10) || 0;

        //$("#ddlMeals").val(meals + addmeals);

    });

    $('#Submit_CustomerInfo').click(function () {

        var customers = new Array();
        var numMeals = parseInt($('#ddlMeals').val());
        var seats = $('#ddlTables').find(':selected').data('seats');
        var binNo = $('#Bin_No').val();
        var regExPass = /^\d{6}-\d{4}$/;

        for (var i = 0; i < numMeals; i++) {
            var customer = {
                Fname: $('#customerName' + i).val(),
                TelephoneNo: $('#customerContact' + i).val()
            };
            customers.push(customer);
        }

        var hasNonEmptyFname = false;

        for (var i = 0; i < customers.length; i++) {
            if (customers[i].Fname.trim() == "") {
                hasNonEmptyFname = true;
                break;
            }
        }


        // For Dragon Pass
        if ($("#ddlBank_Card").val() == "15") {
            regExPass = /^\d{4}-\d{4}$/;
        }
        else {
            regExPass = /^\d{6}-\d{4}$/;
        }


        if ($('#ddlPaymentType').val() == "0" || $('#ddlPaymentType').val() == "") {
            CommonFunction.MsgAlertN('Payment Type Required', 'Error');
            $('#ddlPaymentType').css('border-color', 'red');
            $('#ddlPaymentType').focus();
            return false;
        }
        else if ($('#ddlPaymentType').val() == "CARD" && $('#Bin_No').val() == "") {
            CommonFunction.MsgAlertN('Bin Number is Required', 'Error');
            $('#Bin_No').css('border-color', 'red');
            $('#Bin_No').focus();
            return false;
        }

        else if ($('#ddlMeals').val() == "") {
            CommonFunction.MsgAlertN('Number of Meals is Required', 'Error');
            $('#ddlMeals').css('border-color', 'red');
            $('#ddlMeals').focus();
            return false;
        }

        //else if ($('#ddlTables').val() == "0" || $('#ddlTables').val() == "") {
        //    CommonFunction.MsgAlertN('Table is Required', 'Error');
        //    $('#ddlTables').css('border-color', 'red');
        //    $('#ddlTables').focus();
        //    return false;
        //}

        //else if ($('#ddlWaiter').val() == "0" || $('#ddlWaiter').val() == "") {
        //    CommonFunction.MsgAlertN('Waiter is Required', 'Error');
        //    $('#ddlWaiter').css('border-color', 'red');
        //    $('#ddlWaiter').focus();
        //    return false;
        //}

        else if (numMeals > seats) {
            CommonFunction.MsgAlertN('Seats not available in selected Table', 'Error');
            $('#ddlTables').css('border-color', 'red');
            $('#ddlTables').focus();
            return false;
        }

        else if (hasNonEmptyFname) {
            CommonFunction.MsgAlertN('Passenger Name is Required', 'Error');
            return false;
        }
        else if (!regExPass.test(binNo) && $('#ddlPaymentType').val() == "CARD") {
            CommonFunction.MsgAlertN('Invalid Bin No format.', 'Error');
            $('#Bin_No').css('border-color', 'red');
            $('#Bin_No').focus();
            return false;
        }

        else {
            $("#Submit_CustomerInfo").prop("disabled", true);
            $('#loader').show();

            var request = {};

            request.PaymentType = $('#ddlPaymentType').val();
            request.BankId = $('#ddlBank_Card').val();

            // For Dragon Pass
            if ($("#ddlBank_Card").val() == "15") {
                request.BinNo = $('#Bin_No').val().slice(0, 4);
            }
            else {
                request.BinNo = $('#Bin_No').val().slice(0, 6);
            }

            request.PaymentBy = $('#ddlPaymentBy').val();
            request.ReceiptNo = $('#ReceiptNo').val();
            request.FlightNo = $('#Flight_No').val();

            if ($("#Children").val() != '' && $("#Children").val() != '0') {
                var meals = parseInt($("#ddlMeals").val(), 10) || 0;
                var addmeals = parseInt($("#Children").val(), 10) || 0;

                request.NoofMeals = meals + addmeals;
            }
            else {
                request.NoofMeals = $('#ddlMeals').val();
            }

            request.TableNo = $('#ddlTables').find(':selected').data('tableno');
            request.TableId = $('#ddlTables').val();
            request.WaiterId = $('#ddlWaiter').val();
            request.Customers = customers;
            request.CreatedBy = $('#SessionUserId').val();
            request.DefaultClientId = DefaultClientId;
            request.FCMToken = $('#ddlWaiter').find(':selected').data('token');
            request.FTPayment = $('#ddlFTPayment').val();
            request.Airline = $('#ddlAirline').val();
            request.CardProduct = $('#ddlCardProduct').val();
            request.PIN = $('#Bin_No').val().slice(-4);
            request.Children = $("#Children").val();

            // Extracting data from the table and adding to request.Banks
            var banks = [];
            $('#tbl_BankCards tbody tr').each(function () {
                var bankData = {
                    PassengerName: $(this).find('td').eq(0).text().trim(),  // Customer name
                    BankId: $(this).find('td').eq(1).text().trim(),  // Bank Id
                    BankName: $(this).find('td').eq(2).text().trim(),  // Bank Name
                    CardProduct: $(this).find('td').eq(4).text().trim(),  // Bank Name
                    BinNo: $(this).find('td').eq(5).text().trim(),  // Bin number or relevant data
                    Meals: $(this).find('td').eq(6).text().trim()  // Max meals or relevant data
                };

                // Split the BinNo and PIN from the table's data
                var binAndPin = bankData.BinNo.split('-');
                if (binAndPin.length > 1) {
                    bankData.BinNo = binAndPin[0];  // First part as Bin
                    bankData.PIN = binAndPin[1];  // Second part as PIN
                } else {
                    bankData.BinNo = binAndPin[0];  // If there's no '-', we just take the entire value as Bin
                    bankData.PIN = '';  // No PIN in case there's no '-'
                }

                banks.push(bankData);
            });

            // Add the banks data to the request
            request.Banks = banks;

            $('.FlightNo').text("Flight No: " + request.FlightNo);
            $('.CustomerName').text("Customer Name: " + customers[0].Fname.trim());
            $('.Meals').text("Meal Count: " + request.NoofMeals);

            console.log(JSON.stringify(request));
            Common.Ajax('POST', url + 'InsertFlightInfo', JSON.stringify(request), 'json', InsertFlightHandler);
        }

    });

    $('#SubmitCards').click(function () {

        if ($('#ddlBank_Card_AB').val() == "0" || $('#ddlBank_Card_AB').val() == "") {
            CommonFunction.MsgAlert('Card Required');
            $('#ddlBank_Card_AB').css('border-color', 'red');
            $('#ddlBank_Card_AB').focus();
            return false;
        }

        else if ($('#Bin_No_AB').val() == "0" || $('#Bin_No_AB').val() == "") {
            CommonFunction.MsgAlert('Bin Number Required');
            $('#Bin_No_AB').css('border-color', 'red');
            $('#Bin_No_AB').focus();
            return false;
        }

        //Unlimited Meals for EFU Pass
        else if ($("#hfmeals").val() == "0" && $('#ddlBank_Card_AB').val() != 17) {
            CommonFunction.MsgAlert('Bin Number Required');
            $('#Bin_No_AB').css('border-color', 'red');
            $('#Bin_No_AB').focus();
            return false;
        }

        else {
            var input1 = $('#ddlBank_Card_AB').val();
            var input2 = $('#ddlCardType_AB').val();
            var input3 = $('#ddlCardProduct_AB').val();
            var input4 = $('#Bin_No_AB').val();
            var input5 = $('#txtPassengerName').val();
            var input6 = $('#ddlBank_Card_AB :selected').text();
            var input7 = $("#hfmeals").val();

            // Create a new row in the table
            var newRow = `
              <tr>
                <td>${input5 ?? ''}</td>
                <td style="display:none">${input1 ?? ''}</td>
                <td>${input6 ?? ''}</td>
                <td>${input2 ?? ''}</td>
                <td>${input3 ?? ''}</td>
                <td>${input4 ?? ''}</td>
                <td>${input7 ?? ''}</td>
                <td><button class="btn-danger deleteBtn">Delete</button></td>
              </tr>
            `;

            $("#tbl_BankCards").css("display", '');

            // Add the row to the table
            $('#tableBody').append(newRow);

            // Clear input fields
            $('#AddCardsModal input').val('');

            // Hide the modal
            $('#AddCardsModal').modal('hide');

            // Calculate and update the total row in the tfoot
            updateTotal_P();
        }

    });

    // Delete a row when the delete button is clicked
    $('#tableBody').on('click', '.deleteBtn', function () {
        $(this).closest('tr').remove();

        // Calculate and update the total row in the tfoot
        updateTotal_P();

        var total = getTotalFromTfoot_P();
        var meals = parseInt($("#hfmaxmeals").val()) + total;
        $('#ddlMeals').val(meals);
    });


});

//airline
function PopulateAirlines() {
    var airlineDropdown = $('#ddlAirline');
    airlineDropdown.empty(); // Clear all existing options

    // Add a default "Select" option
    airlineDropdown.append('<option value="">Select</option>');

    // Define your custom list of airlines (override here)
    var airlines = [
        { name: "THAI AIRLINE", value: "THAI AIRLINE" },
        { name: "OMAN AIRLINE", value: "OMAN AIRLINE" },
        { name: "SAUDI AIRLINE", value: "SAUDI AIRLINE" },
        { name: "QATAR AIRLINE", value: "QATAR AIRLINE" },
        { name: "BATIK AIRLINEI", value: "BATIK AIRLINE" }
    ];

    // Append each airline
    $.each(airlines, function (index, airline) {
        airlineDropdown.append(`<option value="${airline.value}">${airline.name}</option>`);
    });
}

function InsertFlightHandler(response) {

    $("#Submit_CustomerInfo").prop("disabled", false);
    if (response.HasError == true) {
        alert(response.Message);
        CommonFunction.MsgAlertN(response.Message, 'Error');
    }
    else {
        // Check if the response contains a QRCodeBase64 string
        if (response.Message) {

        }

        ClearAll();
        $('#Alert').show();
    }

}

function ClearAll() {
    $('#ddlBank_Card').val('');
    $('#ddlBank_Card').val(null).trigger('change');
    $('#Bin_No').val('');
    $('#Flight_No').val('');
    $('#ddlMeals').val('');
    $('#ddlTables').val('');
    $('#ddlTables').val(null).trigger('change');
    $('#ddlWaiter').val('');
    $('#ddlWaiter').val(null).trigger('change');
    $('#ddlPaymentBy').val('');
    $('#ddlPaymentBy').val(null).trigger('change');
    $('#ddlPaymentType').val('');
    $('#ddlPaymentType').val(null).trigger('change');
    $('#ReceiptNo').val('');
    $('#customerFields').html('');
    $('#Alert').hide();
    $('#ddlAirline').val('');
    $('#ddlAirline').val(null).trigger('change');
    $('#ddlCardType').val('');
    $('#ddlCardType').val(null).trigger('change');
    $('#ddlCardProduct').val('');
    $('#ddlCardProduct').val(null).trigger('change');
    $('#tbl_BankCards tbody').empty();
    $('#tbl_BankCards tfoot').empty();
}

function BindTablesPaymentHandler(response) {
    var html = '';
    $('#ddlTables').html('');
    ajaxRequestPending = false;
    var rem = "";

    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        if (item.SeatsRemaining > 0) {
            rem = item.SeatsRemaining;
        }
        else {
            rem = item.Persons;
        }
        html += '<option value=' + item.Id + ' data-tableno = "' + item.TableNo + '" data-persons="' + item.Persons + '" data-seats="' + rem + '" > ' + item.TableNo + '(' + item.Persons + ' Persons) ' + rem + ' Rem</option > ';

    });
    $('#ddlTables').html(html);
}

function BindBanksHandler(response) {
    var html = '';
    $('#ddlBank_Card').html('');
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {

        html += "<option value=" + item.Id + " data-meals= '" + item.PersonCount + "' >" + item.BankName + "</option>";

    });
    $('#ddlBank_Card').html(html);
}

function BindBanksABHandler(response) {
    var html = '';
    $('#ddlBank_Card_AB').html('');
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {

        html += "<option value=" + item.Id + " data-meals= '" + item.PersonCount + "' >" + item.BankName + "</option>";

    });
    $('#ddlBank_Card_AB').html(html);
}

function BindWaitersHandler(response) {

    var waiter = '';
    $('#ddlWaiter').html(waiter);
    waiter += "<option value =''>Select</option>";
    $.each(response.Data, function (i, item) {
        waiter += '<option data-WaiterId=' + item.Id + ' data-WaiterName="' + item.WaiterName + '" data-token="' + item.FCMToken + '" data-tableno="' + item.HomeAddress + '" value=' + item.Id + '>' + item.WaiterName + '(' + item.HomeAddress + ')' + ' </option>';
    });
    $('#ddlWaiter').html(waiter);

}

function GetBankBinInfoHandler(response) {
    if (response) {
        var cardtype = '';
        var cardproduct = '';

        if (response.length > 1) {
            cardtype = '<option value="">Select Card Type</option>';
            cardproduct = '<option value="">Select Card Product</option>';

            $('#ddlBank_Card').prop('disabled', false);
            $('#ddlCardType').prop('disabled', false);

            $.each(response, function (i, item) {
                if (cardtype.indexOf('value="' + item.CardType + '"') === -1) {
                    cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
                }
                if (cardproduct.indexOf('value="' + item.CardProduct + '"') === -1) {
                    cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
                }
            });

            $('#ddlBank_Card').val('');
            $('#ddlCardType').html(cardtype);
            $('#ddlCardProduct').html(cardproduct);

            $('#Bin_No').data('bin-options', response);
            $('#ddlBank_Card').off('change.bin').on('change.bin', function () {
                var opts = $('#Bin_No').data('bin-options');
                if (!opts) return;
                var bankId = $(this).val();
                var match = null;
                for (var k = 0; k < opts.length; k++) {
                    if (opts[k].BankId == bankId) { match = opts[k]; break; }
                }
                if (match) {
                    $('#Bin_No').attr('data-meals', match.PersonCount);
                    $("#hfmaxmeals").val(match.PersonCount);
                    var total = getTotalFromTfoot_P();
                    var meals = parseInt($("#hfmaxmeals").val()) + total;
                    if (meals > 0) {
                        $('#ddlMeals').val(meals);
                        $("#ddlMeals").blur();
                    } else {
                        $("#ddlMeals").removeAttr("readonly", true);
                    }
                }
            });
        } else {
            $('#ddlBank_Card').off('change.bin');
            $.each(response, function (i, item) {
                $('#Bin_No').attr('data-meals', item.PersonCount);

                $("#hfmaxmeals").val(item.PersonCount);
                var total = getTotalFromTfoot_P();
                var meals = parseInt($("#hfmaxmeals").val()) + total;

                $('#ddlBank_Card').val(item.BankId);
                $('#ddlBank_Card').prop('disabled', true);

                if (meals > 0) {
                    $('#ddlMeals').val(meals);
                    $("#ddlMeals").blur();
                } else {
                    $("#ddlMeals").removeAttr("readonly", true);
                }

                cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
                cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
            });

            $('#ddlCardType').html(cardtype);
            $('#ddlCardType').prop('disabled', true);
            $('#ddlCardProduct').html(cardproduct);
        }
    }
}


function GetBankBinInfoABHandler(response) {
    if (response) {
        var cardtype = '';
        var cardproduct = '';

        if (response.length > 1) {
            cardtype = '<option value="">Select Card Type</option>';
            cardproduct = '<option value="">Select Card Product</option>';

            $('#ddlBank_Card_AB').prop('disabled', false);
            $('#ddlCardType_AB').prop('disabled', false);

            $.each(response, function (i, item) {
                if (cardtype.indexOf('value="' + item.CardType + '"') === -1) {
                    cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
                }
                if (cardproduct.indexOf('value="' + item.CardProduct + '"') === -1) {
                    cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
                }
            });

            $('#ddlBank_Card_AB').val('');
            $('#ddlCardType_AB').html(cardtype);
            $('#ddlCardProduct_AB').html(cardproduct);

            $('#Bin_No_AB').data('bin-options', response);
            $('#ddlBank_Card_AB').off('change.bin').on('change.bin', function () {
                var opts = $('#Bin_No_AB').data('bin-options');
                if (!opts) return;
                var bankId = $(this).val();
                var match = null;
                for (var k = 0; k < opts.length; k++) {
                    if (opts[k].BankId == bankId) { match = opts[k]; break; }
                }
                if (match) {
                    $('#Bin_No_AB').attr('data-meals', match.PersonCount);
                    $("#hfmeals").val(match.PersonCount);
                }
            });
        } else {
            $('#ddlBank_Card_AB').off('change.bin');
            $.each(response, function (i, item) {
                $('#Bin_No_AB').attr('data-meals', item.PersonCount);

                var meals = item.PersonCount;
                $("#hfmeals").val(item.PersonCount);

                $('#ddlBank_Card_AB').val(item.BankId);
                $('#ddlBank_Card_AB').prop('disabled', true);

                cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
                cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
            });

            $('#ddlCardType_AB').html(cardtype);
            $('#ddlCardType_AB').prop('disabled', true);
            $('#ddlCardProduct_AB').html(cardproduct);
        }
    }
}

function BindCardTypeHandler(response) {

    var cardtype = '';
    $('#ddlCardType').html(cardtype);
    cardtype += "<option value =''>Select</option>";
    $('#ddlCardProduct').html(cardtype);
    $.each(response, function (i, item) {
        cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
    });
    $('#ddlCardType').html(cardtype);

}

function BindCardTypeABHandler(response) {

    var cardtype = '';
    $('#ddlCardType_AB').html(cardtype);
    cardtype += "<option value =''>Select</option>";
    $('#ddlCardProduct_AB').html(cardtype);
    $.each(response, function (i, item) {
        cardtype += '<option value="' + item.CardType + '">' + item.CardType + ' </option>';
    });
    $('#ddlCardType_AB').html(cardtype);

}

function BindCardProductHandler(response) {

    var cardproduct = '';
    $('#ddlCardProduct').html(cardproduct);
    cardproduct += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
    });
    $('#ddlCardProduct').html(cardproduct);

}

function BindCardProductABHandler(response) {

    var cardproduct = '';
    $('#ddlCardProduct_AB').html(cardproduct);
    cardproduct += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        cardproduct += '<option value="' + item.CardProduct + '">' + item.CardProduct + ' </option>';
    });
    $('#ddlCardProduct_AB').html(cardproduct);

}

function updateTotal_P() {
    var total = 0;

    // Iterate through each row in the table body
    $('#tableBody tr').each(function () {
        // Assuming the value you want to total is in the 7th column (index 6)
        var value = $(this).find('td').eq(6).text(); // You can adjust this to target the appropriate column
        if ($.isNumeric(value)) {
            total += parseInt(value); // Add the value to the total
        }
    });

    // Update the total row in the tfoot
    var totalRow = `
      <tr>
        <td colspan="6" style="text-align: right;">Total:</td>
        <td>${total}</td>
        <td></td>
      </tr>
    `;

    // Add or update the total row in the tfoot
    if ($('#tbl_BankCards tfoot tr').length === 0) {
        $('#tbl_BankCards tfoot').append(totalRow);  // Add a new row if not present
    } else {
        $('#tbl_BankCards tfoot tr').replaceWith(totalRow);  // Replace the existing row
    }
}

// Function to get the total value from tfoot
function getTotalFromTfoot_P() {
    // Select the td that holds the total value from tfoot
    var total = $('#tbl_BankCards tfoot td').eq(1).text(); // Adjust the index if necessary

    // Convert the text to a number (remove any unwanted characters like "$", commas, etc.)
    total = parseInt(total.replace(/[^\d.-]/g, ''));

    if (isNaN(total)) {
        total = 0;
    }

    return total;
}