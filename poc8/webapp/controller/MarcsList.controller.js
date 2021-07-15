sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, MessageBox) {
		"use strict";

		return Controller.extend("poc8.controller.MarcsList", {
			onInit: function () {
                this.getView().setModel(new JSONModel({}), "filterModel");
                this.getView().setModel(new JSONModel({}), "listModel");
            }

            ,onSearch: function () {
                const oView = this.getView();
                const oAgingSrvModel = oView.getModel("agingSrvModel");
                const oFilters = oView.getModel("filterModel").getData();
                let sAddUrl = "";
                
                const sPlant = oFilters.plant;
                const sStorageLocation = oFilters.storageLocation;
                const aMaterial = oFilters.material;
                const aMaterialType = oFilters.materialType;
                const aMaterialGroup = oFilters.materialGroup;
                const sBaselineDate = oFilters.baselineDate;

                if( sPlant ) {
                    sAddUrl += "werks eq '"+ sPlant +"'";
                }else {
                    MessageBox.error("Plant는 필수값 입니다.");
                    return;
                }

                if( sAddUrl ) {
                    sAddUrl = "?$filter=" + sAddUrl;
                }


                let sUrl = oAgingSrvModel.sServiceUrl + "Marcs" + sAddUrl;
                let oSendData = null;

                oView.setBusy(true);

                $.ajax({
                    url: sUrl,
                    type: "GET",
                    // data : JSON.stringify(oSendData),
                    contentType: "application/json",
                    success: function(result){
                        let aResult = result.value || [];
                        oView.getModel("listModel").setProperty("/Marcs", aResult);
                        oView.setBusy(false);
                    }.bind(this),
                    error: function(e){
                        console.log("error", e);
                        oView.setBusy(false);
                    }
                });
            }

            ,_getMainList: function () {
                
            }
            
            ,onGet: function () {
                let url = "/odata/v4/material.AgingSrv/Plants"
                $.ajax({
                    url: url,
                    type: "POST",
                    contentType: "application/json",
                    success: function(data){
                        console.log(data);                  
                    },
                    error: function(e){
                        console.log(data);                  
                        
                    }
                });                
            }
		});
	});
