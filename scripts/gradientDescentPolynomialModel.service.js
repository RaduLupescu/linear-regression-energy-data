(function () {
	'use strict';

	angular.module('energyForecast').factory('gradientDescentPolynomialModel', [function() {
		return {
			run: run
		};


		function computeError (w0, w1, points) {
			var totalError = 0,
				error,
				x, y;

			for (var i = 0; i < points.length; i++) {
				x = points[i].year - 1990;
				y = points[i].value;
				error = y - (w1 * x + w0);
				totalError += Math.pow(error, 2);
			}

			return totalError/points.length;
		};

		function getError (polynomial, x, y) {
			var forecasted_y = 0;

			angular.forEach(polynomial, function (item) {
				forecasted_y += item.weight * Math.pow(x, item.power);
			});

			return y - forecasted_y;
		};

		function stepGradient (selection, points, learningRate) {
			var gradients = [0, 0, 0, 0, 0],
				error,
				x, y,
				N = points.length;

			for (var i = 0; i < N; i++) {
				x = points[i].year - 1990;
				y = points[i].value;

				// Calculate each gradient
				for (var j = 0; j < selection.length; j++) {
					error = getError(selection, x, y);

					gradients[j] += -(1/N) * error * Math.pow(x, selection[j].power);
				}
			}

			for (var i = 0; i < selection.length; i++) {
				selection[i].weight = selection[i].weight - (learningRate * gradients[i]);
			}
		};

		function runGradientDescent (selection, points, learningRate, iterationsLimit) {
			var i = 0;

			console.log("Running gradient descent");
			while (i < iterationsLimit) {
				stepGradient(selection, points, learningRate);
				i++;
			}

			console.log("Finished running gradient descent after", i, "iterations");
		};

		function run (polynomial, points, learningRate, iterationsLimit) {
			var selection = polynomial.filter(function(item) {
				return item.selected;
			});

			console.log(selection);

			runGradientDescent(selection, points, learningRate, iterationsLimit);
		};
	}])
})();