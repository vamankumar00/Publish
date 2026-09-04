
/*
COMMON METHODS
*/

var CommoN = {
    dateFormat: "dd/MM/yyyy",
    decimalPlaces: 2,               // Need to remove the hard code
    timeFormat: "HH:mm",
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    timeZone: "",
    momentTimeZone: "",
    countryCode: null,
    lengthUnit: null,
    currencySymbol: localStorage.getItem('currencySymbol') || "£",
    dailingCode: localStorage.getItem('dailingCode') || "+92",
    popupNotification : null,
    popupNotificationBottom: null,
    bounds: { southwest: { lat: null, lng: null }, northeast: { lat: null, lng: null } },
    tr: null,
    utcOffset: 0, 
    isDST: 0,
    culture: localStorage.getItem('culture') || "en-GB",    
    baseLat: parseFloat(localStorage.getItem('baseLat')) || 51.509865,
    baseLng: parseFloat(localStorage.getItem('baseLng')) || -0.118092,
    userId: null,
    locationApi: null,
    IsVehicleNoToBeShow: "false",
    IsDriverNoToBeShow: "true",

    getFormattedNumber: function(number) {
        return number.toFixed(this.decimalPlaces);
    },

    isStringNull: function (stringVal) {
        return (stringVal?stringVal:"");
    },

    isNumber: function (number) {
        try {
            return (number.length == 0 ? 0 : isNaN(number) == false ? parseFloat(number) : 0);
        } catch (ee) {
            return 0;
        }
    },

    checkIsNull: function (_value) {
        try {
            _value = _value.toString();
            _value = _value.trim();
            return ((_value == null || typeof _value == 'undefined' || _value == 'null' || _value.length == 0) ? true : false);
        } catch (e) {
            return true;
        }
    },

    checkIsNullOrEmpty: function (_value) {
        try {
            _value = _value.toString();
            _value = _value.trim();
            return ((_value == null || typeof _value == 'undefined' || _value == 'null' || _value.length == 0 || _value == "" || _value === "0" || _value == null) ? true : false);
        } catch (e) {
            return true;
        }
    },

    checkIsNullAndReplace: function (_value, _replace) {
        return !Common.CheckIsNull(_value) ? _value : _replace;
    },

    checkElementExist: function (obj) {
        return obj.length == 0 ? false : true;
    },

    getRandomColor: function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    hexToRgb: function (hexCode) {
        var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
        var matches = patt.exec(hexCode);
        var rgb = "rgb(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + ")";
        return rgb;
    },

    hexToRgba: function (hexCode, opacity) {
        var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
        var matches = patt.exec(hexCode);
        var rgb = "rgba(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + "," + opacity + ")";
        return rgb;
    },

    IntToColor: function (num) {
        num >>>= 0;
        var b = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            r = (num & 0xFF0000) >>> 16,
            a = ((num & 0xFF000000) >>> 24) / 255;
        return "rgba(" + [r, g, b, a].join(",") + ")";
    },

    //Start Cilent Side Cookies Sections

    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    //End Cilent Side Cookies Sections

    getNextChar: function (chr) {
        return String.fromCharCode(chr.charCodeAt(0) + 1);
    },

    openInNewTab: function (url) {
        var a = document.createElement("a");
        a.target = "_blank";
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    openInBrowserModel: function (url, width, height, customName) {
        var width = width === undefined ? screen.width - 100 : parseFloat(width);
        var height = height === undefined ? screen.height - 200 : parseFloat(height);
        var left = (screen.width - parseFloat(width)) / 2;
        var bootom = (screen.height - parseFloat(height)) / 2;
        var top = (screen.height - parseFloat(height)) / 2;
        var params = 'width=' + width + ', height=' + height;
        params += ', bootom=' + bootom + ',bootom=' + top + ', left=' + left;
        params += ', directories=no';
        params += ', location=no';
        params += ', menubar=no';
        params += ', resizable=no';
        params += ', scrollbars=no';
        params += ', status=no';
        params += ', toolbar=no';
        //params += ',fullscreen=yes,channelmode=yes';

        if (!Common.checkIsNullOrEmpty(__CHILD_WINDOW_HANDLERS) && __CHILD_WINDOW_HANDLERS.length > 0) {
            for (var i = 0; i < __CHILD_WINDOW_HANDLERS.length; i++) {
                var popup = __CHILD_WINDOW_HANDLERS[i];
                if (popup && !popup.closed && !Common.checkIsNullOrEmpty(popup.CustomName) && popup.CustomName == customName) {
                    return;
                }
            }
        }
        
        var newwin = window.open(url, "_blank", params);

        if (window.focus) { newwin.focus() }

        if (!Common.checkIsNullOrEmpty(customName)) {
            newwin.CustomName = customName;
        }
        if (customName !== "fullScreenMap")
        {
            __CHILD_WINDOW_HANDLERS.push(newwin);
        }

        //window.open(url, "_blank", "fullscreen=yes,channelmode=yes");
    },

    BrowserModelSendMessageToParent: function (message) {
        // This will post a message to the parent
        window.opener.postMessage(message, "*");
    },

    randomNumber: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },

    returnDateTimeFromJSON: function (inputDate) {
        if (!Common.checkIsNull(inputDate)) {
            var value = Common.dateParser(inputDate);
            var formattedDate = value.getDate() + "/" + (value.getMonth() + 1) + "/" + value.getFullYear() + " " + value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds();
            return formattedDate;
        }
        else {
            return "";
        }
    },

    returnDateFromJSON: function (inputDate) {
        if (!Common.checkIsNull(inputDate)) {
            var value = Common.dateParser(inputDate);
            var formattedDate = value.getDate() + "/" + (value.getMonth() + 1) + "/" + value.getFullYear();
            return formattedDate;
        }
        return "";
    },

    returnTimeFromJSON: function (inputDate) {
        if (!Common.checkIsNull(inputDate)) {

            var value = Common.dateParser(inputDate);
            var formattedDate = value.getHours() + ":" + value.getMinutes();
            return formattedDate;
        }
        return "";
    },

    dateParser: function (value) {

        //var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        var reISO = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?([zZ]|([\+-])([01]\d|2[0-3])\D?([0-5]\d)?)?)?$/;
        var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

        if (typeof value === 'string') {
            var a = reISO.exec(value);
            if (a)
                return new Date(value);
            a = reMsAjax.exec(value);
            if (a) {
                var b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    },

    GetResultByExpress: function (arr, express) {
        return arr.filter(express);
    },   

    closeSecTab: function (clickevent) {
        var index = $(clickevent).attr("id").split('_')[1];
        //var index = $("#MainlstTab li a.active").attr("id").split("_")[1];
        var $iFrame = $("#iFrameTab_" + index);
        $iFrame.remove();
        $("#dashboardSec_" + index).remove();
        var $tab = $("#tabMenuSec_" + index).parent().remove();
        $tab.remove();
        setTimeout(function () {
            $("#tabMenuOne").trigger("click");
        }, 100)
    },

    ResetTab: function (url, title) {
        var title = title;
        var index = $("#MainlstTab li a.active", window.parent.document).attr("id").split("_")[1];
        var $span = $("<span id='closeTabMenuSec_" + index + "' class='closeTabMenuSec' > x </span>")
        $("#tabMenuSec_" + index, window.parent.document).html(title);
        $("#tabMenuSec_" + index, window.parent.document).append($span);
        $("#tabMenuSec_" + index, window.parent.document).attr("data-toggle", "tab")
        $("#tabMenuSec_" + index, window.parent.document).attr("data-title", title);
        var $iFrame = $("#iFrameTab_" + index, window.parent.document);
        $iFrame.attr("src", url);
        $("#tabMenuOne", window.parent.document).removeClass("active");
        $("#tabMenuSec_" + index, window.parent.document).removeClass("active").addClass("active");
        $("#dashboardOne", window.parent.document).removeClass("active");
        $("#dashboardSec_" + index, window.parent.document).removeClass("active").addClass("active");
        $("#sidenavToggler", window.parent.document).click();
        
    },

    createNewTab: function (tabcount, title, urll, FromTab = false) {
        if (FromTab === true)
        {
            var $span = $("<span id='closeTabMenuSec_" + tabcount + "' class='closeTabMenuSec'> x </span>")
            var $Tab = $("<li class='nav-item'>\
                <a class='nav-link' id='tabMenuSec_"+ tabcount + "' data-title='" + title + "' data-toggle='tab' data-target='#dashboardSec_" + tabcount + "' role='tab' aria-controls='profile' aria-selected='false' style='display:none'></a>\
                </li>");
            $("#MainlstTab", window.parent.document).append($Tab);
            $("#tabMenuSec_" + tabcount, window.parent.document).show();
            $("#tabMenuSec_" + tabcount, window.parent.document).html(title);
            $("#tabMenuSec_" + tabcount, window.parent.document).append($span);
            $("#tabMenuSec_" + tabcount, window.parent.document).attr("data-toggle", "tab")

            var url = urll;

            $("#myTabContent", window.parent.document).append('<div class="tab-pane fade" id="dashboardSec_' + tabcount + '" role="tabpanel" aria-labelledby="profile-tab">\
        <div class="tab-page">\
        <iframe id="iFrameTab_'+ tabcount + '" style="height: 88vh; border: none; width: 99.5%; overflow: hidden; display: block; margin: 0 auto;"></iframe>\
        </div></div>');

            var $iFrame = $("#iFrameTab_" + tabcount, window.parent.document);
            $iFrame.css("height", "88vh");
            $iFrame.attr("src", url);
            $("#tabMenuOne").removeClass("active");
            for (var i = 0; i < tabcount; i++) {
                $("#tabMenuSec_" + i, window.parent.document).removeClass("active");
                $("#dashboardSec_" + i, window.parent.document).removeClass("active");
            }
            $("#tabMenuSec_" + tabcount, window.parent.document).removeClass("active").addClass("active");
            $("#dashboardOne", window.parent.document).removeClass("active").removeClass("show");
            $("#dashboardSec_" + tabcount, window.parent.document).removeClass("active").removeClass("show").addClass("active").addClass("show");
            $("#sidenavToggler", window.parent.document).click();
            $("#closeTabMenuSec_" + tabcount, window.parent.document).click(function () {
                var index = $(this).attr("id").split('_')[1];
                var $iFrame = $("#iFrameTab_" + index, window.parent.document);
                $iFrame.remove();
                var currentTabActive = $("#tabMenuSec_" + index, window.parent.document).hasClass("active");
                var $tab = $("#tabMenuSec_" + index, window.parent.document).parent().remove();
                $tab.remove();
                var $dashboardsec = $("#dashboardSec_" + index, window.parent.document).remove();
                $dashboardsec.remove();
                var tabcount = $("#MainlstTab li", window.parent.document).length - 1;
                if (tabcount > 0 && index > 0) {
                    index = (index - 1);
                    if (currentTabActive === true) {
                        if ($("#dashboardSec_" + index, window.parent.document).length) {
                            setTimeout(function () {
                                window.parent.closeClickTab(index);
                            }, 100)
                        }
                        else {
                            index = 0;
                            setTimeout(function () {
                                window.parent.closeClickTab(index);
                               // $("#tabMenuOne", window.parent.document).trigger("click");
                            }, 100)
                        }
                    } else {
                        index = 0;
                        setTimeout(function () {
                            window.parent.closeClickTab(index);
                            //$("#tabMenuOne", window.parent.document).trigger("click");
                        }, 100)
                    }
                }
                else {
                    index = 0;
                    setTimeout(function () {
                        window.parent.closeClickTab(index);
                       // $("#tabMenuOne", window.parent.document).trigger("click");
                    }, 100)
                }
                return false;
            });
        }
        else {
            
            var $span = $("<span id='closeTabMenuSec_" + tabcount + "' class='closeTabMenuSec'> x </span>")
            var $Tab = $("<li class='nav-item'>\
                <a class='nav-link' id='tabMenuSec_"+ tabcount + "' data-title='" + title + "' data-toggle='tab' data-target='#dashboardSec_" + tabcount + "' role='tab' aria-controls='profile' aria-selected='false' style='display:none'></a>\
                </li>");
            $("#MainlstTab").append($Tab);
            $("#tabMenuSec_" + tabcount).show();
            $("#tabMenuSec_" + tabcount).html(title);
            $("#tabMenuSec_" + tabcount).append($span);
            $("#tabMenuSec_" + tabcount).attr("data-toggle", "tab")

            var url = urll;

            $("#myTabContent").append('<div class="tab-pane fade" id="dashboardSec_' + tabcount + '" role="tabpanel" aria-labelledby="profile-tab">\
        <div class="tab-page">\
        <iframe id="iFrameTab_'+ tabcount + '" style="height: 88vh; border: none; width: 99.5%; overflow: hidden; display: block; margin: 0 auto;"></iframe>\
        </div></div>');

            var $iFrame = $("#iFrameTab_" + tabcount);
            $iFrame.css("height", "88vh");
            $iFrame.attr("src", url);
            $("#tabMenuOne").removeClass("active");
            for (var i = 0; i < tabcount; i++) {
                $("#tabMenuSec_" + i).removeClass("active");
                $("#dashboardSec_" + i).removeClass("active");
            }
            $("#tabMenuSec_" + tabcount).removeClass("active").addClass("active");
            $("#dashboardOne").removeClass("active").removeClass("show");
            $("#dashboardSec_" + tabcount).removeClass("active").removeClass("show").addClass("active").addClass("show");
            $("#sidenavToggler").click();
            $("#closeTabMenuSec_" + tabcount).click(function () {
                var index = $(this).attr("id").split('_')[1];
                var $iFrame = $("#iFrameTab_" + index);
                $iFrame.remove();
                var currentTabActive = $("#tabMenuSec_" + index).hasClass("active");
                var $tab = $("#tabMenuSec_" + index).parent().remove();
                $tab.remove();
                var $dashboardsec = $("#dashboardSec_" + index).remove();
                $dashboardsec.remove();
                var tabcount = $("#MainlstTab li").length - 1;
                if (tabcount > 0 && index > 0) {
                    index = (index - 1);
                    if (currentTabActive === true) {
                        if ($("#dashboardSec_" + index).length) {
                            setTimeout(function () {
                                $("#tabMenuSec_" + index).trigger("click");
                            }, 100)
                        }
                        else {
                            setTimeout(function () {
                                $("#tabMenuOne").trigger("click");
                            }, 100)
                        }
                    } else {
                        setTimeout(function () {
                            $("#tabMenuOne").trigger("click");
                        }, 100)
                    }
                }
                else {
                    setTimeout(function () {
                        $("#tabMenuOne").trigger("click");
                    }, 100)
                }
                return false;
            });
        }
    },       

    formValidation: function (formId) {
        var counter = 0;
        $('.Validation').remove();
        $('#' + formId + ' .clsRequired').each(function () {
            if (this.tagName == "INPUT") {
                if (this.type == "text") {
                    if ($(this).is(':visible')) {
                        if ($(this).val() == '') {
                            $(this).addClass("required");
                            $(this).css("border-color", "red");
                            // $("<div class='Validation Validation-message none'>field is Required !</div>").insertAfter($(this));
                            counter += 1;
                        } else {
                            $(this).removeClass("required");
                            $(this).css("border-color", "rgba(0,0,0,.15)");
                        }
                    }
                }
            } else if (this.tagName == "SELECT") {
                if ($(this).is(':visible')) {

                    var value = $(this).val();

                    if (value == "0" || value == "-1" || value == "") {

                        $(this).addClass("required");
                        $(this).css("border-color", "red");
                        // $("<div class='Validation Validation-message none'>field is Required !</div>").insertAfter($(this));
                        counter += 1;
                    } else { $(this).removeClass("required"); }
                }

            }
            // Below Condition only for AddFare DrowpDownList
            else if (this.tagName == "SPAN") {
                if ($(this).is(':visible')) {
                    if ($($(this).find('input')[1]).attr("data-role") == "combobox" || $($(this).find('input')[1]).attr("data-role") == undefined) {
                        var value = $($(this).find('input')[1]).val();
                        if (value == undefined) {
                            value = $($(this).find('input')[0]).val();
                            if (value == "") {
                                $(this).addClass("required");
                                $(this).css("border", "1px solid red");
                                counter += 1;
                            } else { $(this).removeClass("required"); }
                        }
                    }
                }
            }
            else if (this.tagName == "TEXTAREA") {
                if ($(this).is(':visible')) {
                    if ($(this).val() == '') {
                        $(this).addClass("required");
                        $(this).css("border-color", "red");
                        counter += 1;
                    } else {
                        $(this).removeClass("required");
                        $(this).css("border-color", "rgba(0,0,0,.15)");
                    }
                }
            }
        });
        //$('.Validation').show('slide', { direction: 'left' }, 1000);
        //setTimeout(function () {
        //    $('.Validation').hide('slide', { direction: 'left' }, 2000, function () {
        //        $('.Validation').remove();
        //        $('.ui-effects-wrapper').remove();
        //    });
        //}, 2000);
        if (counter > 0) {

            return false;
        }
        else {
            return true;
        }
    },  

    BootStrapModel: function (title, url, size) {

        var modalName = "";
        var modalContentName = "";
        var $content;

        switch (size) {
            case "small":
                modalName = "#myModal_Delete";
                modalContentName = "#myModalContent_Delete";
                break;

            case "large":
                modalName = "#myModal_xl";
                modalContentName = "#myModalContent_xl";
                break;

            default:
        }

        var $content = $(modalContentName);
        $content.find("")
        $content.load(url, function (response, status, xhr) {
            if (status == "success") {
                $(modalName).modal('dispose').modal({
                    keyboard: true,
                    show: true,
                    focus: true,
                    backdrop: true
                });
                $("#loading").hide();
                $(modalName).find(".modal-content").prepend("<div class='modal-header modal-header-success'>" +
                    "<h4 class='modal-title w-100 text-center'> " + title + "</h4>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
                    "</div>");
            }
            $(modalName).on('hidden.bs.modal', function (e) {
                $(modalName).modal("dispose");
            })

        });

    },    

    toggleAttribute: function ($ctrl, attrName, attrValue) {
        if ($ctrl.attr(attrName)) {
            $ctrl.removeAttr(attrName);
        } else {
            $ctrl.attr(attrName, attrValue);
        }
    },

    InsertZeroBefore: function (str) {
        str = str.toString();
        var number = Number(str);
        return (str < 10 ? '0' : '') + str;
    },

    GetBrowser: function () {
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;

        if (isOpera) { return "Opera"; }
        else if (isFirefox) { return "Firefox"; }
        else if (isSafari) { return "Safari"; }
        else if (isIE) { return "IE"; }
        else if (isEdge) { return "Edge"; }
        else if (isChrome) { return "Chrome"; }
        else if (isBlink) { return "Blink"; }
    },

    CloneObject: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    hasAttr: function (obj) {
        if (typeof obj !== typeof undefined && obj !== false) {
            return true;
        }
        return false;
    },

    ToJavaScriptDateTime: function (value) {
        var a = moment($(value).val(), 'DD/MM/YYYY HH:mm');
        var dddFormat = 'ddd ' + this.dateFormat.toUpperCase();
        if (this.dotTimeFormat === "true") {
            return a.format(this.dateFormat.toUpperCase() + " HH.mm");
        }
        else { 
            return a.format(dddFormat);
        }
        
        //var day = ((a.date()) < 10 ? ("0" + (a.date())) : a.date());
        //var month = ((a.month()) < 10 ? ("0" + (a.month())) : a.month())
        //var year = a.years().toString().substring(2);
        //var Hour = ((a.hours()) < 10 ? ("0" + a.hours()) : a.hours());
        //var Minute = ((a.minutes()) < 10 ? ("0" + a.minutes()) : a.minutes());
        //return day + "/" + ((parseInt(month) + 1) < 10 ? ("0" + (parseInt(month) + 1)) : (parseInt(month) + 1)) + "/" + year + " " + Hour + ":" + Minute;
    },

    NextChar: function (c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    },

    ReplaceChar: function(origString, replaceChar, index) {
        let firstPart = origString.substr(0, index);
        let lastPart = origString.substr(index + 1);

        let newString = firstPart + replaceChar + lastPart;
        return newString;
    },

    GetAudioButton: function (CallRefNo) {    
        if (CallRefNo != null && CallRefNo != "" && CallRefNo != undefined)
            return '<button class="btn btn-sm btnAudio_PreBooking clsdblIgrore"><i class="fa fa-play-circle" aria-hidden="true" title="Call Booking" style="font-size:21px;margin-left:2px;"></i></button>';
        else
            return '';
    },

    PlayOrderAudio: function(orderId, orderNo) {

        $('#bodyOrderAudio').html("");
        $('#headingAudio').text(tr.Get('OrderAudioBracket') + orderNo + " )")
        $('#modalOrderAudio').modal('show');

        var xhr = $.ajax({
            type: "GET",
            url: _BASEURL + "/CallNotifications/PlayCallRecording",
            data: { "orderId": orderId }
        });

        xhr.done(function (resp) {
            if (resp && resp.url) {
                //audioModal.data("kendoWindow").content('<audio controls src="' + resp.url + '" type="audio/wav" controlsList="nodownload" />');
                // resp.url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

                var html = '<audio controls controlsList="nodownload">';
                html += '<source src="' + resp.url + '" type="audio/wav" />';
                html += '<source src="' + resp.url + '" type="audio/mpeg" />';
                html += '<source src="' + resp.url + '" type="audio/ogg" />';
                html += 'Audio format not supported';
                html += '</audio>';
                html += '<br /> <strong style="float:right;"><a href="' + resp.url + '" download>Download</a></strong>';

                $('#bodyOrderAudio').append(html);
            }
        });
    },

    User:
    {
        roles: [],
        hasRole: function (roleSearch) {
            var index = -1;
            index = $.inArray(roleSearch, this.roles);
            if (index < 0)
                return false;
            else
                return true;
        }
    }, 

    isEmailAddress: function (email) {
        var filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        return filter.test(email);
    },

    CapitalizeFirstLetter: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

    GetDBDate: function(controlId)
        {
            //console.log('before ', $(controlId).attr('id'), ' = ' , $(controlId).val());
            // return if control or it's value doesn't exist
            if(!$(controlId).length || !$(controlId).val()) return;

            var d = moment($(controlId).val(), this.dateFormat.toUpperCase() + ' ' + this.timeFormat).format('YYYY-MM-DD HH:mm');
            //console.log('after ', $(controlId).attr('id'), ' = ' ,d);
            return d;
    },     

    GetFormattedNum: function (num) {
        if (num==null) return "";
        return (Globalize.format(num, "n2"));
    },

    GetDate: function () {
        var serverDate = moment.tz(Common.timeZone);
        var dt = serverDate.format(Common.dateFormat.toUpperCase());
        return dt;
    },

    GetTime: function () {
        var serverDate = moment.tz(Common.timeZone);
        var time = serverDate.format(Common.timeFormat);
        return time;
    },

    GetDateTime: function () {
        var serverDate = moment.tz(Common.timeZone);
        var dt = serverDate.format(Common.dateFormat.toUpperCase() + ' ' + Common.timeFormat);
        return dt;
    },

    LoadPartialView: function (url, divId, data) {        
        $.ajax({
            url: url,
            contentType: 'application/html; charset=utf-8',
            type: 'GET',
            dataType: 'html',
            data: data,
            success: function (result) {                                          
                $('#' + divId).html(result);
            }
        })
    },

    GetAudioButton: function (CallRefNo) {
        if (CallRefNo != null && CallRefNo != "" && CallRefNo != undefined)
            return '<button class="btn btn-sm btnAudio_PreBooking clsdblIgrore"><i class="fa fa-play-circle" aria-hidden="true" title="Call Booking" style="font-size:21px;margin-left:2px;"></i></button>';
        else
            return '';
    },

    SetExtensionOnDashboard: function () {
        var extension = localStorage.getItem('UserExtension');        
        if (extension!=null)
            $('#paraExtension').append('<i class="fa fa-address-book" aria-hidden="true"></i> ' + extension);
    },
    SearchAddress: function (request, response) {
        //debugger;
        if (Common.locationApi == 'google') {
            //console.log('request: ', request);
            //console.log('response: ', response);
        
            var searchTerm = request.term;

            if (!searchTerm || searchTerm == '') {
                return [];
            }
            else {

                var xhr = $.ajax({
                    type: "GET",
                    url: _BASEURL + "/Base/Search",
                    data: { 'search': searchTerm }
                });
                xhr.done(function (resp) {

                    if (resp && resp.data && resp.data.length > 0) {
                        ///console.log('resp: ', resp);
                        response($.map(resp.data, function (item) {
                            //debugger;
                            return { label: item.description, Value: item.Latitude + ',' + item.Longitude, place_id: '', prediction: '' };
                        }));
                    }
                    else {
                        const displaySuggestions = function (predictions, status) {
                            if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
                                // console.log(status);
                                return;
                            }
                           // console.log('predictions: ', predictions);
                            //  console.log('predictions[0].getDetails(): ', predictions[0]);
                            //options.success(predictions);
                            response($.map(predictions, function (item) {
                                return { label: item.description, Value: item.Latitude + ',' + item.Longitude, place_id: item.place_id, prediction: item };
                            }));
                        };

                        var locationBounds = new google.maps.LatLngBounds(
                            { lat: Common.bounds.southwest.lat, lng: Common.bounds.southwest.lng },
                            { lat: Common.bounds.northeast.lat, lng: Common.bounds.northeast.lng }
                        );

                        const service = new google.maps.places.AutocompleteService();
                        var placeRequest = {
                            input: searchTerm,
                            bounds: locationBounds,
                            types: ['geocode', 'establishment'],
                            componentRestrictions: { country: Common.countryCode }
                        };
                        service.getPlacePredictions(placeRequest, displaySuggestions);
                    }

                }); // xhr.done
            } // else
        }
        else { // search from PAFDB
            $.ajax({
                //url: "@BaseUrl/Orders/GetShippingAddress",
                url: _BASEURL + "/Base/GetAddresses",
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    //nconsole.log('GetAddresses: ', data);
                    response($.map(data, function (item) {
                        //debugger;
                        return { label: item.AddressLine1, Value: item.Latitude + ',' + item.Longitude };
                    }));
                }
            });
        }
    },

    OnSearchSelect: function (id, i) {
        if (Common.locationApi == 'google') {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'placeId': i.item.place_id },
                function (responses, status) {
                    if (status == 'OK') {
                        lat = responses[0].geometry.location.lat();
                        lng = responses[0].geometry.location.lng();
                        // console.log(lat, lng);
                        $("#" + id).val(lat + ',' + lng);

                        var payload = {
                            'LocationName': i.item.prediction.structured_formatting.main_text,
                            'Address': i.item.prediction.description,
                            'Lat': lat,
                            'Lng': lng,
                            'LocationTypeId': 7
                        };
                        //console.log('Save Address Payload: ', payload);
                        SaveAddress(payload);
                    } // (status == 'OK')
                }); // end function(responses, status)
        }
    },

    //GetClientDate: function (pDate) {
    //    debugger;
    //    // var d = moment(pDate); alert(d.format("DD/MM/YYYY"));        
    //    //var clientDate = moment(pDate);
    //    //var dt = clientDate.tz(Common.timeZone);
    //    //alert(dt);
    //    //var dt2 = dt.format(Common.dateFormat.toUpperCase());
    //    //alert(dt2);
    //    //return dt2;
    //    var dt = moment(pDate).tz(Common.timeZone).format(Common.dateFormat.toUpperCase());
    //    return dt;
    //}, 

    getDate: function () {       
        var serverDate = moment.tz(Common.timeZone);
        var dt = serverDate.format('MMM D, YYYY HH:mm');
        $('.datetime-panel').empty().append('<p><i class="fas fa-calendar-alt fa-fw"></i>' + dt + '</p>');  
    },


    getGridColors: function (elementName, value, color = "", backgroundcolor = "") {
        switch (elementName) {
            case "LocationType":
                return value == "1" ? Common.IntToColor("-6291648") : "transparent";

            case "Account":
                //console.log(value);
                return !Common.checkIsNullOrEmpty(value) ? "#c52906" : "transparent";

            case "BookingStatus":
                return Common.IntToColor(value) != 0 ? Common.IntToColor(value) : "";

            case "Panic":
                return value == "Panic" ? "class =\ flashRed" : "style =background-color:white;class=''";

            case "PDA":
                return value == true ? "<i class=\"fa fa-mobile\" style=\"font-size:large\"></i>" : "";

            case "WorkStatus":
                if (value == 3) {
                    if (color == "") color = "orange";
                    return "style=color:" + color + ";background-color:white";
                }
                else if (value == 1) {
                    if (color == "") color = "#adefad";
                    return "style=color:" + color + ";background-color:white";
                }
                else if (value == 7) {
                    if (color == "") color = "black";
                    return "style=color:" + color + ";background-color:white";
                }

            case "WorkStatusStr":
                if (value == "OnBreak") {
                    if (color == "") color = "orange";
                    if (backgroundcolor == "") backgroundcolor = "white";
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "Available") {
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "SIN BIN") {
                    if (color == "") color = "black";
                    if (backgroundcolor == "") backgroundcolor = "white";
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "On Route") {
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "Arrived") {
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "Passenger On Board") {
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }
                else if (value == "Soon To Clear") {
                    return "style=color:" + color + ";background-color:" + backgroundcolor;
                }

            default:
                return "";
        }
    },

    SearchAddress: function (request, response) {
        if (Common.locationApi == 'google') {
            //console.log('request: ', request);
            //console.log('response: ', response);

            var searchTerm = request.term;

            if (!searchTerm || searchTerm == '') {
                return [];
            }
            else {

                var xhr = $.ajax({
                    type: "GET",
                    url: _BASEURL + "/Base/Search",
                    data: { 'search': searchTerm }
                });
                xhr.done(function (resp) {

                    if (resp && resp.data && resp.data.length > 0) {
                        //console.log('resp: ', resp);
                        response($.map(resp.data, function (item) {
                            return { label: item.description, Value: item.Latitude + ',' + item.Longitude, place_id: '', prediction: '' };
                        }));
                    }
                    else {
                        const displaySuggestions = function (predictions, status) {
                            if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
                                // console.log(status);
                                return;
                            }
                            //console.log('predictions: ', predictions);
                            //  console.log('predictions[0].getDetails(): ', predictions[0]);
                            //options.success(predictions);
                            response($.map(predictions, function (item) {
                                return { label: item.description, Value: item.Latitude + ',' + item.Longitude, place_id: item.place_id, prediction: item };
                            }));
                        };

                        var locationBounds = new google.maps.LatLngBounds(
                            { lat: Common.bounds.southwest.lat, lng: Common.bounds.southwest.lng },
                            { lat: Common.bounds.northeast.lat, lng: Common.bounds.northeast.lng }
                        );

                        const service = new google.maps.places.AutocompleteService();
                        var placeRequest = {
                            input: searchTerm,
                            bounds: locationBounds,
                            types: ['geocode', 'establishment'],
                            componentRestrictions: { country: Common.countryCode }
                        };
                        service.getPlacePredictions(placeRequest, displaySuggestions);
                    }

                }); // xhr.done
            } // else
        }
        else { // search from PAFDB
            $.ajax({
                //url: "@BaseUrl/Orders/GetShippingAddress",
                url: _BASEURL + "/Base/GetAddresses",
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    console.log('GetAddresses: ', data);
                    response($.map(data, function (item) {
                        return { label: item.AddressLine1, Value: item.Latitude + ',' + item.Longitude };
                    }));
                }
            });
        }
    },
    OnSearchSelect: function (id, i) {
        if (Common.locationApi == 'google') {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'placeId': i.item.place_id },
                function (responses, status) {
                    if (status == 'OK') {
                        lat = responses[0].geometry.location.lat();
                        lng = responses[0].geometry.location.lng();
                        // console.log(lat, lng);
                        $("#" + id).val(lat + ',' + lng);

                        var payload = {
                            'LocationName': i.item.prediction.structured_formatting.main_text,
                            'Address': i.item.prediction.description,
                            'Lat': lat,
                            'Lng': lng,
                            'LocationTypeId': 7
                        };
                        //console.log('Save Address Payload: ', payload);
                        SaveAddress(payload);
                    } // (status == 'OK')
                }); // end function(responses, status)
        }
    },

} // End of Common 

