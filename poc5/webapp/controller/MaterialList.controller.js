sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("poc5.controller.MaterialList", {
			onInit: function () {

            },
            onGetTest: function (oEvent) {
                console.log(oEvent);
                // $.ajax({
                //     url: sUrlParam,
                //     type: "POST",
                //     data : JSON.stringify(oSendDataParam),
                //     contentType: "application/json",
                //     success: fSuccessParam,
                //     error: function(e){
                //         oViewParam.setBusy(false);
                //         console.log("error", e);
                //         MessageBox.error(JSON.parse(e.responseText).error.message);
                //     }
                // });
            }
		});
	});
