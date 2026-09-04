
var url;
var SubCategoryId;
var CientId;
$(document).ready(function () {
    /*var url = 'https://api.atechsolutions.co/Deliverapp/HOME/';*/
    /*var url = 'https://localhost:44322/HOME/';*/


    /*CommonDataform.Ajax('POST', '../data.txt','', ReadFileHandler);*/
    $.ajax({
        url: '../data.txt',
        async: false,   // asynchronous request? (synchronous requests are discouraged...)
        cache: false,   // with this, you can force the browser to not make cache of the retrieved data
        dataType: "text",  // jQuery will infer this, but you can set explicitly
        success: function (data, textStatus, jqXHR) {
            url = data;
        }
    });
    $('#ddlCategory_Addon').select2();
    $('#ddlSubCategory_Addon').select2();
    $('#ddlCategory_Option1').select2();
    $("#ddlCategory").select2();
    $('#ddlCategory0').select2();
    $("#ddlSubCategory").select2();
    $("#ddlItemVariation").select2();
    $('#txtItemDesc').autocomplete({
        source: function (request, response) {
            var autocompleteUrl = url + 'AutoCompleteItem';
            var SubCategoryId = $('#ddlSubCategory').val();
            $.ajax({
                url: autocompleteUrl,
                type: 'GET',
                cache: false,
                dataType: 'json',
                data: { SubCategoryId: SubCategoryId, Prefix: request.term, DefaultClientId: DefaultClientId },
                success: function (json) {
                    // call autocomplete callback method with results  
                    console.log(json);
                    if (json.length == 0) {
                        $('#txtProductShortCode').val('');

                        /*$('#chkIsActive').prop("checked", false);*/
                    }
                    response($.map(json, function (data, id) {
                        return {
                            label: data.ItemDesc,
                            value: data.Id,
                            ShortDesc: data.ShortDesc,
                            SortOrder: data.SortOrder,
                            IsActive: data.IsActive
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
            $('#txtItemDesc').val(ui.item.label);
            $('#txtProductShortCode').val(ui.item.ShortDesc);
            /*$('#SortOrder').val(ui.item.SortOrder);*/
            //if (ui.item.IsActive == 1) {

            //    $('#chkIsActive').prop("checked", true);
            //}
            //else {
            //    $('#chkIsActive').prop("checked", false);
            //}

            return false;
        }
    });
    $('#Category').autocomplete({
        source: function (request, response) {
            var autocompleteUrl = url + 'AutoCompleteCategory';
            $.ajax({
                url: autocompleteUrl,
                type: 'GET',
                cache: false,
                dataType: 'json',
                data: { ResturantId: $('#SessionResturantId').val(), Prefix: request.term },
                success: function (json) {
                    // call autocomplete callback method with results  
                    console.log(json);
                    if (json.length == 0) {
                        $('#ShortDesc').val('');
                        $('#SortOrder').val('');
                        $('#chkIsActive').prop("checked", false);
                    }
                    response($.map(json, function (data, id) {
                        return {
                            label: data.CategoryDesc,
                            value: data.Id,
                            ShortDesc: data.ShortDesc,
                            SortOrder: data.SortOrder,
                            IsActive: data.IsActive
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
            $('#Category').val(ui.item.label);
            $('#ShortDesc').val(ui.item.ShortDesc);
            $('#SortOrder').val(ui.item.SortOrder);
            if (ui.item.IsActive == 1) {

                $('#chkIsActive').prop("checked", true);
            }
            else {
                $('#chkIsActive').prop("checked", false);
            }

            return false;
        }
    });
    CientId = '{"DefaultClientId":"' + DefaultClientId + '"}';
    /*var RestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';*/
    //Common.Ajax('POST', url + 'GetAllSubCategoryList', RestaurantId, 'json', AllSubCategoryListHandler);
    //Common.Ajax('POST', url + 'GetAllItemList', RestaurantId, 'json', AllItemListHandler);
    Common.Ajax('POST', url + 'GetAllCategories', CientId, 'json', CategoryHandler);
    //Common.Ajax('GET', url + 'GetAllItemVeriation', '', 'json', AllItemVeriationHandler);
    Common.Ajax('GET', url + 'GetUOM?ClientId=' + DefaultClientId, DefaultClientId, 'json', bindUOMHandler);
    Common.Ajax('POST', url + 'GetRawMaterial', CientId, 'json', bindRawMaterialHandler);

    $('#tabAddons').click(function () {
        Common.Ajax('POST', url + 'GetAllAddons', CientId, 'json', AllAddonsHandler);
    });
    $('#tabOptions1').click(function () {
        Common.Ajax('POST', url + 'GetAllOptions1', CientId, 'json', AllOptions1Handler);
    });
    $('#tabOptions2').click(function () {
        Common.Ajax('POST', url + 'GetAllOptions1', CientId, 'json', AllOptions2Handler);

    });
    $('#tabCatagory').click(function () {
        Common.Ajax('POST', url + 'GetAllCategories', CientId, 'json', CategoryHandler);
    });
    $('#tabSubCatagory').click(function () {
        Common.Ajax('POST', url + 'GetAllSubCategoryList', CientId, 'json', AllSubCategoryListHandler);
    });
    $('#tabProduct').click(function () {
        Common.Ajax('POST', url + 'GetAllItemList', CientId, 'json', AllItemListHandler);

    });
    $('#tabDeal').click(function () {
        Common.Ajax('POST', url + 'GetDealItems', CientId, 'json', AllDealItemListHandler);
    });
    $("#Category_table").on('click', '.CategoryEdit', function () {
        var currentRow = $(this).parents("tr");
        var IsActive = currentRow.find("td:eq(0)").text();
        var CatId = currentRow.find("td:eq(1)").text();
        var Category = currentRow.find("td:eq(2)").text();
        var ShortDesc = currentRow.find("td:eq(3)").text();
        var SortOrder = currentRow.find("td:eq(4)").text();
        var ImageUrl = currentRow.find("td:eq(5)").text();
        $('#HDFCategoryId').val(CatId);
        $("#Categorydesc").val(Category);
        $("#CategoryShortDesc").val(ShortDesc);
        $("#SortOrderCategory").val(SortOrder);
        $('#img-upload1').attr('src', ImageUrl);
        if (IsActive == "true") {
            $('#chkIsActiveCategory').prop("checked", true);
        }
        else {
            $('#chkIsActiveCategory').prop("checked", false);
        }
    });
    $("#Category_table").on('click', '.DeleteCategory', function () {

        var currentRow = $(this).parents("tr");
        var CatId = currentRow.find("td:eq(1)").text();
        alert(CatId);
        var request = {};
        request.Id = Id;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetSubCategories', JSON.stringify(request), 'json', DeleteCategoryHandler);
    });
    $("#SubCategory_table").on('click', '.SubCategoryEdit', function () {
        var currentRow = $(this).parents("tr");
        var Category = currentRow.find("td:eq(0)").text();
        var SubCategory = currentRow.find("td:eq(1)").text();
        var ShortDesc = currentRow.find("td:eq(2)").text();
        var SortOrder = currentRow.find("td:eq(3)").text();
        var SubCatId = currentRow.find("td:eq(4)").text();
        var CatId = currentRow.find("td:eq(5)").text();
        var IsActive = currentRow.find("td:eq(6)").text();

        $('#ddlCategory0').select2().val(CatId).trigger("change");
        $('#txt_subcategory').val(SubCategory);
        $('#txtShortDescriptionSubCategory').val(ShortDesc);
        $('#txtSortOrderSubCategory').val(SortOrder);
        $('#Subscategory_CategoryId').val(CatId);
        $('#Subscategory_SubscategoryId').val(SubCatId);
        if (IsActive == "true") {
            $('#chkSubCategory').prop("checked", true);
        }
        else {
            $('#chkSubCategory').prop("checked", false);
        }
    });
    $("#Product_table").on('click', '.ProductListEdit', function () {
        var currentRow = $(this).parents("tr");
        var ItemId = currentRow.find("td:eq(8)").text();
        var ItemVeriationId = currentRow.find("td:eq(9)").text();
        var RateId = currentRow.find("td:eq(10)").text();
        SubCategoryId = currentRow.find("td:eq(11)").text();
        var CategoryId = currentRow.find("td:eq(13)").text();
        var ImagePath = currentRow.find("td:eq(12)").text();
        var ItemDesc = currentRow.find("td:eq(2)").text();
        var ShortCode = currentRow.find("td:eq(3)").text();
        var Rate = currentRow.find("td:eq(5)").text();
        var SortOrder = currentRow.find("td:eq(6)").text();
        var IsActive = currentRow.find("td:eq(14)").text();
        $('#txtItemDesc').val(ItemDesc);
        $('#txtProductShortCode').val(ShortCode);
        $('#ProductSortOrder').val(SortOrder);
        $('#img-upload').attr('src', ImagePath);
        //$('#ddlCategory').val(CategoryId);
        $('#ddlCategory').select2().val(CategoryId).trigger("change");
        $('#ddlItemVariation').select2().val(ItemVeriationId).trigger("change");
        $('#txtRate').val(Rate);
        if (IsActive == "true") {
            $('#chkIsActiveProduct').prop("checked", true);
        }
        else {
            $('#chkIsActiveProduct').prop("checked", false);
        }
        $('#HFProductItemId').val(ItemId);
        $('#HFProductItemVeriationId').val(ItemVeriationId);
        $('#HFProductRateId').val(RateId);
        $('#HFProductSubCategoryId').val(SubCategoryId);
    });

    $('#ddlCategory').change(function () {

        var Id = $('#ddlCategory').val();
        //var dataToPost = '{"Id":"' + Id + ', DefaultClientId : ' + CientId + '"}';
        //var dataToPost = '{"Id":"' + Id + '","DefaultClientId":"' + DefaultClientId + '"}';
        var request = {};
        request.Id = Id;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetSubCategories', JSON.stringify(request), 'json', SubCategoryHandler);
    });
    $('#ddlCategory_Addon').change(function () {

        var Id = $('#ddlCategory_Addon').val();
        //var dataToPost = '{"Id":"' + Id + ', DefaultClientId : ' + CientId + '"}';
        //var dataToPost = '{"Id":"' + Id + '","DefaultClientId":"' + DefaultClientId + '"}';
        var request = {};
        request.Id = Id;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetSubCategories', JSON.stringify(request), 'json', SubCategoryAddonHandler);
    });
    $('#ddlCategory_Option1').change(function () {

        var Id = $('#ddlCategory_Option1').val();
        //var dataToPost = '{"Id":"' + Id + ', DefaultClientId : ' + CientId + '"}';
        //var dataToPost = '{"Id":"' + Id + '","DefaultClientId":"' + DefaultClientId + '"}';
        var request = {};
        request.Id = Id;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetSubCategories', JSON.stringify(request), 'json', CategoryOptions1Handler);
    });
    $('#ddlCategory_Option2').change(function () {

        var Id = $('#ddlCategory_Option2').val();
        var request = {};
        request.CategoryId = Id;
        request.SubCategoryID = "";
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetITemByCategrory', JSON.stringify(request), 'json', bindItemOptions2Handler);
    });
    $('#ddlDealCategory').change(function () {

        var Id = $('#ddlDealCategory').val();
        var request = {};
        request.CategoryId = Id;
        request.SubCategoryID = "";
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetITemByCategrory', JSON.stringify(request), 'json', bindDealITemHandler);
    });
    $('#ddlRawMaterial1').change(function () {

        var Id = $('#ddlRawMaterial1').val();
        var request = {};
        request.MaterialId = Id;
        request.DefaultClientId = DefaultClientId;
        Common.Ajax('POST', url + 'GetUOMbyMaterial', JSON.stringify(request), 'json', bindUOMHandler);
    });
    $('#SubmitCategory').click(function () {
        var Isactive = false;
        if ($("#chkIsActiveCategory").is(':checked'))
            Isactive = true;
        else {
            Isactive = false;
        }
        var file = new FormData();
        var files = $("#UploadCategory").get(0).files;
        var ImageUrl = $('#img-upload1').attr('src');
        var CategoryId = $('#HDFCategoryId').val();
        if (CategoryId == '') {
            CategoryId = 0;
        }
        var IsEdit = "";
        if (CategoryId == "") {
            if (files.length == 0) {
                //$("#Alert").show();
                //$('#Alert').html('Image Required');
                CommonFunction.MsgAlert('Image Required');
                return false;
            }

        }
        if (CategoryId != "") {
            IsEdit = "1";

        }
        if (files.length > 0) {
            ImageUrl = "";
        }
        if ($('#Categorydesc').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Category Required');
            CommonFunction.MsgAlert('Category Required');
            $('#Categorydesc').css('border-color', 'red');
            $('#Categorydesc').focus();
            return false;
        }
        if ($('#CategoryShortDesc').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Short Desc Required');
            CommonFunction.MsgAlert('Short Desc Required');
            $('#CategoryShortDesc').css('border-color', 'red');
            $('#CategoryShortDesc').focus();
            return false;
        }
        if ($('#SortOrderCategory').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Sort Required');
            $('#SortOrderCategory').css('border-color', 'red');
            $('#SortOrderCategory').focus();
            return false;
        }

        $("#Alert").hide();
        file.append("file", files[0]);
        file.append("ResturantId", $('#SessionResturantId').val());
        file.append("RestaurantName", $('#SessionRestaurantName').val());
        file.append("CategoryDesc", $('#Categorydesc').val());
        file.append("ShortDesc", $('#CategoryShortDesc').val());
        file.append("SortOrder", $('#SortOrderCategory').val());
        file.append("CreatedBy", $('#SessionUserId').val());
        file.append("IsActive", Isactive);
        file.append("IsEdit", IsEdit);
        file.append("DefaultClientId", DefaultClientId);
        file.append("ImagePath", ImageUrl);
        file.append("CategoryId", CategoryId);
        CommonDataform.Ajax('POST', url + 'AddCategory', file, AddCategoryHandler);
    });

    $('#SubmitSubCategory').click(function () {
        var Isactive = false;
        if ($("#chkSubCategory").is(':checked'))
            Isactive = true;
        else {
            Isactive = false;
        }

        if ($('#ddlCategory0').val() == "0") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Category Required');
            $('#ddlCategory0').css('border-color', 'red');
            $('#ddlCategory0').focus();
            return false;
        }

        if ($('#txt_subcategory').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Sub-Category Required');
            $('#txt_subcategory').css('border-color', 'red');
            $('#txt_subcategory').focus();
            return false;
        }

        if ($('#txtShortDescriptionSubCategory').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Short Description Required');
            $('#txtShortDescriptionSubCategory').css('border-color', 'red');
            $('#txtShortDescriptionSubCategory').focus();
            return false;
        }

        if ($('#txtSortOrderSubCategory').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Sort Order Required');
            $('#txtShortDescriptionSubCategory').css('border-color', 'red');
            $('#txtShortDescriptionSubCategory').focus();
            return false;
        }

        var subCategory = {};
        subCategory.CategoryId = $('#ddlCategory0').val();
        subCategory.SubCategiryDesc = $('#txt_subcategory').val();
        subCategory.ShortDesc = $('#txtShortDescriptionSubCategory').val();
        subCategory.SortOrder = $('#txtSortOrderSubCategory').val();
        subCategory.CreatedBy = $('#SessionUserId').val();
        subCategory.IsActive = Isactive;
        subCategory.DefaultClientId = DefaultClientId;
        console.log(JSON.stringify(subCategory));
        Common.Ajax('POST', url + 'AddSubCategory', JSON.stringify(subCategory), 'json', AddSubCategoryHandler);
    });

    $("#AddProduct").click(function () {

        var Isactive = false;
        if ($("#chkIsActiveProduct").is(':checked'))
            Isactive = true;
        else {
            Isactive = false;
        }

        var files = $("#imgInp").get(0).files;
        if ($('#HFProductItemId').val() == '') {
            if (files.length == 0) {
                //$("#Alert").show();
                //$('#Alert').html('Image Required');
                CommonFunction.MsgAlert('Image Required');
                return false;
            }
        }
       

        if ($('#ddlCategory').val() == "0") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Category Required');
            $('#ddlCategory').css('border-color', 'red');
            $('#ddlCategory').focus();
            return false;
        }

        if ($('#ddlSubCategory').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Sub Category Required');
            $('#ddlSubCategory').css('border-color', 'red');
            $('#ddlSubCategory').focus();
            return false;
        }

        if ($('#txtItemDesc').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Item Description Required');
            $('#txtItemDesc').css('border-color', 'red');
            $('#txtItemDesc').focus();
            return false;
        }

        if ($('#txtProductShortCode').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Product Short Code Required');
            $('#txtProductShortCode').css('border-color', 'red');
            $('#txtProductShortCode').focus();
            return false;
        }

        if ($('#ddlItemVariation').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Item Variation Required');
            $('#ddlItemVariation').css('border-color', 'red');
            $('#ddlItemVariation').focus();
            return false;
        }

        if ($('#txtRate').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Rate Required');
            $('#txtRate').css('border-color', 'red');
            $('#txtRate').focus();
            return false;
        }

        if ($('#ProductSortOrder').val() == "") {
            //$("#Alert").show();
            //$('#Alert').html('Sort Required Required');
            CommonFunction.MsgAlert('Product Sort Order Required');
            $('#ProductSortOrder').css('border-color', 'red');
            $('#ProductSortOrder').focus();
            return false;
        }




        var file = new FormData();
        var files = $("#imgInp").get(0).files;
        file.append("file", files[0]);
        file.append("SubCategoryId", $('#ddlSubCategory').val());
        file.append("ItemDesc", $('#txtItemDesc').val());

        file.append("ShortDesc", $('#txtProductShortCode').val());
        file.append("SortOrder", $('#ProductSortOrder').val());
        file.append("CreatedBy", $('#SessionUserId').val());
        file.append("IsActive", Isactive);
        file.append("ItemVeriationId", $('#ddlItemVariation').val());
        file.append("Rate", $('#txtRate').val());
        file.append("CategoryDesc", $('#ddlCategory option:selected').text());
        file.append("SubCategoryDesc", $('#ddlSubCategory option:selected').text());
        file.append("RestaurantName", $('#SessionRestaurantName').val());
        file.append("DefaultClientId", DefaultClientId);
        if ($('#HFProductItemId').val() == "") {
            CommonDataform.Ajax('POST', url + 'AddProduct', file, ProductHandler);
        }
        else {
            var ItemID = $('#HFProductItemId').val();
            var RateID = $('#HFProductRateId').val();
            var ImagePath = $('#img-upload').attr('src');
            file.append("ItemId", ItemID);
            file.append("ItemRateId", RateID);
            file.append("ImagePath", ImagePath);
            CommonDataform.Ajax('POST', url + 'UpdateProduct', file, ProductHandler);
        }

    });

    $("#txtProductSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#Product_table tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $('#ClearProduct').click(function () {
        ClearProduct();
    });
    $('#AddAddons').click(function () {
        var requests = {};
        var IsAddonMultiselect = false;
        if ($('#IsAddonMultiselect:checked ').is(':checked')) {
            IsAddonMultiselect = true;
        }

        requests.DefaultClientId = DefaultClientId;
        requests.addons = new Array();
        //requests.IsMultiSelectAddon = 1;
        $("#tableItemAddons TBODY TR input[type='checkbox']:checked").each(function () {
            var ItemId;
            var row = $(this).closest("tr")[0];


            ItemId = row.cells[2].innerHTML;
            $("#tableAddons TBODY TR input[type='checkbox']:checked").each(function () {
                var addon = {};
                addon.ItemId = ItemId;
                addon.IsAddonMultiselect = IsAddonMultiselect;
                var row = $(this).closest("tr")[0];
                addon.AddonId = row.cells[0].innerHTML;
                requests.addons.push(addon);
            });




        });
        console.log(JSON.stringify(requests));
        Common.Ajax('POST', url + 'AddAddons', JSON.stringify(requests), 'json', AddAddonsHandler);
    });
    $('#AddOption2').click(function () {
        var requests = {};
        var IsOptionsMultiselect = false;
        if ($('#IsOption2Multiselect:checked ').is(':checked')) {
            IsOptionsMultiselect = true;
        }

        requests.DefaultClientId = DefaultClientId;
        requests.options1 = new Array();
        //requests.IsMultiSelectAddon = 1;
        $("#tableItemOption2 TBODY TR input[type='checkbox']:checked").each(function () {
            var ItemId;
            var row = $(this).closest("tr")[0];


            ItemId = row.cells[2].innerHTML;
            $("#tableOption2 TBODY TR input[type='checkbox']:checked").each(function () {
                var option = {};
                option.ItemId = ItemId;
                option.IsOptionsMultiselect = IsOptionsMultiselect;
                var row = $(this).closest("tr")[0];
                option.Option1Id = row.cells[0].innerHTML;
                requests.options1.push(option);
            });




        });
        console.log(JSON.stringify(requests));
        Common.Ajax('POST', url + 'AddOption2', JSON.stringify(requests), 'json', AddAddonsHandler);
    });
    $('#AddOption1').click(function () {
        var requests = {};
        var IsOptionsMultiselect = false;
        if ($('#IsOption1Multiselect:checked ').is(':checked')) {
            IsOptionsMultiselect = true;
        }

        requests.DefaultClientId = DefaultClientId;
        requests.options1 = new Array();
        //requests.IsMultiSelectAddon = 1;
        $("#tableItemOption1 TBODY TR input[type='checkbox']:checked").each(function () {
            var ItemId;
            var row = $(this).closest("tr")[0];


            ItemId = row.cells[2].innerHTML;
            $("#tableOption1 TBODY TR input[type='checkbox']:checked").each(function () {
                var option = {};
                option.ItemId = ItemId;
                option.IsOptionsMultiselect = IsOptionsMultiselect;
                var row = $(this).closest("tr")[0];
                option.Option1Id = row.cells[0].innerHTML;
                requests.options1.push(option);
            });




        });
        console.log(JSON.stringify(requests));
        Common.Ajax('POST', url + 'AddOption1', JSON.stringify(requests), 'json', AddAddonsHandler);
    });
    $('#chktableItemAddons').click(function () {
        var isChecked = $(this).prop("checked");
        $('#tableItemAddons TBODY tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    });
    $('#ChktableAddons').click(function () {
        var isChecked = $(this).prop("checked");
        $('#tableAddons TBODY tr:has(td)').find('input[type="checkbox"]').prop('checked', isChecked);
    });
    $('#ddlDealProduct').change(function () {
        var ItemId = $('#ddlDealProduct').val();
        if (ItemId > 0) {
            var request = {};
            request.DefaultClientId = DefaultClientId;
            request.ItemId = ItemId;
            Common.Ajax('POST', url + 'GetItemVeriation_ByITem', JSON.stringify(request), 'json', ItemVeriation_ByITemHandler);
        }

    });
    $('#AddDealProduct').click(function () {
        if ($("#ddlDealProduct").val() == 0) {
            CommonFunction.MsgAlert('Product Required');
            $('#ddlDealProduct').css('border-color', 'red');
            $('#ddlDealProduct').focus();
            return false;
        }
        var CategoryName = $('#ddlDealCategory').find(':selected').text();
        //var CategoryId = $('#ddlDealSetProduct').val();
        var CategoryId = $('#ddlDealCategory').val();
        //var SubCategoryId = $('#ddlDealSetProduct').find(':selected').data('subcategoryid');
        var ItemId = $('#ddlDealProduct').val();
        var ItemName = $('#ddlDealProduct').find(':selected').text();
        var RawMaterialId = $('#ddlRawMaterial1').val();
        var RawMaterialName = $('#ddlRawMaterial1').find(':selected').text();
        var UomId = $('#ddlUOM1').val();
        var UomName = $('#ddlUOM1').find(':selected').text();
        var QTY = $('#txtqty').val();
        var html = '<tr>' +
            '<td hidden class="Dl_CategoryId">' + CategoryId + '</td>' +
            '<td hidden class="Dl_ItemId">' + ItemId + '</td>' +
            '<td hidden class="Dl_RawMaterialId">' + RawMaterialId + '</td>' +
            '<td hidden class="Dl_UomId">' + UomId + '</td>' +
            '<td>' + CategoryName + '</td>' +
            '<td>' + ItemName + '</td>' +
            '<td>' + RawMaterialName + '</td>' +
            '<td class="Dl_ItemQTY">' + QTY + '</td>' +
            '<td>' + UomName + '</td>' +
            '<td><button type= "button" class= "btn-info m-l-r" onclick= "removeTextBox(this)">Remove</td>'           
            '</tr>';

        $('#addRecipeTable > tbody').prepend(html);
    });
    $('#btnSubmit').click(function () {
        if ($("#ddlDealProduct").val() == 0) {
            CommonFunction.MsgAlert('Product Required');
            $('#ddlDealProduct').css('border-color', 'red');
            $('#ddlDealProduct').focus();
            return false;
        }
        var requests = {};
        requests.DefaultClientId = DefaultClientId;
        requests.RecipeDetail = new Array();
        $("#addRecipeTable TBODY tr").each(function () {
            var row = $(this);

            var Recipe = {};
            Recipe.CategoryId = row.find(".Dl_CategoryId").html();
            Recipe.Name = $('#ddlDealProduct').find('option:selected').text(); //row.find(".Dl_SubCategoryId").html();
            Recipe.ItemId = row.find(".Dl_ItemId").html();
            Recipe.RawMaterialId = row.find(".Dl_RawMaterialId").html();
            Recipe.UomId = row.find(".Dl_UomId").html();
            Recipe.Qty = row.find(".Dl_ItemQTY").html();
            Recipe.CreatedBy = $('#SessionUserId').val();
            requests.RecipeDetail.push(Recipe);
        });
        console.log(JSON.stringify(requests));
        Common.Ajax('POST', url + 'InsertRecipe', JSON.stringify(requests), 'json', AddRecipeSaveHandler);
    });
    $('#btnSubmit1').click(function () {
        if ($("#ddlDealProduct").val() == 0)
        {
            CommonFunction.MsgAlert('Product Required');
            $('#ddlDealProduct').css('border-color', 'red');
            $('#ddlDealProduct').focus();
            return false;
        }
        var requests = {};
        requests.DefaultClientId = DefaultClientId;
        requests.RecipeDetail = new Array();
        $("#addRecipeTable TBODY tr").each(function () {
            var row = $(this);
            var Recipe = {};
            Recipe.CategoryId = $("#ddlDealCategory").val(); //row.find(".Dl_CategoryId").html();
            Recipe.Name = $('#ddlDealProduct').find('option:selected').text(); //row.find(".Dl_SubCategoryId").html();
            Recipe.ItemId = $("#ddlDealProduct").val();
            Recipe.RawMaterialId = row.find(".RawMaterial").val();
            Recipe.UomId = row.find(".UOM").val();
            Recipe.Qty = row.find(".ItemQTY").val();
            Recipe.CreatedBy = $('#SessionUserId').val();
            requests.RecipeDetail.push(Recipe);
        });
        console.log(JSON.stringify(requests));
        Common.Ajax('POST', url + 'InsertRecipe', JSON.stringify(requests), 'json', AddRecipeSaveHandler);
    });
});
function ItemVeriation_ByITemHandler(response) {
    var html = '';
    $('#ddlDealVarient').html(html);
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option data-ItemRateId=' + item.ItemRateId + ' value=' + item.ItemVeriationId + '>' + item.ItemSize + '</option>';
    });
    $('#ddlDealVarient').html(html);
}
function AddDealSaveHandler(response) {
    CommonFunction.MsgAlert(response);
}
function AddAddonsHandler(response) {
    CommonFunction.MsgAlert(response);
}
function ReadFileHandler(response) {
    console.log(response);
}
function AllItemListHandler(response) {
    console.log(response);
    $('#Product_table > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td>' + item.CategoryDesc + '</td><td>' + item.SubCategiryDesc + '</td><td>' + item.ItemDesc + '</td><td>' + item.ShortDesc + '</td><td>' + item.ItemSize + '</td>' +
            '<td>' + item.Rate + '</td><td>' + item.SortOrder + '</td>' +
            '<td class="text-right"><button class="btn btn-primary ProductListEdit"><i class="fa fa-edit"></i></button><button class="btn btn-danger Delete"><i class="fa fa-trash"></i></button></td>' +
            '<td hidden>' + item.Id + '</td><td hidden>' + item.ItemVeriationId + '</td><td hidden>' + item.RateId + '</td><td hidden>' + item.SubCategoryId + '</td>' +
            '<td hidden>' + item.ImageURL + '</td><td hidden>' + item.CategoryId + '</td><td hidden>' + item.IsActive + '</td></tr>'


    });
    //<img src="~/images/I-Miss-You-Messages-1.jpg" style="width: 50%;" />
    $('#Product_table > tbody').prepend(row);
    Common.Ajax('POST', url + 'GetAllItemVeriation', CientId, 'json', AllItemVeriationHandler);
}
function AllDealItemListHandler(response) {
    var html = '';
    $('#ddlDealSetProduct').html(html);
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option data-SubCategoryId=' + item.SubCategoryId + ' value=' + item.Id + '>' + item.ItemDesc + '</option>';
    });
    $('#ddlDealSetProduct').html(html);
}
function AllSubCategoryListHandler(response) {
    $('#SubCategory_table > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td>' + item.CategoryDesc + '</td><td>' + item.SubCategiryDesc + '</td><td>' + item.ShortDesc + '</td><td>' + item.SortOrder + '</td><td style= "display:none">' + item.Id + '</td>' +
            '<td style = "display:none" >' + item.CategoryId + '</td><td style = "display:none" >' + item.IsActive + '</td></tr>'
        /*'<td class="text-right"><button class="btn btn-primary SubCategoryEdit"><i class="fa fa-edit"></i></button><button class="btn btn-danger Delete"><i class="fa fa-trash"></i></button></td></tr>'*/


    });
    $('#SubCategory_table > tbody').prepend(row);
}
function AddSubCategoryHandler(response) {

    //$('#Alert').show();
    //$('#Alert').html(response.Message);
    CommonFunction.MsgAlert(response.Message);
    /*var RestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';*/
    Common.Ajax('POST', url + 'GetAllSubCategoryList', CientId, 'json', AllSubCategoryListHandler);
}
function ProductHandler(response) {

    //$('#Alert').show();
    //$('#Alert').html(response);
    $('#HFProductItemId').val('');
    $('#HFProductRateId').val('');
    CommonFunction.MsgAlert(response);
    var RestaurantId = '{"ResturantId":"' + $('#SessionResturantId').val() + '"}';
    Common.Ajax('POST', url + 'GetAllItemList', CientId, 'json', AllItemListHandler);
}
function AddCategoryHandler(response) {
    //$("#Alert").show();
    //$('#Alert').html(response.Message);
    CommonFunction.MsgAlert(response);
    $('#Alert').delay(5000).fadeOut('slow');
    if (response != 'Category Already Exists') {
        $('#Categorydesc').val('');
        $('#CategoryShortDesc').val('');
        $('#SortOrderCategory').val('');
        $('#img-upload1').removeAttr('src');

    }
    Common.Ajax('POST', url + 'GetAllCategories', CientId, 'json', CategoryHandler);
}
function CategoryHandler(response) {
    debugger;
    var row = '';
    var html = '';
    $('#Category_table > tbody').html('');
    $('#ddlCategory').html('');
    $('#ddlCategory0').html('');
    $('#ddlCategory_Addon').html('');
    html += "<option value ='0'>Select</option>";
    $('#Category_table > tbody').html('');
    $.each(response, function (i, item) {
        row += '<tr><td style= "display:none">' + item.IsActive + '</td><td style= "display:none">' + item.Id + '</td><td>' + item.CategoryDesc + '</td><td>' + item.ShortDesc + '</td><td>' + item.SortOrder + '</td><td style = "display:none"> ' + item.ImageUrl + '</td>' +
        '<td class="text-right"><button class="btn btn-primary CategoryEdit"><i class="fa fa-edit"></i></button></td></tr>'
        /*'<td class="text-right"><button class="btn btn-primary CategoryEdit"><i class="fa fa-edit"></i></button><button class="btn btn-danger DeleteCategory"><i class="fa fa-trash"></i></button></td></tr>'*/
        html += '<option value=' + item.Id + '>' + item.CategoryDesc + '</option>';

    });
    $('#Category_table > tbody').prepend(row);
    $('#ddlCategory_Addon').html(html);
    $('#ddlCategory_Option1').html(html);
    $('#ddlCategory_Option2').html(html);
    $('#ddlCategory').html(html);
    $('#ddlCategory0').html(html);
    $('#ddlDealCategory').html(html);
}
function SubCategoryHandler(response) {
    var html = '';
    $('#ddlSubCategory').html(html);
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.Id + '>' + item.SubCategiryDesc + '</option>';
    });
    $('#ddlSubCategory').html(html);
    $('#ddlSubCategory').select2().val(SubCategoryId).trigger("change");

}
function SubCategoryAddonHandler(response) {
    var html = '';
    $('#ddlSubCategory').html(html);
    $('#ddlSubCategory_Addon').html(html);
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.Id + '>' + item.SubCategiryDesc + '</option>';
    });
    $('#ddlSubCategory_Addon').html(html);

    BindAddonItems();
}
function CategoryOptions1Handler(response) {
    var CategoryId = $('#ddlCategory_Option1').val();
    var SubCategoryID = '';
    var request = {};
    request.CategoryId = CategoryId;
    request.SubCategoryID = SubCategoryID;
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetITemByCategrory', JSON.stringify(request), 'json', bindItemOptionsHandler);
}
function bindItemOptionsHandler(response) {
    $('#tableItemOption1 > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.CategoryId + '</td><td hidden>' + item.SubCategoryID + '</td><td hidden>' + item.ItemId + '</td><td><input type="checkbox"></td><td>' + item.ItemDesc + '</td></tr>'

    });
    $('#tableItemOption1 > tbody').prepend(row);
}
function bindItemOptions2Handler(response) {
    $('#tableItemOption2 > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.CategoryId + '</td><td hidden>' + item.SubCategoryID + '</td><td hidden>' + item.ItemId + '</td><td><input type="checkbox"></td><td>' + item.ItemDesc + '</td></tr>'

    });
    $('#tableItemOption2 > tbody').prepend(row);
}
function bindDealITemHandler(response) {

    var row = ''
    row += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        row += '<option value=' + item.ItemId + '>' + item.ItemDesc + '</option>';
    });
    $('#ddlDealProduct').html(row);
}
function bindUOMHandler(response) {

    var row = '';
    var container = document.getElementById("textBoxContainer");
    var index = container.children.length;
    row += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        row += '<option value=' + item.Id + '>' + item.UnitType + '</option>';
    });
    //$('#ddlUOM' + index).html(row);
    $('#ddlUOM1').html(row);

}
function bindRawMaterialHandler(response) {
    var container = document.getElementById("textBoxContainer");
    var index = container.children.length;
    var row = ''
    row += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        row += '<option value=' + item.Id + '>' + item.MaterialDesc + '</option>';
    });
    //$('#ddlRawMaterial' + index).html(row);
    $('#ddlRawMaterial1').html(row);
}
function BindAddonItems() {
    var CategoryId = $('#ddlCategory_Addon').val();
    var SubCategoryID = $('#ddlSubCategory_Addon').val();
    var request = {};
    request.CategoryId = CategoryId;
    request.SubCategoryID = SubCategoryID;
    request.DefaultClientId = DefaultClientId;
    Common.Ajax('POST', url + 'GetITemByCategrory', JSON.stringify(request), 'json', bindItemAddonHandler);
}

