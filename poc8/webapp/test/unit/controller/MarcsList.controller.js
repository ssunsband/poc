/*global QUnit*/

sap.ui.define([
	"poc8/controller/MarcsList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MarcsList Controller");

	QUnit.test("I should test the MarcsList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