var __CHILD_WINDOW_HANDLERS = [];

//$(window).on('unload', function () {
//    for (var i = 0; i < __CHILD_WINDOW_HANDLERS.length; i++) {
//        var popup = __CHILD_WINDOW_HANDLERS[i];
//        if (popup && !popup.closed) {
//            popup.close();
//        }
//    }
//});

// This event hander will listen for messages from the parent
window.addEventListener('message', function (e) {
    //ProcessMessage(e.data); // e.data hold the message
}, false);

function ProcessMessage(message) {
    //console.log(message);
    //if (message.startsWith("IFRAME:")) {
    //    message = message.split("IFRAME:")[1];
    //    var $ctrl = window.parent.$("[data-title='" + message + "']");//$("[data-title='" + message + "']", window.parent.document);
    //    if ($ctrl != undefined) {
    //        var tabText = $ctrl.text();
    //        if (window.parent.$("#tabMenuSec").text().replace(' x ', '') == tabText)
    //            $ctrl.click();
    //    }
    //}
    if (message.indexOf(message, 6) === "IFRAME:") {
        alert("Sucess");
        message = message.split("IFRAME:")[1];
        var $ctrl = window.parent.$("[data-title='" + message + "']");//$("[data-title='" + message + "']", window.parent.document);
        if ($ctrl != undefined) {
            var tabText = $ctrl.text();
            if (window.parent.$("#tabMenuSec").text().replace(' x ', '') == tabText)
                $ctrl.click();
        }
    }
    else {
        var $ctrl = $("[data-title='" + message + "']");
        if ($ctrl != undefined) {
            var tabText = $ctrl.text();
            if ($("#tabMenuSec").text().replace(' x ', '') == tabText)
                $ctrl.click();
        }
    }

}

function fromArgbToColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};