function bindItemAddonHandler(response) {

    //tableAddons
    $('#tableItemAddons > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.CategoryId + '</td><td hidden>' + item.SubCategoryID + '</td><td hidden>' + item.ItemId + '</td><td><input type="checkbox"></td><td>' + item.ItemDesc + '</td></tr>'

    });
    $('#tableItemAddons > tbody').prepend(row);
    $('#tableItemAddons tbody tr:has(td)').find('input[type="checkbox"]').click(function () {
        var isChecked = $(this).prop("checked");

        $('#tableItemAddons tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#chktableItemAddons").prop('checked', isChecked);

    });
}
function AllOptions1Handler(response) {
    $('#tableOption1 > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.Id + '</td><td><input type="checkbox"></td><td>' + item.Option1Desc + '</td><td>' + item.Rate + '</td></tr>'

    });
    $('#tableOption1 > tbody').prepend(row);
}
function AllOptions2Handler(response) {
    $('#tableOption2 > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.Id + '</td><td><input type="checkbox"></td><td>' + item.Option1Desc + '</td><td>' + item.Rate + '</td></tr>'

    });
    $('#tableOption2 > tbody').prepend(row);
}
function AllAddonsHandler(response) {
    $('#tableAddons > tbody').html('');
    var row = ''
    $.each(response, function (i, item) {
        row += '<tr><td hidden>' + item.Id + '</td><td><input type="checkbox"></td><td>' + item.AddonsDesc + '</td><td>' + item.Rate + '</td></tr>'

    });
    $('#tableAddons > tbody').prepend(row);
    $('#tableAddons tbody tr:has(td)').find('input[type="checkbox"]').click(function () {
        var isChecked = $(this).prop("checked");

        $('#tableAddons tr:has(td)').find('input[type="checkbox"]').each(function () {
            if ($(this).prop("checked") == false)
                isChecked = false;
        });
        $("#ChktableAddons").prop('checked', isChecked);

    });
}
function AllItemVeriationHandler(response) {
    var html = '';
    html += "<option value =''>Select</option>";
    $.each(response, function (i, item) {
        html += '<option value=' + item.Id + '>' + item.ItemSize + '</option>';
    });
    $('#ddlItemVariation').html(html);
}
function ClearProduct() {
    $('#ddlCategory').select2().val(0).trigger("change");
    $('#ddlSubCategory').select2().val(0).trigger("change");
    $('#txtItemDesc').val('');
    $('#txtProductShortCode').val('');
    $('#ddlItemVariation').select2().val(0).trigger("change");
    $('#txtRate').val('');
    $('#ProductSortOrder').val('');
    $('#chkIsActiveProduct').prop('checked', false);
    $('#img-upload').attr('src', '');
    $('#txtProductImageinput').val('');
    $('#Alert').hide();
}

