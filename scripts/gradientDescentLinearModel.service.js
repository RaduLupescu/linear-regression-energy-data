(function () {
	'use strict';

	angular.module('energyForecast').factory('gradientDescentLinearModelService', [function() {
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

		function stepGradient (w0, w1, points, learningRate) {
			var w0_gradient = 0,
				w1_gradient = 0,
				x, y,
				N = points.length;

			for (var i = 0; i < N; i++) {
				x = points[i].year - 1990;
				y = points[i].value;
				w0_gradient += -(2/N) * (y - ((w1 * x) + w0));
				w1_gradient += -(2/N) * x * (y - ((w1 * x) + w0));
			}

			var new_w0 = w0 - (learningRate * w0_gradient);
			var new_w1 = w1 - (learningRate * w1_gradient);

			return [new_w0, new_w1];
		};

		function runGradientDescent (w0, w1, points, learningRate, iterationsLimit) {
			var i = 0,
				weights = [w0, w1],
				oldWeights = [-1, -1];

			console.log("Running gradient descent");
			while (i < iterationsLimit) {
				weights = stepGradient(weights[0], weights[1], points, learningRate);
				i++;
			}

			console.log("Finished running gradient descent after", i, "iterations");

			return weights;
		};

		function run (w0, w1, points, learningRate, iterationsLimit) {
			console.log("Starting at w0=",w0, "and w1=", w1);
			console.log("Learning rate is set at", learningRate);

			console.log("Error at start is", computeError(w0, w1, points));

			var result = runGradientDescent(w0, w1, points, learningRate, iterationsLimit);

			console.log("Finished with w0=", result[0], "and w1=", result[1]);
			console.log("Error at end is", computeError(result[0], result[1], points));

			return result;
		};
	}])
})();