var url;
var EditCityId;
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
    Validation();
    GetSupplierInfo();
    GetCountries();
    $('#bttnAddVendor').click(function () {
        ClearAll();
        
        $('#addVendor_popup').modal('show');
    });
    $('#ddlcountry').change(function () {


        var CountryId = $('#ddlcountry').val();
        var request = new Object();
        request.CountryId = CountryId;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetAllCities', JSON.stringify(request), 'json', GetCitiesHandler);
    });
    $('body').on("click", "#tblVendor .VendorDelete", function () {

        var row = $(this).closest("tr");
        var Supplier = row.find(".FirstName").html()
        $('#hfVendorId').val(row.find(".Id").html());
        $('#Msg').html("Are You Sure You Want To Delete! " + Supplier);
        $('#ConfirmationPopup').modal('show');

    });
    $('#bttnYesConfirmation').click(function () {
        DeleteVendor();
    });
    $('body').on("click", "#tblVendor .VendorListEdit", function () {
       

        var row = $(this).closest("tr");
        var IsActive = row.find(".IsActive").html();
        if (IsActive == "true") {
            $('#ChkIsVendorActive').prop('checked', true);
        }
        else {
            $('#ChkIsVendorActive').prop('checked', false);
        }
        $('#hfVendorId').val(row.find(".Id").html());
        $('#ddlcountry').val(row.find(".CountryId").html()).trigger('change');
        $('#ddlcity').val(row.find(".CityId").html()).trigger('change');
        $('#txtName').val(row.find(".FirstName").html());
        $('#txtEmail').val(row.find(".Email_Address").html());

        $('#txtPhone1').val(row.find(".Phone1").html());
        $('#txtPhone2').val(row.find(".Phone2").html());
        $('#txtWebSite').val(row.find(".WebUrl").html());
        $('#txtAddress1').val(row.find(".Address1").html());
        $('#txtAddress2').val(row.find(".Address2").html());
        $('#txtContact1').val(row.find(".ContactPersonPhone1").html());
        $('#txtContact2').val(row.find(".ContactPersonPhone2").html());
        EditCityId = row.find(".CityId").html();
        $('#addVendor_popup').modal('show');
    });
    $('#btnSaveVendor').click(function () {

        if ($('#txtName').val() == "") {
            $('#txtName').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Name Required');
            $('#txtName').focus();

        }
        else if ($('#ddlcountry').val() == "0") {
            $('#txtPhone1').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Country Required');
            $('#ddlcountry').focus();

        }
        else if ($('#ddlcity').val() == null || $('#ddlcity').val() == "0") {
            $('#txtPhone1').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('City Required');
            $('#ddlcity').focus();

        }
        else if ($('#txtPhone1').val() == "") {
            $('#txtPhone1').removeClass("valid").addClass("invalid");
            CommonFunction.MsgAlert('Phone 1 Required');
            $('#txtPhone1').focus();

        }
      

        else {
            if ($('#hfVendorId').val() == "") {
                SubmitVendor();
            }
            else {
                UpdateVendor();
            }
        }

    });
});
function DeleteVendor() {
    var request = new Object();
    request.Id = $('#hfVendorId').val();
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'DeleteSupplierInfo', JSON.stringify(request), 'json', DeleteVendorHandler);
}
function DeleteVendorHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetSupplierInfo();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}
function SubmitVendor() {
    var Isactive = false;
    if ($("#ChkIsVendorActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.CountryId = $('#ddlcountry').val();
    request.CityId = $('#ddlcity').val();
    request.FirstName = $('#txtName').val();
    request.Email_Address = $('#txtEmail').val();
    request.Phone1 = $('#txtPhone1').val();
    request.Phone2 = $('#txtPhone2').val();
    request.WebUrl = $('#txtWebSite').val();
    request.ContactPersonPhone1 = $('#txtContact1').val();
    request.ContactPersonPhone2 = $('#txtContact2').val();
    request.Address1 = $('#txtAddress1').val();
    request.Address2 = $('#txtAddress2').val();
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
    request.IsActive = Isactive;
    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'InsertSupplierInfo', JSON.stringify(request), 'json', submitVendorHandler);
}
function submitVendorHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetSupplierInfo();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}

