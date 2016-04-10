(function () {
	'use strict';

	angular.module('energyForecast').controller('GradientDescentCtrl', GradientDescentCtrl);

	GradientDescentCtrl.inject = ['$scope', 'gradientDescentLinearModelService', '$http', 'utilsService', '$q'];

	function GradientDescentCtrl ($scope, gradientDescentLinearModelService, $http, utilsService, $q) {	
		var viewModel = this;

		$scope.countries = ["World", "OECD", "G7", "BRICS", "Europe", "European Union", "Belgium", "Czech Rep.", "France", "Germany", "Italy", "Netherlands", "Poland", "Portugal", "Romania", "Spain", "Sweden", "United Kingdom", "Norway", "Turkey", "CIS", "Kazakhstan", "Russia", "Ukraine", "Uzbekistan", "America", "North America", "Canada", "United States", "Latin America", "Argentina", "Brazil", "Chile", "Colombia", "Mexico", "Venezuela", "Asia", "China", "India", "Indonesia", "Japan", "Malaysia", "South Korea", "Taiwan", "Thailand", "Pacific", "Australia", "New Zealand", "Africa", "Algeria", "Egypt", "Nigeria", "South Africa", "Middle-East", "Iran", "Kuwait", "Saudi Arabia", "United Arab Emirates"];

		$scope.fromIndex = 1995;
		$scope.toIndex = 2005;
		$scope.chartData = [];
		$scope.haveData = false;

		$scope.parseData = function (data) {
			var filteredCSVData = utilsService.csvToArray(data, ",");
			var energyDataForSelection = [];

			angular.forEach(filteredCSVData, function (data) {
				if (data[0] == viewModel.countrySelection) {
					energyDataForSelection = data.slice(1, 26);
				}
			});

			var parsedEnergyDataForSelection = [];
			angular.forEach(energyDataForSelection, function (item) {
				parsedEnergyDataForSelection.push(parseInt(item));
			});

			var slicedDataForYears = parsedEnergyDataForSelection.slice($scope.fromIndex - 1990, $scope.toIndex - 1990 + 1);

			var yearIndex = 1990;
			
			var dataReadyForGradientDescent = slicedDataForYears.map(function(element) {
				return {
					"value": element,
					"year": yearIndex++
				};
			});

			return dataReadyForGradientDescent;
		};

		$scope.process = function () {

			var prodResult = gradientDescentLinearModelService.run(0, 0, $scope.prodData, 0.0001, 100000);

			var consResult = gradientDescentLinearModelService.run(0, 0, $scope.consData, 0.0001, 100000);

			var productionGradientDescentPlot = [];
			angular.forEach($scope.chartLabels, function (item) {
				productionGradientDescentPlot.push(prodResult[0] + prodResult[1] * (item - 1990));
			});

			var consumptionGradientDescentPlot = [];
			angular.forEach($scope.chartLabels, function (item) {
				consumptionGradientDescentPlot.push(consResult[0] + consResult[1] * (item - 1990));
			});

			if ($scope.chartData.length === 4) {
				$scope.chartData[2] = productionGradientDescentPlot;
				$scope.chartData[3] = consumptionGradientDescentPlot;
			} else {
				$scope.chartData.push(productionGradientDescentPlot);
				$scope.chartData.push(consumptionGradientDescentPlot);
			}
		
			$scope.series = ['Production', 'Consumption', 'Gradient Descent Production', 'Gradient Descent Consumption'];
		};

		$scope.showData = function () {
			$scope.chartLabels = utilsService.getLabelsForChart();

			$q.all([
				$http.get("./csv/electricity_production.csv"),
				$http.get("./csv/electricity_consumption.csv")
			]).then(function(response) {
				$scope.prodData = $scope.parseData(response[0].data);

				$scope.consData = $scope.parseData(response[1].data);

				$scope.chartData = utilsService.getDataForChart($scope.prodData, $scope.consData);
			});
			$scope.series = ['Production', 'Consumption'];
			$scope.haveData = true;
		};
	};
})();