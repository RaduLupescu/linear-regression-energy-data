(function () {
	'use strict';

	angular.module('energyForecast', ['rzModule', 'ngSanitize', 'chart.js', 'ui.bootstrap', 'ui.select']).config(['ChartJsProvider', function (ChartJsProvider) {
		// Configure all charts
		ChartJsProvider.setOptions({
			colours: ['#FF5252', '#FF8A80'],
			responsive: false
		});

		// Configure all line charts
		ChartJsProvider.setOptions('Line', {
			datasetFill: false
		});
	}]);
})();