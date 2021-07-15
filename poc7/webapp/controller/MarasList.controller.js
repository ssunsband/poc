sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("poc7.controller.MarasList", {
			onInit: function () {

            },
            
            onGetList: function () {
                var oSubModel = this.getView().getModel("subModel");

                oSubModel.read("/Maras", {
                    success: function (result) {
                        console.log(result);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
		});
	});
