var SubCatId;
var ItemId;
var ItemVeriationId;
var currentRow = null;
var flag = 0;
var CountryCode;
var url;
$(document).ready(function () {

    /*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/
    /*var url = 'https://localhost:44322/HOME/';*/
    var RestaurantId = '{"Id":"' + $('#SessionResturantId').val() + '"}';
    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    Common.Ajax('POST', url + 'GetRestaurants', RestaurantId, 'json', RestaurantDetailHandler);
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('#OrderDate').datepicker({
        minDate: today
    });

    var defaultStartTime = moment(new Date());
    var TimeDate = new Date();
    var time = TimeDate.getHours() + ":" + TimeDate.getMinutes();
    var hr = moment(time, 'HH:mm a').hour();
    var min = moment(time, 'HH:mm a').minutes();
    defaultStartTime = defaultStartTime.hours(hr).minutes(min);

    $('#OrderTime').datetimepicker({

        format: 'HH:mm',
        defaultDate: defaultStartTime
    });
    $(".numeric").keydown(function (event) {


        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }

        if ($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
            event.preventDefault();

    });
    $('.alpha').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var strigChar = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(strigChar)) {
            return true;
        }
        return false
    });
    $('#OrderDate').datepicker('setDate', today);
    /*$('#OrderDate').val(today);*/
    /* CountryCode = "PK";*/

    //var options = {
    //    /*types: ['(cities)'],*/
    //    componentRestrictions: { country: CountryCode }
    //};

    //google.maps.event.addDomListener(window, 'load', function () {
    //    var places = new google.maps.places.Autocomplete(document.getElementById('CustomerAddress'),options);
    //    var Pickupplaces = new google.maps.places.Autocomplete(document.getElementById('PickupLoacation'),options);
    //    var geocoder = new google.maps.Geocoder();
    //    google.maps.event.addListener(places, 'place_changed', function () {
    //        var address = $('#CustomerAddress').val();
    //        geocoder.geocode({ 'address': address }, function (results, status) {

    //            if (status == google.maps.GeocoderStatus.OK) {
    //                var latitude = results[0].geometry.location.lat();
    //                var longitude = results[0].geometry.location.lng();
    //                alert("latitude : " + latitude + "longitude :" + longitude);
    //            }
    //        });


    //    });
    //    //google.maps.event.addListener(Pickupplaces, 'place_changed', function () {

    //    //    var address = $('#PickupLoacation').val();
    //    //    geocoder.geocode({ 'address': address }, function (results, status) {

    //    //        if (status == google.maps.GeocoderStatus.OK) {
    //    //            var latitude = results[0].geometry.location.lat();
    //    //            var longitude = results[0].geometry.location.lng();
    //    //            alert("latitude : " + latitude + "longitude :" + longitude);
    //    //        }
    //    //    });
    //    //});
    //    //google.maps.event.addListener(places, 'place_changed', function () {
    //    //    var place = places.getPlace();
    //    //    var address = place.formatted_address;
    //    //    var latitude = place.geometry.location.A;
    //    //    var longitude = place.geometry.location.F;
    //    //    var mesg = "Address: " + address;
    //    //    mesg += "\nLatitude: " + latitude;
    //    //    mesg += "\nLongitude: " + longitude;
    //    //    alert(mesg);
    //    //});
    //});
    /*var url = 'https://192.168.18.7/WebApi/Home/';*/


    $("#ddlSubCategory").select2();
    $("#ddlItem").select2();
    $("#ddlItemVariation").select2();
    var jsonRestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';
    console.log(jsonRestaurantId);
    Common.Ajax('POST', url + 'GetAllCategories', jsonRestaurantId, 'json', CategoryDropdownHandler);
    ClearAll_DDL();

    $('#ddlCategory').change(function () {
        ClearAll_DDL();
        var Id = $('#ddlCategory').val();
        var dataToPost = '{"Id":"' + Id + '"}';
        Common.Ajax('POST', url + 'GetSubCategories', dataToPost, 'json', SubCategoryHandler);



    });

    $('#ddlSubCategory').change(function () {

        var Id = $('#ddlSubCategory').val();
        if (typeof SubCatId != 'undefined') {
            Id = SubCatId;
        }
        var dataToPost = '{"Id":"' + Id + '"}';
        Common.Ajax('POST', url + 'GetItem_BySubCategories', dataToPost, 'json', ItemHandler);
    });
    $('#ddlItem').change(function () {
        var Id = $('#ddlItem').val();
        if (typeof ItemId != 'undefined') {

            Id = ItemId;
        }
        var dataToPost = '{"Id":"' + Id + '"}';
        Common.Ajax('POST', url + 'GetItemVeriation_ByItem', dataToPost, 'json', ItemVariationHandler);
    });
    $('#ddlItemVariation').change(function () {
        //var Id = $('#ddlItemVariation').val();
        //if (typeof ItemVeriationId != 'undefined') {

        //    Id = ItemVeriationId;
        //}
        //var dataToPost = '{"Id":"' + Id + '"}';
        //Common.Ajax('POST', url + 'GetItemRate_ByItemVeriation', dataToPost, 'json', ItemRateHandler);
        //alert($(this).find(':selected').data('rate'));
        //alert($(this).find(':selected').data('itemveriationid'));
        $('#ProductRate').val($(this).find(':selected').data('rate'));
        
    });
    $('#AddProduct').click(function () {
        if ($('#ddlCategory').val() != "" && $('#ddlSubCategory').val() != "" && $('#ddlItem').val() != "" && $('#ddlItemVariation').val() != "" && $('#ProductRate').val() != "" && $('#ProductQty').val() != "") {
            AddProduct();
        }

    });

    $('#CustomerMultiLocations').change(function () {
        $('#DoorNo').val($('#CustomerMultiLocations  option:selected').data('value'));
    });
    $('#TelephoneNo').autocomplete({

        source: function (request, response) {
            var autocompleteUrl = url + 'GetCustomerPhoneNo';
            $.ajax({
                url: autocompleteUrl,
                type: 'GET',
                cache: false,
                dataType: 'json',
                data: { Prefix: request.term },
                success: function (json) {
                    // call autocomplete callback method with results  
                    $('#CustomerId').val('');
                    $('#FName').val('');
                    $('#Email').val('');
                    $('#CustomerAddress').val('');
                    $('#DoorNo').val('');
                    response($.map(json, function (data, id) {
                        return {
                            label: data.TelephoneNo,
                            value: data.Id,
                            Email: data.Email,
                            Fname: data.Fname,
                            CustAddress: data.CustAddress
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

            //alert('you have selected ' + ui.item.label + ' ID: ' + ui.item.value);
            $('#CustomerId').val(ui.item.value);
            $('#FName').val(ui.item.Fname);
            $('#Email').val(ui.item.Email);
            /*$('#CustomerAddress').val(ui.item.CustAddress);*/
            $('#TelephoneNo').val(ui.item.label);
            var dataToPost = '{"Id":"' + ui.item.value + '"}';
            Common.Ajax('POST', url + 'GetCustomerDetails', dataToPost, 'json', CustomerDetailsHandler);
            return false;
        }
    });

    $("#product_table").on('click', '.DeleteProduct', function () {
        if (confirm("Are you sure?")) {
            $(this).parents('tr').remove();
            calculateColumn(4);
        }

    });
    $("#product_table").on('click', '.EditProduct', function () {
        // get the current row
        currentRow = $(this).parents("tr");
        flag = 0;
        var col1 = currentRow.find("td:eq(0)").text();
        var col2 = currentRow.find("td:eq(1)").text();
        var col3 = currentRow.find("td:eq(2)").text();
        var CatId = currentRow.find("td:eq(6)").text();
        SubCatId = currentRow.find("td:eq(7)").text();
        ItemId = currentRow.find("td:eq(8)").text();
        ItemVeriationId = currentRow.find("td:eq(9)").text();
        var ProductQty = currentRow.find("td:eq(2)").text();
        var ProductRate = currentRow.find("td:eq(3)").text();

        $('#ddlCategory').val(CatId);
        $('#ddlCategory').trigger('change');


        $('#ddlSubCategory').trigger('change');

        $('#ddlItem').trigger('change');
        $('#ddlItemVariation').val(ItemVeriationId);
        //$('#ddlItemVariation').trigger('change');
        $('#ProductQty').val(ProductQty)
        $('#ProductRate').val(ProductRate)
    });
    $('#viewMap').click(function () {
        $('#myModal').modal('show');
    });
    $('#SubmitOrder').click(function () {
        var amount = 0;
        $("#product_table tfoot TR").each(function () {
            var row = $(this);
            amount = row.find("TD").eq(4).html();
        });
        var Order = {};
        var Time = $('#OrderTime').val();
        //var OrderDetails = new Array();
        Order.CustomerId = $('#CustomerId').val();
        Order.RestaurantId = $('#SessionResturantId').val();
        Order.Fname = $('#FName').val();
        Order.Email = $('#Email').val();
        Order.CustAddress = $('#CustomerAddress').val();
        Order.TelephoneNo = $('#TelephoneNo').val();
        Order.CountryId = 1;
        Order.CityId = 1;
        Order.DoorNo = $('#DoorNo').val();
        Order.CustomerAddress = $('#CustomerAddress').val();
        Order.CustomerAddress1 = '';
        Order.CustomerLat = $('#HFCustomerLat').val();
        Order.CustomerLan = $('#HFCustomerLan').val();
        Order.PaymentId = 1;
        Order.PicupLocation = $('#PickupLoacation').val();
        Order.PickupLat = $('#HFRestaurantLat').val();
        Order.PickupLan = $('#HFRestaurantLan').val();
        Order.OrderAmount = amount;
        Order.OrderDiscount = 0;
        Order.OrderDiscountPer = 0;
        Order.OrderNetAmount = amount;
        Order.CreatedBy = 1;
        Order.OrderDate = OrderDate + Time;
        Order.orderDetails = new Array();
        $("#product_table TBODY TR").each(function () {
            var row = $(this);
            var OrderDetail = {};
            OrderDetail.OrderMasterId = 0
            OrderDetail.CategoryId = row.find("TD").eq(6).html();
            OrderDetail.SubCategoryId = row.find("TD").eq(7).html();
            OrderDetail.ItemId = row.find("TD").eq(8).html();
            OrderDetail.ItemVeriationId = row.find("TD").eq(9).html();
            OrderDetail.ItemRateId = row.find("TD").eq(10).html();
            OrderDetail.ItemQty = row.find("TD").eq(2).html();
            OrderDetail.Rate = row.find("TD").eq(3).html();
            OrderDetail.Amount = row.find("TD").eq(4).html();
            OrderDetail.CreatedBy = 0;
            OrderDetail.CreateDate = null;
            OrderDetail.IsActive = 1;
            OrderDetail.IsDeleted = 0;

            Order.orderDetails.push(OrderDetail);
        });

        console.log(JSON.stringify(Order));
        Common.Ajax('POST', url + 'InsertOrder', JSON.stringify(Order), 'json', TestHandler);
    });
    $('#bttnYes').click(function () {
        location.reload();
    });
    $('#bttnNo').click(function () {
        window.location.href = "../Home/Index";
    });
});
function TestHandler(response) {
     /*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/
    /*var url = 'https://localhost:44322/HOME/';*/

    var OrderRequest = {};
    OrderRequest.OrderId = 0;
    OrderRequest.DriverId = 0;
    OrderRequest.DriverStatusId = 0;
    OrderRequest.status = "";
    OrderRequest.OrderNo = "";
    OrderRequest.ResturantId = $('#SessionResturantId').val();
    OrderRequest.IsWeb = 1
    OrderRequest.Body = "";

    Common.Ajax('POST', url + 'SentNotification_WhenOrderSaveFromWeb', JSON.stringify(OrderRequest), 'json', NotificationHandler);
    console.log(response);
    $('#Msg').html(response.Message);
    $('#SavePopup').modal('show');
}
function NotificationHandler(response) {

}
function CustomerDetailsHandler(response) {


    var html = '';
    html += "<option value =''>Select</option>";
    if (response.length > 0) {
        $('#CustomerAddress').val(response[0].CustomerAddress);
        $('#HFCustomerLat').val(response[0].CustomerLat);
        $('#HFCustomerLan').val(response[0].CustomerLan);
        $('#DoorNo').val(response[0].DoorNo);
        $.each(response, function (i, item) {
            html += '<option value=' + item.Id + ' data-value= "' + item.DoorNo + '">' + item.CustomerAddress + '</option>';
        });
    }

    $("#CustomerMultiLocations").select2();
    $('#CustomerMultiLocations').html(html);
}
function RestaurantDetailHandler(response) {

    if (response.length > 0) {
        CountryCode = response[0].CountryCode;
        $('#HFRestaurantLat').val(response[0].RestaurantLat);
        $('#HFRestaurantLan').val(response[0].RestaurantLan);
        $('#PickupLoacation').val(response[0].RestaurantAddress);
    }
    var DeliveryLocation = new google.maps.places.Autocomplete((document.getElementById('CustomerAddress')), {

        componentRestrictions: {
            country: CountryCode
        }
    });
    var PickupLocation = new google.maps.places.Autocomplete((document.getElementById('PickupLoacation')), {

        componentRestrictions: {
            country: CountryCode
        }
    });
    var geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(DeliveryLocation, 'place_changed', function () {
        var address = $('#CustomerAddress').val();
        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                alert("latitude : " + latitude + "longitude :" + longitude);
                $('#HFCustomerLat').val(latitude);
                $('#HFCustomerLan').val(longitude);
            }
        });
    });
}
function CategoryDropdownHandler(response) {
    var html = '';
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.Id + '>' + item.CategoryDesc + '</option>';
    });
    $("#ddlCategory").select2();
    $('#ddlCategory').html(html);
}
function SubCategoryHandler(response) {
    var html = '';
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.Id + '>' + item.SubCategiryDesc + '</option>';
    });
    /*$("#ddlSubCategory").select2();*/
    $('#ddlSubCategory').html(html);
    if (typeof SubCatId != 'undefined') {
        $('#ddlSubCategory').val(SubCatId);
    }
}
function ItemHandler(response) {
    console.log(response);
    var html = '';
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.ItemId + '>' + item.ItemDesc + '</option>';
    });
    /*$("#ddlItem").select2();*/
    $('#ddlItem').html(html);
    if (typeof ItemId != 'undefined') {
        $('#ddlItem').val(ItemId);
    }
}
function ItemVariationHandler(response) {
    var html = '';
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.RateId + ' data-ItemVeriationId= ' + item.ItemVeriationId + ' data-Rate=' + item.Rate + '>' + item.ItemSize + '</option>';
    });
    /* $("#ddlItemVariation").select2();*/
    $('#ddlItemVariation').html(html);
    if (typeof ItemVeriationId != 'undefined') {
        $('#ddlItemVariation').val(ItemVeriationId);
    }
}
function ItemRateHandler(response) {
    if (response.length > 0) {
        $('#ProductRate').val(response[0].Rate);
        $('#ProductRate').val(response[0].Rate);
    }

}


