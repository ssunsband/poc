sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, ODataModel, MessageBox, NumberFormat, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("poc8.controller.MarcsList", {
			onInit: function () {
                const oView = this.getView();
                oView.setModel(new JSONModel({baselineDate: this._changeDateString(new Date(), "-")}), "filterModel");
                oView.setModel(new JSONModel({}), "listModel");

                let oAgingSrvModel = this.getOwnerComponent().getModel("agingSrvModel");
                oAgingSrvModel.setSizeLimit(10000);

                // OData V4 Model 생성 시 serviceUrl, synchronizationMode은 필수 properties
                // serviceUrl: 데이터를 요청할 서비스의 root url
                // synchronizationMode: 하나의 바인딩에서 데이터가 변경되는 경우에 대해 동일한 데이터를 참조하는 서로 다른 바인딩 간의 동기화 제어. 바인딩이 전혀 동기화되지 않음을 의미=None
                // synchronizationMode는 None만 가능
                let oListOdataModel = new ODataModel({
                    operationMode: "Server",
                    serviceUrl: oAgingSrvModel.sServiceUrl,
                    synchronizationMode: "None"
                });
                oListOdataModel.setSizeLimit(1000000);
                oView.setModel(oListOdataModel, "listODataModel");
                
                const oModel = this.getOwnerComponent().getModel();
                let oRootModel = this.getOwnerComponent().getModel("rootModel");
                oRootModel.setSizeLimit(10000);

                $.ajax({
                    url: oModel.sServiceUrl + "Stlocs",
                    type: "GET",
                    // data : JSON.stringify(oSendData),
                    contentType: "application/json",
                    success: (result) => {
                        let aResults = result.value || [];
                        let aPlant = [];
                        let oStorageLocation = {};

                        for( let i=0; i<aResults.length; i++ ) {
                            let oResult = aResults[i];
                            if( -1===aPlant.indexOf(oResult.werks) ) {
                                aPlant.push(oResult.werks);
                                oStorageLocation[oResult.werks] = [];
                            }

                            oStorageLocation[oResult.werks].push({lgort: oResult.lgort, lgobe: oResult.lgobe});
                        }

                        oRootModel.setProperty("/storageLocationAll", oStorageLocation);
                    },
                    error: (e) => {
                        console.log("error", e);
                    }
                });

                $.ajax({
                    url: oModel.sServiceUrl + "Maras?$expand=makts",
                    type: "GET",
                    // data : JSON.stringify(oSendData),
                    contentType: "application/json",
                    success: (result) => {
                        let aResults = result.value || [];

                        aResults.forEach(oItem => {
                            oItem.matnr_show = "" + parseInt(oItem.matnr);
                        })

                        oRootModel.setProperty("/Maras", aResults);
                    },
                    error: (e) => {
                        console.log("error", e);
                    }
                });
            }

            ,onMatnrFormat: function (sMatnrParam) {
                let sReturnValue = sMatnrParam;

                if( sMatnrParam ) {
                    sReturnValue = "" + parseInt(sMatnrParam);
                }

                return sReturnValue;
            }

            ,numberFormat: function (sValueParam) {
                let sReturnValue = sValueParam;
                let oFormat = NumberFormat.getCurrencyInstance({
                    "currencyCode": false,
                    "customCurrencies": {
                        "MyDollar": {
                            "isoCode": "USD",
                            "decimals": 3
                        }
                        ,"Bitcoin": {
                            "decimals": 2
                        }
                        ,"": {
                            "symbol": "",
                            "decimals": 3
                        }
                    }
                });

                sReturnValue = oFormat.format(sValueParam, "");

                return sReturnValue;
            }

            ,onSearch: function () {
                const oView = this.getView();
                const oAgingSrvModel = oView.getModel("agingSrvModel");
                const oFilters = oView.getModel("filterModel").getData();
                const sPlant = oFilters.plant;
                const aStorageLocation = oFilters.storageLocation;
                const aMaterial = oFilters.material;
                const aMaterialType = oFilters.materialType;
                const aMaterialGroup = oFilters.materialGroup;
                const sBaselineDate = oFilters.baselineDate;
                let sAddUrl = "";

                // plant가 있는 경우
                if( sPlant ) {
                    sAddUrl += "werks eq '"+ sPlant +"'";
                }else {
                    MessageBox.error("Plant는 필수값 입니다.");
                    return;
                }

                if( !sBaselineDate ) {
                    MessageBox.error("Baseline Date는 필수값 입니다.");
                    return;
                }

                // Storage Location이 있는 경우
                if( aStorageLocation && 0<aStorageLocation.length ) {
                    sAddUrl += " and (";

                    for( let i=0; i<aStorageLocation.length; i++ ) {
                        if( i !== 0 ) sAddUrl += " or ";
                        sAddUrl += "lgort eq '" + aStorageLocation[i] + "'";
                    }

                    sAddUrl += ")";
                }

                // Material이 있는 경우
                if( aMaterial && 0<aMaterial.length ) {
                    sAddUrl += " and (";

                    for( let i=0; i<aMaterial.length; i++ ) {
                        if( i !== 0 ) sAddUrl += " or ";
                        sAddUrl += "matnr eq '" + "00000000000" + aMaterial[i] + "'";
                    }

                    sAddUrl += ")";
                }

                // Material Type이 있는 경우
                if( aMaterialType && 0<aMaterialType.length ) {
                    sAddUrl += " and (";

                    for( let i=0; i<aMaterialType.length; i++ ) {
                        if( i !== 0 ) sAddUrl += " or ";
                        sAddUrl += "mtart eq '" + aMaterialType[i] + "'";
                    }

                    sAddUrl += ")";
                }

                // Material Group이 있는 경우
                if( aMaterialGroup && 0<aMaterialGroup.length ) {
                    sAddUrl += " and (";

                    for( let i=0; i<aMaterialGroup.length; i++ ) {
                        if( i !== 0 ) sAddUrl += " or ";
                        sAddUrl += "matkl eq '" + aMaterialGroup[i] + "'";
                    }

                    sAddUrl += ")";
                }

                if( sAddUrl ) {
                    sAddUrl = "?$filter=" + sAddUrl;
                }

                let sUrl = oAgingSrvModel.sServiceUrl + "Agings('"+sBaselineDate+"')/Set" + sAddUrl;
                let oSendData = null;

                oView.setBusy(true);

                $.ajax({
                    url: sUrl,
                    type: "GET",
                    // data : JSON.stringify(oSendData),
                    contentType: "application/json",
                    success: (result) => {
                        oView.getModel("listModel").setProperty("/Agings", result.value || []);
                        oView.setBusy(false);
                    },
                    error: (e) => {
                        console.log("error", e);
                        oView.setBusy(false);
                    }
                });
            }

            ,onSearch2: function () {
                const that = this;
                const oView = this.getView();
                const oAgingSrvModel = oView.getModel("agingSrvModel");
                const oFilters = oView.getModel("filterModel").getData();
                const sPlant = oFilters.plant;
                const aStorageLocation = oFilters.storageLocation;
                const aMaterial = oFilters.material;
                const aMaterialType = oFilters.materialType;
                const aMaterialGroup = oFilters.materialGroup;
                const sBaselineDate = oFilters.baselineDate;

                let oListOdataModel = oView.getModel("listODataModel");
                let oList = oListOdataModel.bindList("/Agings('"+sBaselineDate+"')/Set");
                let aFilters = [];

                // plant가 있는 경우
                if( sPlant ) {
                    // aFilters.push(new Filter("werks", FilterOperator.EQ, sPlant));
                    oList.filter(new Filter("werks", FilterOperator.EQ, sPlant));
                }else {
                    MessageBox.error("Plant는 필수값 입니다.");
                    return;
                }

                if( !sBaselineDate ) {
                    MessageBox.error("Baseline Date는 필수값 입니다.");
                    return;
                }

                oView.setBusy(true);

                // Storage Location이 있는 경우
                if( aStorageLocation && 0<aStorageLocation.length ) {
                    let aOrFilter = this._getOrFilterSet(aStorageLocation, "lgort");
              
                    oList.filter(new Filter({
                        filters: aOrFilter,
                        and: false
                    }));
                }

                // Material이 있는 경우
                if( aMaterial && 0<aMaterial.length ) {
                    let aOrFilter = this._getOrFilterSet(aMaterial, "matnr");
                
                    oList.filter(new Filter({
                        filters: aOrFilter,
                        and: false
                    }));
                }

                // Material Type이 있는 경우
                if( aMaterialType && 0<aMaterialType.length ) {
                    let aOrFilter = this._getOrFilterSet(aMaterialType, "mtart");
                
                    oList.filter(new Filter({
                        filters: aOrFilter,
                        and: false
                    }));
                }

                // Material Group이 있는 경우
                if( aMaterialGroup && 0<aMaterialGroup.length ) {
                    let aOrFilter = this._getOrFilterSet(aMaterialGroup, "matkl");
                
                    oList.filter(new Filter({
                        filters: aOrFilter,
                        and: false
                    }));
                }

                const aSearchData = [];
	    
                // oList.requestContexts().then(function (aContexts) {
                //     aContexts.forEach(function (oContext) {
                //         var data = oContext.getObject();
                //         aSearchData.push(data);
                //     });

                //     console.log(aSearchData);
                // });
                oList.requestContexts().then((aContexts) => {
                    aContexts.forEach((oContext) => {
                        var data = oContext.getObject();
                        aSearchData.push(data);
                    });

                    console.log(aSearchData);
                    oView.getModel("listModel").setProperty("/Agings", aSearchData);
                    oView.setBusy(false);
                });

                
                // const oView = this.getView();
                // const oTestModel = oView.getModel("testModel");

                // oTestModel.read("/('"+"2020-01-15"+"')/Set", {
                // success : function(data){
                //     if( data && data.results ) {
                //         console.log(data.results);
                //     }
                // }.bind(this),
                // error : function(e){
                //     console.log("error", e);
                // }
            }

            ,_getOrFilterSet: function (aValueParam, sPropertyParam) {
                let aReturnValue = [];
                
                aValueParam.forEach(function (sValue) {
                    if( sPropertyParam === "matnr" ) {
                        sValue = "00000000000" + sValue;
                    }
                    
                    aReturnValue.push(new Filter(sPropertyParam, FilterOperator.EQ, sValue));
                });

                return aReturnValue;
            }

            ,onChangePlant: function (oEvent) {
                const oView = this.getView();
                const sPlant = oEvent.getSource().getSelectedKey();
                let oRootModel = oView.getModel("rootModel");
                
                oRootModel.setProperty("/storageLocation", oRootModel.getProperty("/storageLocationAll")[sPlant]);
            }

            /**
             * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
             */
            ,_changeDateString: function (oDateParam, sGubun = "") {
                let oDate = oDateParam || new Date(),
                    iYear = oDate.getFullYear(),
                    iMonth = oDate.getMonth()+1,
                    iDate = oDate.getDate(),
                    iHours = oDate.getHours(),
                    iMinutes = oDate.getMinutes(),
                    iSeconds = oDate.getSeconds();

                let sReturnValue = "" + iYear + sGubun + this._getPreZero(iMonth) + sGubun + this._getPreZero(iDate);

                return sReturnValue;
            }

            /**
             * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
             */
            ,_getPreZero: function (iDataParam) {
                return (iDataParam<10 ? "0"+iDataParam : iDataParam);
            }
		});
	});