function UpdateVendor() {
    var Isactive = false;
    if ($("#ChkIsVendorActive").is(':checked'))
        Isactive = true;
    else {
        Isactive = false;
    }
    var request = new Object();
    request.Id = $('#hfVendorId').val();
    request.CountryId = $('#ddlcountry').val();
    request.CityId = $('#ddlcity').val();
    request.FirstName = $('#txtName').val();
    request.Email_Address = $('#txtEmail').val();
    request.Phone1 = $('#txtPhone1').val();
    request.Phone2 = $('#txtPhone2').val();
    request.WebUrl = $('#txtWebSite').val();
    request.ContactPersonPhone1 = $('#txtContact1').val();
    request.ContactPersonPhone2 = $('#txtContact2').val();
    request.Address1 = $('#txtAddress1').val();
    request.Address2 = $('#txtAddress2').val();
    request.CreatedBy = parseInt(UserId);
    request.DefaultClientId = DefaultClientId;
    request.IsActive = Isactive;
    console.log(JSON.stringify(request));
    Common.Ajax('POST', url + 'UpdateSupplierInfo', JSON.stringify(request), 'json', UpdateVendorHandler);

}
function UpdateVendorHandler(response) {
    if (response.HasError == false) {
        CommonFunction.MsgAlert(response.Message);
        ClearAll();
        GetSupplierInfo();
    }
    else {
        CommonFunction.MsgAlert(response.Message);
    }
}

function GetSupplierInfo() {
    var LoginRequest = new Object();

    LoginRequest.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetSupplierInfo', JSON.stringify(LoginRequest), 'json', GetVendosHandler);
}
function Validation() {

    $('#txtName').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#txtName').focus();

        }
    });
    $('#txtEmail').on('input', function () {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email = re.test(input.val());
        if (is_email) {
            input.removeClass("invalid").addClass("valid");
        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#txtEmail').focus();

        }
    });

    $('#txtPhone1').blur('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) {
            input.removeClass("invalid").addClass("valid");

        }
        else {
            input.removeClass("valid").addClass("invalid");
            $('#txtPhone1').focus();

        }
    });
}
function GetVendosHandler(response) {
    console.log(response);
    $('#tblVendor > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr class="EditVendor">' +
            '<td hidden="hidden" class=Id>' + item.Id + '</td>' +
            '<td hidden="hidden" class=CountryId>' + item.CountryId + '</td>' +
            '<td hidden="hidden" class=CityId>' + item.CityId + '</td>' +
            '<td hidden="hidden" class=IsActive>' + item.IsActive + '</td>' +
            '<td class=FirstName>' + item.FirstName + '</td>' +
            '<td class=Email_Address>' + item.Email_Address + '</td>' +
            '<td class=Phone1>' + item.Phone1 + '</td>' +
            '<td class=Phone2>' + item.Phone2 + '</td>' +
            '<td class=WebUrl>' + item.WebUrl + '</td>' +
            '<td class=Address1>' + item.Address1 + '</td>' +
            '<td class=Address2>' + item.Address2 + '</td>' +
            '<td class=ContactPersonPhone1>' + item.ContactPersonPhone1 + '</td>' +
            '<td class=ContactPersonPhone2>' + item.ContactPersonPhone2 + '</td>' +
            '<td class=SupplierStatus>' + item.SupplierStatus + '</td>' +
            '<td class=CreatedDate>' + item.CreatedDate + '</td>' +
            
            '<td class=CreatedBy>' + item.CreatedBy + '</td>' +
            '<td class="text-right"><button class="btn btn-primary VendorListEdit"><i class="fa fa-edit"></i></button><button class="btn btn-danger VendorDelete"><i class="fa fa-trash"></i></button></td>' +
            '</tr>';


    });
    $('#tblVendor > tbody').prepend(row);
}
function GetCountries() {
    CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
    Common.Ajax('POST', url + 'GetAllCountries', CientId, 'json', GetCountriesHandler);
}
function GetCountriesHandler(response) {
    var row = '';
    $('#ddlcountry').html('');
    row += '<option value=0>--Select--</option>';
    response.forEach(function (item) {

        row += '<option value=' + item.Id + ' data-value= "' + item.CountryCode + '">' + item.Country + '</option>';
    });
    $('#ddlcountry').html(row);
    $("#ddlcountry").select2({
        dropdownParent: $("#addVendor_popup")
    });
}
function GetCitiesHandler(response) {
    var row = '';
    $('#ddlcity').html('');
    row += '<option value=0>--Select--</option>';
    response.forEach(function (item) {

        row += '<option value=' + item.Id + ' data-value= "' + item.CityCode + '">' + item.City + '</option>';
    });
    $('#ddlcity').html(row);
    $('#ddlcity').val(EditCityId).trigger('change');
    $("#ddlcity").select2({
        dropdownParent: $("#addVendor_popup")
    });
}
function ClearAll() {
    $('#txtName').val('');
    $('#txtEmail').val('');
    $('#ddlcountry').val(0).trigger('change');
    $('#txtPhone1').val('');
    $('#txtPhone2').val('');
    $('#txtContact1').val('');
    $('#txtContact2').val('');
    $('#txtAddress1').val('');
    $('#txtAddress2').val('');
    $('#txtWebSite').val('');
    $('#hfVendorId').val('');
    $('#addVendor_popup').modal('hide');
    $('#ConfirmationPopup').modal('hide');
}