function AddProduct() {
    var CategoryId = $('#ddlCategory option:selected').val();
    var SubCategoryId = $('#ddlSubCategory option:selected').val();
    var ItemId = $('#ddlItem option:selected').val();
/*var ItemVeriationId = $('#ddlItemVariation option:selected').val();*/
    var ItemVeriationId = $('#ddlItemVariation').find(':selected').data('itemveriationid');
    var RateId = $('#ddlItemVariation option:selected').val();
    var Item = $('#ddlItem option:selected').text();
    var Qty = $('#ProductQty').val();
    var Rate = $('#ProductRate').val();
    var Variation = $('#ddlItemVariation option:selected').text();
    var Value = Rate * Qty;
    if (currentRow == null) {
        CheckDataExistsInTable();
    }

    if (flag == 0) {

        //var newrow = '<tr><td class="nr">' + Item + '</td><td>' + Variation + '</td><td>' + Qty + '</td><td>' + Rate + '</td><td>' + Value + '</td>' +
        //    '<td><li class="list-inline-item"><button class="btn btn-success btn-sm rounded-0 EditProduct" type="button" data-toggle="tooltip" data-placement="top" title="Edit">' +
        //    '<i class="fa fa-edit"></i></button></li>' +
        //    '<li class="list-inline-item"><button class="btn btn-danger btn-sm rounded-0 DeleteProduct" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button></li>' +
        //    '</td><td style= "display:none">' + CategoryId + '</td><td style= "display:none">' + SubCategoryId + '</td><td style= "display:none">' + ItemId + '</td><td style= "display:none">' + ItemVeriationId + '</td></tr > ';
        //<button class="btn btn-primary"><i class="fa fa-edit"></i></button>
        var newrow = '<tr><td class="nr">' + Item + '</td><td>' + Variation + '</td><td>' + Qty + '</td><td>' + Rate + '</td><td>' + Value + '</td>' +
            '<td class="text-right"><button class="btn btn-primary EditProduct" type="button" data-toggle="tooltip" data-placement="top" title="Edit">' +
            '<i class="fa fa-edit"></i></button>' +
            '<button class="btn btn-danger DeleteProduct" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>' +
            '</td><td style= "display:none">' + CategoryId + '</td><td style= "display:none">' + SubCategoryId + '</td><td style= "display:none">' + ItemId + '</td><td style= "display:none">' + ItemVeriationId + '</td><td style= "display:none">' + RateId + '</td></tr > ';
        if (currentRow) {
            currentRow.replaceWith(newrow);
            //$("#product_table tbody").find($(currentRow)).replaceWith(newrow);
            currentRow = null;
        }
        else {
            /*$('#product_table tr:first').after(newrow);*/
            $('#product_table > tbody').prepend(newrow);
        }
    }


    calculateColumn(4);
}
function CheckDataExistsInTable() {
    var C_CategoryId = $('#ddlCategory').val();
    var C_SubCategoryId = $('#ddlSubCategory').val();
    var C_ItemId = $('#ddlItem').val();
/* var C_ItemVeriationId = $('#ddlItemVariation').val();*/
    var C_ItemVeriationId = $('#ddlItemVariation').find(':selected').data('itemveriationid');
    $("#product_table tbody").find("tr").each(function () {
        var td1 = $(this).find("td:eq(6)").text();
        var td2 = $(this).find("td:eq(7)").text();
        var td3 = $(this).find("td:eq(8)").text();
        var td4 = $(this).find("td:eq(9)").text();
        var ExistingQty = $(this).find("td:eq(2)").text();
        var qty = $('#ProductQty').val();
        var Rate = $(this).find("td:eq(3)").text();
        var TotalValue = 0;
        var TotalQty = 0;
        if ((C_CategoryId == td1) && (C_SubCategoryId == td2) && (C_ItemId == td3) && (C_ItemVeriationId == td4)) {
            flag = 1;
            TotalQty = parseInt(ExistingQty) + parseInt(qty);
            TotalValue = TotalQty * Rate;
            $(this).find("td:eq(2)").text(TotalQty);
            $(this).find("td:eq(4)").text(TotalValue);
            return false;
        }
        else {
            flag = 0;
        }
    });
}
function calculateColumn(index) {
    var total = 0;
    $('#product_table tfoot td').eq(index).text('');
    $('#product_table tr').each(function () {
        var value = parseInt($('td', this).eq(index).text());
        if (!isNaN(value)) {
            total += value;
        }
    });
    $('#product_table tfoot td').eq(index).text(total);
}
function ClearAll_DDL() {
    var html = '';
    html += "<option value =''>Select</option>";
    $('#ProductRate').val('');
    $('#ddlItemVariation').html(html);
    $('#ddlItem').html(html);
    $('#ddlSubCategory').html(html);
}

