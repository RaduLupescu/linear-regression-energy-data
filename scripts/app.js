(function () {
	'use strict';

	angular.module('energyForecast', ['rzModule', 'ngSanitize', 'chart.js', 'ui.bootstrap', 'ui.select']).config(['ChartJsProvider', function (ChartJsProvider) {
		// Configure all charts
		ChartJsProvider.setOptions({
			colours: ['#FF5252', '#E0AB01','#FF8A80', '#BFBD6E'],
			responsive: false,
			scaleFontColor: "#FFF",
			scaleLineColor: "#666"
		});

		// Configure all line charts
		ChartJsProvider.setOptions('Line', {
			datasetFill: false
		});
	}]);
})();