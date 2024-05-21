var mapManagement = {
    MapScheduleId: 0,
    Map: null,
    Features: [],
    Popup: document.getElementById("mapPopup"),
    Popover: null
}

var schedulesKendoUIManagement = (function () {

    const API_KEY = "AAPK37ec39411e134373b51a16545c9e74b0RkDeQM9nKt4c7L96TyH-Wkd8UuVYYx2kj_AbZBk52hU1-sqbQzFBSEQymmLEiJcq";

    var DOM = {
        ScheduleGrid: $("#schedulesGrid"),
        Popup: document.getElementById("popup")
    }

    var globalData = {
        baseURL: "../"
    }

    function bindEvents() { }

    function bindControls() { }

    function initMap() {
        fetch("/Schedules/GetInitMap", {
            headers: {
                Accept: "*/*"
            },
            method: "GET"
        }).then(response => response.json())
            .then(result => {
                const authentication = arcgisRest.ApiKeyManager.fromKey(API_KEY);
                var map = new ol.Map({ target: "map" });
                const center = result.Center;
                map.setView(new ol.View({
                    center: ol.proj.transform([center.Longitude, center.Latitude], "EPSG:4326", "EPSG:3857"),
                    zoom: 14
                }));
                const geometries = result.Geometries;
                const basemapID = "arcgis/navigation";
                const basemapURL = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/${basemapID}?token=${API_KEY}`;
                olms.apply(map, basemapURL).then(function (map) {
                    AddFeaturesLayer(geometries);
                    AddRouteLayers(geometries);
                });

                function AddFeaturesLayer() {
                    var features = [];
                    const wktReader = new ol.format.WKT();
                    for (var i = 0; i < geometries.length; i++) {
                        var feature = wktReader.readFeature(geometries[i]);
                        feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
                        if (feature.getGeometry().getType() == "LineString") {
                            // Trường hợp API_KEY hỏng
                            //feature.setStyle(
                            //    new ol.style.Style({
                            //        stroke: new ol.style.Stroke({
                            //            color: "red",
                            //            width: 1
                            //        })
                            //    })
                            //);
                        } else if (feature.getGeometry().getType() == "Point") {
                            feature.setStyle(
                                new ol.style.Style({
                                    image: new ol.style.Icon({
                                        src: "https://freesvg.org/img/flat_location_logo.png",
                                        scale: 0.035
                                    })
                                })
                            );
                        }
                        features.push(feature);
                    }
                    map.addLayer(
                        new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: features
                            })
                        })
                    );
                }

                function AddRouteLayers() {
                    const geoJSON = new ol.format.GeoJSON({
                        defaultDataProjection: "EPSG:4326",
                        featureProjection: "EPSG:3857"
                    });
                    var points = [];
                    const wktReader = new ol.format.WKT();
                    for (var i = 0; i < geometries.length; i++) {
                        var feature = wktReader.readFeature(geometries[i]);
                        feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
                        if (feature.getGeometry().getType() == "Point") {
                            points.push(feature.getGeometry().getCoordinates());
                        }
                    }
                    for (var i = 0; i < points.length - 1; i++) {
                        var startCoords = ol.proj.transform(points[i], "EPSG:3857", "EPSG:4326");
                        var endCoords = ol.proj.transform(points[i + 1], "EPSG:3857", "EPSG:4326");
                        arcgisRest.solveRoute({
                            stops: [startCoords, endCoords],
                            authentication
                        }).then((response) => {
                            map.addLayer(new ol.layer.Vector({
                                style: new ol.style.Style({
                                    stroke: new ol.style.Stroke({ color: "HSL(205, 100%, 50%)", width: 2.5, opacity: 1 })
                                }),
                                source: new ol.source.Vector({
                                    features: geoJSON.readFeatures(response.routes.geoJson)
                                })
                            }));
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                }
            });
    }

    function initSchedulesGrid() {
        DOM.ScheduleGrid.kendoGrid({
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalData.baseURL + "Schedules/GetScheduleDTOs",
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
                            Description: { type: "string", editable: false },
                            CreateDate: { type: "string", editable: false },
                            LastUpdateDate: { type: "string", editable: false },
                            AccountName: { type: "string", editable: false },
                            Type: { type: "number", editable: false },
                            Time: { type: "string", editable: false },
                            IsPublic: { type: "boolean", editable: false },
                            Status: { type: "boolean", editable: false }
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
                    text: "Thêm Lịch Trình",
                },
                {
                    name: "cancel",
                    text: "Đổi Trạng Thái",
                }
            ],
            columns: [
                {
                    command: [
                        {
                            text: " ",
                            iconClass: "fa-regular fa-eye",
                            click: LoadMap,
                            className: "kendo-grid-btn"
                        }
                    ],
                    width: 100
                },
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
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "Description",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Mô Tả</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:Description#</div>",
                    width: 250,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "CreateDate",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Ngày Tạo</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:CreateDate#</div>",
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "LastUpdateDate",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Ngày Cập Nhật</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:LastUpdateDate#</div>",
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "AccountName",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Tên Người Tạo</strong></div>",
                    template: "<div class=\"kendo-grid-cell\">#:AccountName#</div>",
                    width: 150,
                    sortable: false,
                    filterable: false
                },
                {
                    field: "Time",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Thời Gian</strong></div>",
                    template: "<div class=\"kendo-grid-cell\"><div class=\"scheduleTime\"></div></div>",
                    width: 125,
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
                    field: "IsPublic",
                    headerTemplate: "<div class=\"kendo-grid-header\"><strong>Công Khai</strong></div>",
                    template: "<div class=\"kendo-grid-cell\"><div class=\"isPublicTemplate\"></div></div>",
                    width: 150,
                    sortable: false,
                    filterable: {
                        extra: false,
                        showOperators: false,
                        messages: {
                            info: "",
                            filter: "Lọc",
                            clear: "Xoá",
                            isTrue: " Công Khai",
                            isFalse: " Không Công Khai"
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
                    command: [
                        {
                            text: "Cập nhật",
                            click: UpdateSchedule,
                            className: "kendo-grid-btn"
                        }
                    ],
                    width: 100
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
        this.autoFitColumn(0);

        grid.table.find("tr").each(function () {
            var dataItem = grid.dataItem(this);

            switch (dataItem.Type) {
                case 1:
                    $(this).find(".scheduleTime").html("<i class=\"fa-regular fa-sun\" style=\"color: #FFD43B;\"></i>");
                    break;
                case 2:
                    $(this).find(".scheduleTime").html("<i class=\"fa-solid fa-sun\" style=\"color: #FF0000;\"></i>");
                    break;
                case 3:
                    $(this).find(".scheduleTime").html("<i class=\"fa-solid fa-moon\" style=\"color: #DCDCDC;\"></i>");
                    break;
            };

            $(this).find(".isPublicTemplate").kendoBadge({
                themeColor: dataItem.IsPublic ? "success" : "error",
                text: dataItem.IsPublic ? "Công Khai" : "Không Công Khai"
            });

            $(this).find(".badgeTemplate").kendoBadge({
                themeColor: dataItem.Status ? "success" : "error",
                text: dataItem.Status ? "Hoạt Động" : "Ngưng Hoạt Động"
            });
        });
    }

    function UpdateSchedule(e) {
        alert("Tính năng vẫn đang cập nhật");
        //e.preventDefault();
        //var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        //$.ajax({
        //    url: globalData.baseURL + "Venues/UpdateVenuePopup/" + dataItem.Id,
        //    type: "GET",
        //    success: function (result) {
        //        DOM.Popup.innerHTML = result;
        //        WardsDropDownList();
        //        AdministratorsDropDownList();
        //        RemovePopup();
        //    },
        //    error: function (result) {
        //        console.log(result);
        //    }
        //});
    }

    function LoadMap(e) {
        var dataItemId = 0;
        if (e != null) {
            e.preventDefault();
            dataItemId = this.dataItem($(e.currentTarget).closest("tr")).Id;
        }
        if (dataItemId == 0 || dataItemId != mapManagement.MapScheduleId) {
            $.ajax({
                url: globalData.baseURL + "Schedules/GetMapSchedule/" + dataItemId,
                type: "GET",
                success: function (result) {
                    document.getElementById("map").innerHTML = "";
                    mapManagement.MapScheduleId = dataItemId;
                    try {
                        const authentication = arcgisRest.ApiKeyManager.fromKey(API_KEY);
                        mapManagement.Map = new ol.Map({ target: "map" });
                        mapManagement.Features = [];
                        const center = result.Center;
                        mapManagement.Map.setView(new ol.View({
                            center: ol.proj.transform([center.Longitude, center.Latitude], "EPSG:4326", "EPSG:3857"),
                            zoom: 14
                        }));
                        const overlay = new ol.Overlay({
                            element: mapManagement.Popup,
                            positioning: "bottom-center"
                        });
                        mapManagement.Map.addOverlay(overlay);

                        mapManagement.Map.on("click", function (event) {
                            const feature = mapManagement.Map.forEachFeatureAtPixel(event.pixel, function (feature) {
                                return feature;
                            });
                            DisposePopover();
                            if (!feature) { return; }
                            overlay.setPosition(event.coordinate);
                            mapManagement.Popover = new bootstrap.Popover(mapManagement.Popup, {
                                placement: "top",
                                html: true,
                                content: feature.get("name") ?? "",
                            });
                            mapManagement.Popover.show();
                        });

                        mapManagement.Map.on("movestart", DisposePopover);

                        const pointFeatures = result.Features;
                        const geometries = result.Geometries;
                        const basemapID = "arcgis/navigation";
                        const basemapURL = `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/${basemapID}?token=${API_KEY}`;

                        olms.apply(mapManagement.Map, basemapURL).then(function (map) {
                            AddFeaturesLayer(pointFeatures);
                            AddRouteLayers(geometries);
                        });

                        function AddFeaturesLayer() {
                            for (var i = 0; i < pointFeatures.length; i++) {
                                var feature = new ol.Feature({
                                    geometry: new ol.geom.Point(ol.proj.transform([pointFeatures[i].Geometry.Coordinates[1], pointFeatures[i].Geometry.Coordinates[0]], "EPSG:4326", "EPSG:3857")),
                                    name: pointFeatures[i].Name
                                });
                                feature.setStyle(
                                    new ol.style.Style({
                                        image: new ol.style.Icon({
                                            src: "https://freesvg.org/img/flat_location_logo.png",
                                            scale: 0.035
                                        })
                                    })
                                );
                                mapManagement.Features.push(feature);
                            }
                            mapManagement.Map.addLayer(
                                new ol.layer.Vector({
                                    source: new ol.source.Vector({
                                        features: mapManagement.Features
                                    })
                                })
                            );
                        }

                        function AddRouteLayers() {
                            const geoJSON = new ol.format.GeoJSON({
                                defaultDataProjection: "EPSG:4326",
                                featureProjection: "EPSG:3857"
                            });
                            var points = [];
                            const wktReader = new ol.format.WKT();
                            for (var i = 0; i < geometries.length; i++) {
                                var feature = wktReader.readFeature(geometries[i]);
                                feature.getGeometry().transform("EPSG:4326", "EPSG:3857");
                                if (feature.getGeometry().getType() == "Point") {
                                    points.push(feature.getGeometry().getCoordinates());
                                }
                            }
                            for (var i = 0; i < points.length - 1; i++) {
                                var startCoords = ol.proj.transform(points[i], "EPSG:3857", "EPSG:4326");
                                var endCoords = ol.proj.transform(points[i + 1], "EPSG:3857", "EPSG:4326");
                                arcgisRest.solveRoute({
                                    stops: [startCoords, endCoords],
                                    authentication
                                }).then((response) => {
                                    mapManagement.Map.addLayer(new ol.layer.Vector({
                                        style: new ol.style.Style({
                                            stroke: new ol.style.Stroke({ color: "HSL(205, 100%, 50%)", width: 2.5, opacity: 1 })
                                        }),
                                        source: new ol.source.Vector({
                                            features: geoJSON.readFeatures(response.routes.geoJson)
                                        })
                                    }));
                                }).catch((error) => {
                                    console.error(error);
                                });
                            }
                        }

                        function DisposePopover() {
                            if (mapManagement.Popover) {
                                mapManagement.Popover.dispose();
                                mapManagement.Popover = undefined;
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    }

    return {
        init: function () {
            LoadMap();
            initSchedulesGrid();
            bindEvents();
            bindControls();
        }
    }

})();

$(function () {
    schedulesKendoUIManagement.init();
});