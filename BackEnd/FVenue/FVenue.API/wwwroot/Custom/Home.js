var homeManagement = (function () {

    var DOM = {
        SubCategoryRequestTable: document.getElementById("subCategoryRequestTable")
    }

    var globalData = {
        baseURL: "../"
    }

    function bindEvents() { }

    function bindControls() { }

    function initSubCategoryRequestTable() {
        if (DOM.SubCategoryRequestTable != null) {
            $.ajax({
                url: globalData.baseURL + "SubCategories/SubCategoryRequestTable/1",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    DOM.SubCategoryRequestTable.innerHTML = result;
                    SubCategoryRequestTableEvent();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    }

    function SubCategoryRequestTableEvent() {
        PaginationButtons();
        SubCategoryRequestApprovedButton();
        SubCategoryRequestRejectedButton();
    }

    function PaginationButtons() {
        $(".page-link").on("click", (function () {
            var page = $(this).attr("value");
            switch (page) {
                case "-1":
                    page = Number($("#subCategoryRequestPageIndex").attr("value")) - 1;
                    break;
                case "0":
                    page = Number($("#subCategoryRequestPageIndex").attr("value")) + 1;
                    break;
                default:
                    break;
            };
            $.ajax({
                url: globalData.baseURL + "SubCategories/SubCategoryRequestTable/" + page,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    DOM.SubCategoryRequestTable.innerHTML = result;
                    SubCategoryRequestTableEvent();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }));
    }

    function SubCategoryRequestApprovedButton() {
        $("#subCategoryRequestApproved").on("click", (function () {
            var ids = [];
            $("input[id^=\"subCategoryRequest\"]").each(function (index, element) {
                if (element.checked) ids.push(Number(element.value));
            });
            $.ajax({
                url: globalData.baseURL + "SubCategories/UpdateSubCategoryRequestStatus",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    Ids: ids,
                    Status: "Approved"
                }),
                success: function (result) {
                    DOM.SubCategoryRequestTable.innerHTML = result;
                    SubCategoryRequestTableEvent();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }));
    }

    function SubCategoryRequestRejectedButton() {
        $("#subCategoryRequestRejected").on("click", (function () {

        }));
    }

    return {
        init: function () {
            initSubCategoryRequestTable();
            bindEvents();
            bindControls();
        }
    }

})();

$(function () {
    homeManagement.init();
});