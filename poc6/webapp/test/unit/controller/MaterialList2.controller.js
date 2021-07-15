/*global QUnit*/

sap.ui.define([
	"btppoc./poc6/controller/MaterialList2.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MaterialList2 Controller");

	QUnit.test("I should test the MaterialList2 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
