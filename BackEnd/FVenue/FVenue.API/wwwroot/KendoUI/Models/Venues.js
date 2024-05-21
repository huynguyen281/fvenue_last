var venuesKendoUIManagement = (function () {

    var DOM = {
        VenuesGrid: $("#venuesGrid"),
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

    function initVenuesGrid() {
        DOM.VenuesGrid.kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Venues/GetVenueDTOs",
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
                            Image: { type: "string", editable: false },
                            Street: { type: "string", editable: false },
                            Location: { type: "string", editable: false },
                            GeoLocation: { type: "string", editable: false },
                            OpenTime: { type: "string", editable: false },
                            CloseTime: { type: "string", editable: false },
                            LowerPrice: { type: "number", editable: false },
                            UpperPrice: { type: "number", editable: false },
                            Status: { type: "boolean", editable: false },
                            AccountName: { type: "string", editable: false }
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
                    name: "create",
                    text: "Thêm Địa Điểm",
                },
                {
                    name: "cancel",
                    text: "Đổi Trạng Thái",
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
                    field: "Name",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Tên</strong></div>",
                    template:
                        "<div style=\"display: flex; flex-direction: row; align-items: center;\">" +
                        "<div class=\"kendo-cell-photo\" style=\"background-image: url(#:Image#);\"></div>" +
                        "<div class=\"kendo-cell-name\">#:Name#</div>" +
                        "</div>",
                    width: 250,
                    sortable: false,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
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
                    field: "Street",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Địa Chỉ</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Street#</div>",
                    width: 150,
                    sortable: false,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
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
                    field: "Location",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Khu Vực</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Location#</div>",
                    width: 200,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
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
                    field: "GeoLocation",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Toạ Độ Địa Lý</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:GeoLocation#</div>",
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "OpenTime",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Giờ Mở Cửa</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:OpenTime#</div>",
                    width: 150,
                    filterable: false
                },
                {
                    field: "CloseTime",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Giờ Đóng Cửa</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:CloseTime#</div>",
                    width: 150,
                    filterable: false
                },
                {
                    field: "LowerPrice",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Giá Dưới</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:LowerPrice*1000#₫<div>",
                    width: 150,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
                            filter: "Lọc",
                            clear: "Xoá"
                        },
                        operators: {
                            number: {
                                lte: "Nhỏ Hơn",
                                gte: "Lớn Hơn"
                            }
                        }
                    }
                },
                {
                    field: "UpperPrice",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Giá Trên</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:UpperPrice*1000#₫</div>",
                    width: 150,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
                            filter: "Lọc",
                            clear: "Xoá"
                        },
                        operators: {
                            number: {
                                lte: "Nhỏ Hơn",
                                gte: "Lớn Hơn"
                            }
                        }
                    }
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
                            isTrue: " Hoạt Động",
                            isFalse: " Ngưng Hoạt Động"
                        }
                    }
                },
                {
                    field: "AccountName",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Nhà Quản Lý</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:AccountName#</div>",
                    width: 150,
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
                    command: {
                        text: "Cập nhật",
                        click: UpdateVenue,
                        className: "kendo-grid-btn"
                    },
                    width: 100
                }
            ]
        });

        DOM.VenuesGrid.kendoTooltip({
            // Chọn cột thứ hai (Tên)
            filter: "td:nth-child(2)",
            position: "right",
            content: function (e) {
                var dataItem = DOM.VenuesGrid.data("kendoGrid").dataItem(e.target.closest("tr"));
                var content = null;
                $.ajax({
                    url: globalData.baseURL + "Venues/GetVenueDescription/" + dataItem.Id,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    async: false,
                    success: function (result) {
                        content = result;
                    },
                    error: function (result) {
                        content = result;
                    }
                });
                return "<div style=\"width: " + content.length * .7 + "em; max-width: 14em;\">" + content + "</div>";
            }
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
            var themeColor = dataItem.Status ? "success" : "error";
            var text = dataItem.Status ? "Hoạt Động" : "Ngưng Hoạt Động";

            $(this).find(".badgeTemplate").kendoBadge({
                themeColor: themeColor,
                text: text
            });
        });
    }

    function InsertButton() {
        $("#venuesGrid .k-grid-add:first").on("click", (function () {
            $.ajax({
                url: globalData.baseURL + "Venues/InsertVenuePopup",
                type: "GET",
                success: function (result) {
                    DOM.Popup.innerHTML = result;
                    document.getElementById("image").addEventListener("change", UploadImage);
                    WardsDropDownList();
                    AdministratorsDropDownList();
                    RemovePopup();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }));
    }

    function WardsDropDownList() {
        $("#wardsDropDownList").kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "API/LocationAPI/GetWards",
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
                sort: { field: "Name", dir: "asc" },
            },
            height: 300,
            optionLabel: "Chọn quận",
            dataValueField: "Id",
            dataTextField: "Name",
            filter: "contains"
        });
    }

    function AdministratorsDropDownList() {
        $("#administratorsDropDownList").kendoDropDownList({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Accounts/GetAdministratorDTOs",
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
                            FullName: { type: "string", editable: false }
                        }
                    }
                },
                sort: { field: "FullName", dir: "asc" },
            },
            height: 300,
            optionLabel: "Chọn quản trị viên",
            dataValueField: "Id",
            dataTextField: "FullName",
            filter: "contains"
        });
    }

    function DeleteButton() {
        $("#venuesGrid .k-grid-cancel-changes:first").on("click", (function () {
            var ids = DOM.VenuesGrid.data("kendoGrid").selectedKeyNames();
            $.ajax({
                url: globalData.baseURL + "Venues/ChangeVenueStatus",
                type: "PUT",
                data: {
                    ids: ids
                },
                success: function (result) {
                    DOM.VenuesGrid.data("kendoGrid").dataSource.read();
                    DOM.VenuesGrid.data("kendoGrid").refresh();
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

    function UpdateVenue(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $.ajax({
            url: globalData.baseURL + "Venues/UpdateVenuePopup/" + dataItem.Id,
            type: "GET",
            success: function (result) {
                DOM.Popup.innerHTML = result;
                WardsDropDownList();
                AdministratorsDropDownList();
                RemovePopup();
            },
            error: function (result) {
                console.log(result);
            }
        });
    }

    async function UploadImage(e) {
        var data = new FormData();
        data.append("uFile", e.target.files[0]);
        await fetch("/API/ImageAPI/UploadImage", {
            headers: {
                Accept: "*/*"
            },
            method: "POST",
            body: data
        }).then(response => response.json())
            .then(result => {
                document.getElementById("imageURL").value = result.Data;
                document.getElementById("imageReview").style.backgroundImage = "url(\"" + result.Data + "\")";
            });
    }

    return {
        init: function () {
            initVenuesGrid();
            bindEvents();
            bindControls();
        }
    }

})();

$(function () {
    venuesKendoUIManagement.init();
});
