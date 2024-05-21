var categoriesKendoUIManagement = (function () {

    var DOM = {
        CategoriesGrid: $("#categoriesGrid"),
        Popup: document.getElementById("popup")
    }

    var globalData = {
        baseURL: "../"
    }

    function bindEvents() {
        InsertButton();
        DeleteButton();
    }

    function bindControls() { }

    function initCategoriesGrid() {
        DOM.CategoriesGrid.kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Categories/GetCategoryAdminDTOs",
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
                        id: "Id",
                        fields: {
                            Id: { type: "number", editable: false, nullable: false },
                            Name: { type: "string", editable: false },
                            SubCategoryActiveNumber: { type: "number", editable: false },
                            SubCategoryInactiveNumber: { type: "number", editable: false },
                            VenueActiveNumber: { type: "number", editable: false },
                            VenueInactiveNumber: { type: "number", editable: false }
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
            sortable: false,
            navigatable: true,
            resizable: true,
            reorderable: true,
            scrollable: true,
            filterable: false,
            detailInit: detailInit,
            dataBound: onDataBound,
            toolbar: [
                {
                    name: "create",
                    text: "Thêm Thể Loại Phụ",
                },
                {
                    name: "cancel",
                    text: "Đổi Trạng Thái",
                }
            ],
            columns: [
                {
                    field: "Name",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Tên</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Name#</div>",
                    width: 250
                },
                {
                    field: "SubCategoryActiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Thể Loại Phụ</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:SubCategoryActiveNumber#</div>",
                    width: 200
                },
                {
                    field: "SubCategoryInactiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Thể Loại Phụ Đã Xóa</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:SubCategoryInactiveNumber#</div>",
                    width: 200
                },
                {
                    field: "VenueActiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Địa Điểm</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:VenueActiveNumber#</div>",
                    width: 200
                },
                {
                    field: "VenueInactiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Địa Điểm Đã Xóa</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:VenueInactiveNumber#</div>",
                    width: 200
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

    function detailInit(e) {
        $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "SubCategories/GetSubCategoryAdminDTOs",
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
                        id: "Id",
                        fields: {
                            Id: { type: "number", editable: false, nullable: false },
                            Name: { type: "string", editable: false },
                            CategoryId: { type: "number", editable: false },
                            VenueActiveNumber: { type: "number", editable: false },
                            VenueInactiveNumber: { type: "number", editable: false },
                            CreateDate: { type: "string", editable: false },
                            LastUpdateDate: { type: "string", editable: false },
                            Status: { type: "boolean", editable: false }
                        }
                    }
                },
                filter: {
                    field: "CategoryId",
                    operator: "eq",
                    value: e.data.Id
                }
            },
            pageable: {
                pageSize: 4,
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
            dataBound: onDataBoundDetail,
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
                    field: "Name",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Tên</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Name#</div>",
                    width: 200,
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
                            string: {
                                contains: "Bao Gồm",
                                doesnotcontain: "Không Bao Gồm"
                            }
                        }
                    }
                },
                {
                    field: "VenueActiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Địa Điểm</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:VenueActiveNumber#</div>",
                    width: 150,
                    filterable: false
                },
                {
                    field: "VenueInactiveNumber",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Số Lượng Địa Điểm Đã Xóa</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:VenueInactiveNumber#</div>",
                    width: 200,
                    filterable: false
                },
                {
                    field: "CreateDate",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Ngày Tạo</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:CreateDate#</div>",
                    width: 100,
                    filterable: false
                },
                {
                    field: "LastUpdateDate",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Ngày Cập Nhật</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:LastUpdateDate#</div>",
                    width: 110,
                    filterable: false
                },
                {
                    field: "Status",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Trạng Thái</strong></div>",
                    template: "<div class=\"kendo-grid-cell\"><div class=\"badgeTemplate\"></div></div>",
                    width: 150,
                    sortable: false,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
                            filter: "Lọc",
                            clear: "Xoá",
                            isTrue: " Đang Sử Dụng",
                            isFalse: " Đã Xóa"
                        }
                    }
                },
                {
                    command: {
                        text: "Cập nhật",
                        click: UpdateSubCategory,
                        className: "kendo-grid-btn"
                    },
                    width: 100
                }
            ]
        });
    }

    function onDataBound(e) {
        // Tự Động Mở Hàng Đầu Tiên 
        this.expandRow(this.tbody.find("tr.k-master-row").first());
    }

    function onDataBoundDetail() {
        var grid = this;

        grid.table.find("tr").each(function () {
            var dataItem = grid.dataItem(this);
            var themeColor = dataItem.Status ? "success" : "error";
            var text = dataItem.Status ? "Đang Sử Dụng" : "Đã Xóa";

            $(this).find(".badgeTemplate").kendoBadge({
                themeColor: themeColor,
                text: text
            });
        });
    }

    function InsertButton() {
        $("#categoriesGrid .k-grid-add:first").on("click", (function () {
            $.ajax({
                url: globalData.baseURL + "SubCategories/InsertSubCategoryPopup",
                type: "GET",
                success: function (result) {
                    DOM.Popup.innerHTML = result;
                    CategoriesDropDownList();
                    RemovePopup();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }));
    }

    function CategoriesDropDownList() {
        $("#categoriesDropDownList").kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Categories/GetCategoryDTOs",
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
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            Id: { type: "number", editable: false, nullable: false },
                            Name: { type: "string", editable: false }
                        }
                    }
                },
                sort: { field: "Id", dir: "asc" },
            },
            height: 300,
            optionLabel: "Chọn thể loại",
            dataValueField: "Id",
            dataTextField: "Name"
        });
    }

    function DeleteButton() {
        $("#categoriesGrid .k-grid-cancel-changes:first").on("click", (function () {
            var selectedItems = $("#categoriesGrid tr.k-selected");
            var ids = [];
            $.each(selectedItems, function (e) {
                // Cột Được Chọn
                var selectedItem = $(this);
                var grid = selectedItem.closest(".k-grid").data("kendoGrid");
                var dataItem = grid.dataItem(selectedItem);
                ids.push(dataItem.Id);
            });
            $.ajax({
                url: globalData.baseURL + "SubCategories/ChangeSubCategoryStatus",
                type: "PUT",
                data: {
                    ids: ids
                },
                success: function (result) {
                    $.each(selectedItems, function (e) {
                        var selectedItem = $(this);
                        var grid = selectedItem.closest(".k-grid").data("kendoGrid");
                        if (grid != null) {
                            grid.dataSource.read();
                            grid.refresh();
                        }
                    });
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }));
    }

    function RemovePopup() {
        $("#removePopup").on("click", (function () {
            DOM.Popup.innerHTML = "";
        }));
    }

    function UpdateSubCategory(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $.ajax({
            url: globalData.baseURL + "SubCategories/UpdateSubCategoryPopup/" + dataItem.Id,
            type: "GET",
            success: function (result) {
                DOM.Popup.innerHTML = result;
                CategoriesDropDownList();
                RemovePopup();
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    return {
        init: function () {
            initCategoriesGrid();
            bindEvents();
            bindControls();
        }
    }

})();

$(function () {
    categoriesKendoUIManagement.init();
});
