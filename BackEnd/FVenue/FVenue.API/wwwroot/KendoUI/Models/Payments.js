var paymentsKendoUIManagement = (function () {

    var DOM = {
        PaymentsGrid: $("#paymentsGrid"),
        Popup: document.getElementById("popup")
    }

    var globalData = {
        baseURL: "../"
    }

    function bindEvents() { }

    function bindControls() { }

    function initPaymentsGrid() {
        DOM.PaymentsGrid.kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Payments/GetVNPAYPaymentDTOs",
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            dataType: "JSON",
                            success: function (result) {
                                options.success(result);
                            },
                            error: function (result) {
                                options.error(result);
                            }
                        });
                    }
                },
                batch: true,
                autoSync: true,
                schema: {
                    model: {
                        id: "PaymentId",
                        fields: {
                            PaymentId: { type: "number", editable: false, nullable: false },
                            UserId: { type: "number", editable: false },
                            UserName: { type: "string", editable: false },
                            UserImage: { type: "string", editable: false },
                            Amount: { type: "string", editable: false },
                            Content: { type: "string", editable: false },
                            Status: { type: "number", editable: false },
                            CreateDate: { type: "date", editable: false }
                        }
                    }
                }
            },
            height: AutoFitHeight,
            pageable: {
                pageSize: 10,
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            scrollable: true,
            filterable: true,
            dataBound: onDataBound,
            toolbar: [
                {
                    name: "excel",
                    text: "Xuất Excel",
                }
            ],
            columns: [
                {
                    selectable: true,
                    width: 50,
                    headerAttributes: {
                        "class": "kendo-checkbox"
                    },
                    attributes: {
                        "class": "kendo-checkbox"
                    }
                },
                {
                    field: "UserName",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Người Giao Dịch</strong></div>",
                    template:
                        "<div style=\"display: flex; flex-direction: row; align-items: center;\">" +
                        "<div class=\"kendo-cell-photo\" style=\"background-image: url(#:UserImage#);\"></div>" +
                        "<div class=\"kendo-cell-name\">#:UserName#</div>" +
                        "</div>",
                    width: 200,
                    sortable: false,
                    filterable: {
                        multi: true,
                        search: true,
                        messages: {
                            info: "",
                            search: "Tìm kiếm",
                            checkAll: "Chọn tất cả",
                            selectedItemsFormat: "Đã chọn {0} mục",
                            filter: "Lọc",
                            clear: "Xoá"
                        }
                    }
                },
                {
                    field: "PaymentId",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Mã Giao Dịch</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:PaymentId#</div>",
                    width: 150,
                    sortable: true,
                    filterable: false
                },
                {
                    field: "Amount",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Tiền Giao Dịch</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Amount#₫</div>",
                    width: 100,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "Content",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Nội Dung Giao Dịch</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Content#</div>",
                    width: 250,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "Status",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Trạng Thái</strong></div>",
                    template: "<div class=\"kendo-grid-cell\"><div class=\"badgeTemplate\"></div></div>",
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "CreateDate",
                    format: "{0:dd/MM/yyyy HH:mm:ss}",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Thời Gian Giao Dịch</strong></div>",
                    template: function (dataItem) {
                        return "<div class=\"kendo-grid-cell\">" +
                            kendo.toString(kendo.parseDate(dataItem.CreateDate), "dd/MM/yyyy HH:mm:ss") +
                            "</div>";
                    },
                    width: 150,
                    filterable: {
                        extra: true,
                        showOperators: false,
                        messages: {
                            info: "",
                            and: "Và",
                            or: "Hoặc",
                            filter: "Lọc",
                            clear: "Xoá"
                        },
                        operators: {
                            date: {
                                gt: "Sau Ngày",
                                lt: "Trước Ngày"
                            }
                        }
                    }
                }
            ]
        });
    }

    function AutoFitHeight() {
        return document.documentElement.clientHeight -
            (
                document.querySelector(".main-header").clientHeight +
                document.querySelector(".main-footer").clientHeight
            );
    }

    function onDataBound(e) {
        var grid = this;

        grid.table.find("tr").each(function () {
            var dataItem = grid.dataItem(this);

            switch (dataItem.Status) {
                case 1:
                    $(this).find(".badgeTemplate").kendoBadge({
                        themeColor: "warning",
                        text: "Đang Xử Lý"
                    });
                    break;
                case 2:
                    $(this).find(".badgeTemplate").kendoBadge({
                        themeColor: "success",
                        text: "Thành Công"
                    });
                    break;
                case 3:
                    $(this).find(".badgeTemplate").kendoBadge({
                        themeColor: "error",
                        text: "Thất Bại"
                    });
                    break;
            };
        });
    }

    return {
        init: function () {
            initPaymentsGrid();
            bindEvents();
            bindControls();
        }
    }

})();

$(function () {
    paymentsKendoUIManagement.init();
});
