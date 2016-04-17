(function () {
	'use strict';

	angular.module('energyForecast').controller('GradientDescentCtrl', GradientDescentCtrl);

	GradientDescentCtrl.inject = ['$scope', 'gradientDescentLinearModelService', '$http', 'utilsService', '$q', 'gradientDescentPolynomialModel', 'test', '$sce'];

	function GradientDescentCtrl ($scope, gradientDescentLinearModelService, $http, utilsService, $q, gradientDescentPolynomialModel, test, $sce) {	
		var viewModel = this;

		$scope.countries = ["World", "OECD", "G7", "BRICS", "Europe", "European Union", "Belgium", "Czech Rep.", "France", "Germany", "Italy", "Netherlands", "Poland", "Portugal", "Romania", "Spain", "Sweden", "United Kingdom", "Norway", "Turkey", "CIS", "Kazakhstan", "Russia", "Ukraine", "Uzbekistan", "America", "North America", "Canada", "United States", "Latin America", "Argentina", "Brazil", "Chile", "Colombia", "Mexico", "Venezuela", "Asia", "China", "India", "Indonesia", "Japan", "Malaysia", "South Korea", "Taiwan", "Thailand", "Pacific", "Australia", "New Zealand", "Africa", "Algeria", "Egypt", "Nigeria", "South Africa", "Middle-East", "Iran", "Kuwait", "Saudi Arabia", "United Arab Emirates"];

		$scope.energyTypes = [{
			"value": "electricity",
			"displayName": "Electricity",
			"unitOfMeasurement": "TWh"
		},{
			"value": "coal_lignite",
			"displayName": "Coal and Lignite",
			"unitOfMeasurement": "Mt"
		},{
			"value": "crude_oil",
			"displayName": "Crude oil",
			"unitOfMeasurement": "Mt"
		},{
			"value": "oil_products",
			"displayName": "Oil Products",
			"unitOfMeasurement": "Mt"
		},{
			"value": "natural_gas",
			"displayName": "Natural gas",
			"unitOfMeasurement": "bcm"
		}];

		$scope.fromIndex = 1995;
		$scope.toIndex = 2005;
		$scope.chartData = [];
		$scope.haveData = false;
		$scope.iterationsLimit = 100000;
		$scope.learningRate = 0.0001;

		$scope.polynomialSentence = "w<sub>0</sub>";

		$sce.trustAsHtml($scope.polynomialSentence);

		$scope.constructPolynomialSentence = function () {
			$scope.polynomialSentence = "w<sub>0</sub>";

			for (var i = 1; i < $scope.polynomialOptions.length; i++) {
				if ($scope.polynomialOptions[i].selected) {
					$scope.polynomialSentence += " + w<sub>" + $scope.polynomialOptions[i].power + "</sub> * x";

					if ($scope.polynomialOptions[i].power > 1) {
						$scope.polynomialSentence += "<sup>" + $scope.polynomialOptions[i].power + "</sup>"
					}
				}
			}

			$sce.trustAsHtml($scope.polynomialSentence);
		};

		$scope.parseData = function (data) {
			var filteredCSVData = utilsService.csvToArray(data, ",");
			var energyDataForSelection = [];

			angular.forEach(filteredCSVData, function (data) {
				if (data[0] == viewModel.countrySelection) {
					// Slice the 25 data points following country name
					energyDataForSelection = data.slice(1, 26);
				}
			});

			var parsedEnergyDataForSelection = [];
			angular.forEach(energyDataForSelection, function (item) {
				parsedEnergyDataForSelection.push(parseInt(item));
			});

			var slicedDataForYears = parsedEnergyDataForSelection.slice($scope.fromIndex - 1990, $scope.toIndex - 1990 + 1);

			var yearIndex = $scope.fromIndex;
			
			var dataReadyForGradientDescent = slicedDataForYears.map(function(element) {
				return {
					"value": element,
					"year": yearIndex++
				};
			});

			return dataReadyForGradientDescent;
		};

		$scope.resetPolynomial = function () {
			angular.forEach($scope.polynomialOptions, function (item) {
				item.weight = 0;
			});
		};

		$scope.process = function () {

			if ($scope.regressionType === "linear") {
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
			} else if ($scope.regressionType === "polynomial") {
				$scope.resetPolynomial();
				gradientDescentPolynomialModel.run($scope.polynomialOptions, $scope.prodData, $scope.learningRate, $scope.iterationsLimit);

				var productionGradientDescentPlot = [];
				angular.forEach($scope.chartLabels, function (item) {
					var x = item - 1990, 
						total = 0;

					angular.forEach($scope.polynomialOptions, function (option) {
						if (option.selected) {
							total += option.weight * Math.pow(x, option.power);
						}
					});

					productionGradientDescentPlot.push(total);
				});


				$scope.resetPolynomial();
				gradientDescentPolynomialModel.run($scope.polynomialOptions, $scope.consData, $scope.learningRate, $scope.iterationsLimit);

				var consumptionGradientDescentPlot = [];
				angular.forEach($scope.chartLabels, function (item) {
					var x = item - 1990, 
						total = 0;

					angular.forEach($scope.polynomialOptions, function (option) {
						if (option.selected) {
							total += option.weight * Math.pow(x, option.power);
						}
					});

					consumptionGradientDescentPlot.push(total);
				});
			}

			if ($scope.chartData.length === 4) {
				$scope.chartData[2] = productionGradientDescentPlot;
				$scope.chartData[3] = consumptionGradientDescentPlot;
			} else {
				$scope.chartData.push(productionGradientDescentPlot);
				$scope.chartData.push(consumptionGradientDescentPlot);
			}

			$scope.series = ['Production', 'Consumption', 'Gradient Descent Production', 'Gradient Descent Consumption'];

			

			// // TESTSTSTSTSTSTSTS

			// var prodResult = test.run(0, 0, 0, $scope.prodData, 0.000001, 100000);

			// // var consResult = test.run(0, 0, 0, $scope.consData, 0.0001, 10);

			// var productionGradientDescentPlot = [];
			// angular.forEach($scope.chartLabels, function (item) {
			// 	productionGradientDescentPlot.push(prodResult[0] + prodResult[1] * (item - 1990) + prodResult[2] * Math.pow(item-1990, 2));
			// });

			// // var consumptionGradientDescentPlot = [];
			// // angular.forEach($scope.chartLabels, function (item) {
			// // 	consumptionGradientDescentPlot.push(consResult[0] + consResult[1] * (item - 1990) + Math.pow(consResult[2],2) * (item-1990));
			// // });

			// if ($scope.chartData.length === 4) {
			// 	$scope.chartData[2] = productionGradientDescentPlot;
			// 	//$scope.chartData[3] = consumptionGradientDescentPlot;
			// } else {
			// 	$scope.chartData.push(productionGradientDescentPlot);
			// 	//$scope.chartData.push(consumptionGradientDescentPlot);
			// }

			
		};

		$scope.showData = function () {
			$scope.chartLabels = utilsService.getLabelsForChart($scope.fromIndex - 1990);

			$q.all([
				$http.get("./csv/" + viewModel.energyType.value + "_production.csv"),
				$http.get("./csv/" + viewModel.energyType.value + "_consumption.csv")
			]).then(function(response) {
				$scope.prodData = $scope.parseData(response[0].data);

				$scope.consData = $scope.parseData(response[1].data);

				$scope.chartData = utilsService.getDataForChart($scope.prodData, $scope.consData);
			});
			$scope.series = ['Production', 'Consumption'];
			$scope.haveData = true;
		};

		$scope.polynomialOptions = [
			{
				"name": "bias",
				"selected": true,
				"power": 0,
				"weight": 0,
				"visible": false
			},
			{
				"name": "x",
				"value": "x",
				"power": 1,
				"selected": false,
				"weight": 0,
				"visible": true
			},
			{
				"name": "xSquare",
				"value": "x",
				"power": 2,
				"selected": false,
				"weight": 0,
				"visible": true
			},
			{
				"name": "xCube",
				"value": "x",
				"power": 3,
				"selected": false,
				"weight": 0,
				"visible": true
			},
			{
				"name": "xToTheFourth",
				"value": "x",
				"power": 4,
				"selected": false,
				"weight": 0,
				"visible": true
			}
		];

		
	};
})();