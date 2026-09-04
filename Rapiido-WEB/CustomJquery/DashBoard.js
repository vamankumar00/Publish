var Dashboard = {
    charts: {},
    apiUrl: "",

    init: function () {
        var _this = this;
        this.resolveApiUrl();
        this.bindEvents();
        this.loadDashboardData("today");
    },

    resolveApiUrl: function() {
        var _this = this;
        var urls = ['../Data.txt', 'Data.txt'];
        for (var i=0; i<urls.length; i++) {
            $.ajax({
                url: urls[i], async: false, cache: false, dataType: "text",
                success: function (data) { _this.apiUrl = data; }
            });
            if (this.apiUrl) break;
        }
    },

    bindEvents: function () {
        var _this = this;
        $('#dateFilterGroup button').on('click', function () {
            $('#dateFilterGroup button').removeClass('active');
            $(this).addClass('active');
            _this.loadDashboardData($(this).data('range'));
        });
    },

    loadDashboardData: function (range) {
        var _this = this;
        var dates = this.getDateRange(range);
        var clientId = (typeof DefaultClientId !== "undefined") ? DefaultClientId : window.localStorage.getItem("DefaultClientId"); 

        if (!this.apiUrl) return;
        
        // Show Loading State
        $('#restaurantName').text("Refreshing...");
        $('body').addClass('loading');

        var fullUrl = this.apiUrl + "GetDashboardData?defaultClientId=" + clientId + 
                      "&fromDate=" + dates.from + "&toDate=" + dates.to;

        var _this = this;
        $.ajax({
            url: fullUrl,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $('body').removeClass('loading');
                if (response && response.Status === "Success") {
                    _this.updateUI(response.Data);
                } else {
                    var errorMsg = (response && response.Message) ? response.Message : "Failed to load data";
                    _this.handleError(errorMsg);
                }
            },
            error: function (xhr) {
                $('body').removeClass('loading');
                var errorMsg = "Connection Error";
                if (xhr && xhr.responseJSON && xhr.responseJSON.Message) errorMsg = xhr.responseJSON.Message;
                _this.handleError(errorMsg);
            }
        });
    },

    handleError: function(msg) {
        $('#restaurantName').text("ERROR: " + msg);
        console.error("Dashboard Error:", msg);
    },

    getDateRange: function (range) {
        var hasMoment = (typeof moment !== "undefined");
        var to = hasMoment ? moment().format('YYYY-MM-DD') : new Date().toISOString().split('T')[0];
        var from = to; // Default to today

        if (hasMoment) {
            switch (range) {
                case "week": from = moment().subtract(7, 'days').format('YYYY-MM-DD'); break;
                case "month": from = moment().startOf('month').format('YYYY-MM-DD'); break;
                case "year": from = moment().startOf('year').format('YYYY-MM-DD'); break;
                default: from = moment().format('YYYY-MM-DD'); break;
            }
        }
        return { from: from, to: to };
    },

    updateUI: function (data) {
        if (!data || !data.Summary) {
            $('#restaurantName').text($("#SessionRestaurantName").val() || "MY RESTAURANT");
            return;
        }

        // Restaurant Name from Backend per Requirement 2 with session fallback
        var restName = data.Summary.RestaurantName || $("#SessionRestaurantName").val() || "MY RESTAURANT";
        $('#restaurantName').text(restName);

        // Core KPIs
        this.animateValue("totalRevenue", data.Summary.TotalRevenue, true);
        this.animateValue("totalOrders", data.Summary.TotalOrders, false);
        this.animateValue("avgOrderValue", data.Summary.AvgOrderValue, true);
        this.animateValue("cancellationLoss", data.Summary.CancellationLoss, true);
        $('#totalCancelledCount').text((data.Summary.TotalCancelled || 0) + " VOIDED");

        // Trends
        this.updateTrendIndicator("revenueTrend", data.DailyTrend);
        this.updateTrendIndicator("ordersTrend", data.DailyTrend);
        this.updateTrendIndicator("aovTrend", data.DailyTrend);

        // Occupancy
        var occupied = (data.Occupancy || []).find(o => o.IsOccupied);
        var vacant = (data.Occupancy || []).find(o => !o.IsOccupied);
        $('#occupiedTables').text(occupied ? occupied.Count : 0);
        $('#vacantTables').text(vacant ? vacant.Count : 0);

        // Main Charts
        this.renderLineChart('salesTrendChart', 'REVENUE', data.DailyTrend || [], '#5e72e4');
        
        // Bank Wise (Top 5) - From FlightDetails
        var banks = (data.Payments || []).slice(0, 5);
        this.renderHorizontalBar('paymentMethodChart', 
            banks.map(b => b.PaymentMode && b.PaymentMode.length > 20 ? b.PaymentMode.substring(0, 20) + '...' : b.PaymentMode), 
            banks.map(b => b.Amount), 
            '#2dce89');

        // Card Type Usage - New Chart
        var cardTypes = (data.CardTypes || []).slice(0, 5);
        this.renderDoughnutChart('cardTypeChart', cardTypes.map(c => c.Label), cardTypes.map(c => c.Value));
        
        // Channel Mix
        // this.renderDoughnutChart('orderTypeChart', (data.OrderTypes || []).map(o => o.OrderType), (data.OrderTypes || []).map(o => o.OrderCount));
        
        // Hourly
        this.renderLineChart('hourlyTrendChart', 'SALES', data.HourlyTrend || [], '#11cdef');

        // Occupancy Chart
        this.renderDoughnutChart('occupancyChart', ['OCCUPIED', 'VACANT'], [occupied ? occupied.Count : 0, vacant ? vacant.Count : 0], ['#5e72e4', '#2dce89']);

        // Products Chart (Top 5)
        var products = (data.TopProducts || []).slice(0, 5);
        this.renderHorizontalBar('productChart', 
            products.map(p => p.ItemDesc && p.ItemDesc.length > 15 ? p.ItemDesc.substring(0, 15) + '...' : p.ItemDesc), 
            products.map(p => p.TotalAmount), // Changed to Amount based on SP change
            '#fb6340');

        // Staff Chart (Top 5)
        var staff = (data.StaffPerformance || []).slice(0, 5);
        this.renderHorizontalBar('staffChart', 
            staff.map(s => s.WaiterName || 'Unknown'), 
            staff.map(s => s.TotalSalesValue), 
            '#8965e0');
    },

    animateValue: function(id, endValue, isCurrency) {
        var obj = document.getElementById(id);
        if (!obj) return;
        obj.innerHTML = isCurrency ? this.formatCurrency(endValue) : Math.floor(endValue);
    },

    updateTrendIndicator: function(id, dataPoints) {
        var $container = $('#' + id);
        if (!dataPoints || dataPoints.length < 2) return;
        var cur = dataPoints[dataPoints.length - 1].Value, pre = dataPoints[dataPoints.length - 2].Value;
        var diff = (pre === 0) ? (cur > 0 ? 100 : 0) : ((cur - pre) / pre) * 100;
        var icon = diff >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        var colorClass = diff >= 0 ? 'text-success' : 'text-danger';
        $container.html(`<span class="${colorClass} font-weight-bold"><i class="fas ${icon}"></i> ${diff.toFixed(1)}%</span>`);
    },

    renderHorizontalBar: function(id, labels, values, color) {
        var el = document.getElementById(id);
        if (!el) return;
        var ctx = el.getContext('2d');
        if (this.charts[id]) this.charts[id].destroy();
        this.charts[id] = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ data: values, backgroundColor: color, borderRadius: 8 }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    },

    renderLineChart: function(id, label, dataPoints, color) {
        var el = document.getElementById(id);
        if (!el) return;
        var ctx = el.getContext('2d');
        if (this.charts[id]) this.charts[id].destroy();
        this.charts[id] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map(d => d.Label),
                datasets: [{ label: label, data: dataPoints.map(d => d.Value), borderColor: color, backgroundColor: color + '20', fill: true, tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    },

    renderDoughnutChart: function(id, labels, values, colors) {
        var el = document.getElementById(id);
        if (!el) return;
        var ctx = el.getContext('2d');
        if (this.charts[id]) this.charts[id].destroy();
        this.charts[id] = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: labels, datasets: [{ data: values, backgroundColor: colors || ['#5e72e4', '#2dce89', '#11cdef', '#fb6340', '#f5365c'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }
        });
    },

    formatCurrency: function(val) {
        return parseFloat(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
};

$(document).ready(function () {
    Dashboard.init();
});