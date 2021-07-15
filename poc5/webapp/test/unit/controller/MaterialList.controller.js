/*global QUnit*/

sap.ui.define([
	"poc5/controller/MaterialList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MaterialList Controller");

	QUnit.test("I should test the MaterialList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
