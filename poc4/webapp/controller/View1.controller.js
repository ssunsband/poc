sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("poc4.controller.View1", {
			onInit: function () {

            },
            
            onGetMetalData: function () {
                console.log("aaa");
                var oMetalODataModel = this.getView().getModel("mmODataModel");
                
                oMetalODataModel.read("/Plants", {
                    success: function (result) {
                        console.log(result);
                    },
                    error: function(e){
                        console.log("error", e);
                    }
                });
                // $.ajax({
                //     url: "/Plants",
                //     type: "POST",
                //     data : JSON.stringify({}),
                //     contentType: "application/json",
                //     success: function (result) {
                //         console.log(result);
                //         console.log("=============================");
                //     }.bind(this),
                //     error: function(e){
                //         // oViewParam.setBusy(false);
                //         console.log("error", e);
                //         // MessageBox.error(JSON.parse(e.responseText).error.details[0].message);
                //     }
                // });
            }
		});
	});