function addTextBox() {

    var container = document.getElementById("textBoxContainer");
    var index = container.children.length + 1;

    var div = document.createElement("tr");

    //var td = document.createElement("td");
    //div.appendChild(td);
    //var checkbox = document.createElement("input");
    //checkbox.type = "checkbox";
    //checkbox.name = "checkbox" + index;
    //checkbox.className = "form-control";
    //td.appendChild(checkbox);

    var td = document.createElement("td");
    div.appendChild(td);
    var label = document.createElement("label");
    label.innerHTML = index;
    label.name = "label" + index;
    //label.className = "form-control";
    td.appendChild(label);

    var td = document.createElement("td");
    div.appendChild(td);
    var dropdown = document.createElement("select");
    dropdown.name = "dropdown" + index;
    dropdown.id = "ddlRawMaterial" + index;
    dropdown.className = "form-control RawMaterial";
    /*var option1 = document.createElement("option");
    option1.value = "Value1";
    option1.text = "Option 1";
    dropdown.appendChild(option1);
    var option2 = document.createElement("option");
    option2.value = "Value2";
    option2.text = "Option 2";
    dropdown.appendChild(option2);*/
    td.appendChild(dropdown);

    var td = document.createElement("td");
    div.appendChild(td);
    var textBox = document.createElement("input");
    textBox.type = "text";
    textBox.name = "text" + index;
    textBox.className = "form-control ItemQTY";
    td.appendChild(textBox);

    var td = document.createElement("td");
    div.appendChild(td);
    var dropdown = document.createElement("select");
    dropdown.name = "dropdown" + index;
    dropdown.id = "ddlUOM" + index;
    dropdown.className = "form-control UOM";
    td.appendChild(dropdown);

    var td = document.createElement("td");
    div.appendChild(td);
    var removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerHTML = "Remove";
    removeButton.className = "btn-info m-l-r";
    removeButton.onclick = function () { removeTextBox(this); };
    td.appendChild(removeButton);

    container.appendChild(div);

    Common.Ajax('POST', url + 'GetRawMaterial', CientId, 'json', bindRawMaterialHandler);
    Common.Ajax('GET', url + 'GetUOM?ClientId=' + DefaultClientId, DefaultClientId, 'json', bindUOMHandler);
}

function removeTextBox(button) {
    var div = button.parentNode.parentNode;
    div.parentNode.removeChild(div);
}

function AddRecipeSaveHandler(response) {
    CommonFunction.MsgAlert(response);
}
