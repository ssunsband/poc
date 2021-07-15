/*global QUnit*/

sap.ui.define([
	"poc7/controller/MarasList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MarasList Controller");

	QUnit.test("I should test the MarasList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
