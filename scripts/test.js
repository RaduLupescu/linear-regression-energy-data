(function () {
	'use strict';

	angular.module('energyForecast').factory('test', [function() {
		return {
			run: run
		};


		function computeError (w0, w1, w2, points) {
			var totalError = 0,
				error,
				x, y;

			for (var i = 0; i < points.length; i++) {
				x = points[i].year - 1990;
				y = points[i].value;
				error = y - (w2 * Math.pow(x,2) + w1 * x + w0);
				totalError += Math.pow(error, 2);
			}

			return totalError/points.length;
		};

		function stepGradient (w0, w1, w2, points, learningRate) {
			var w0_gradient = 0,
				w1_gradient = 0,
				w2_gradient = 0,
				x1, x2, y,
				N = points.length;

			for (var i = 0; i < N; i++) {
				x1 = points[i].year - 1990;
				x2 = Math.pow(x1,2);
				y = points[i].value;

				w0_gradient += -(1/N) * (y - ((w2 * x2) + (w1 * x1) + w0));
				w1_gradient += -(1/N) * x1 * (y - ((w2 * x2) + (w1 * x1) + w0));
				w2_gradient += -(1/N) * x2 * (y - ((w2 * x2) + (w1 * x1) + w0));
			}

			var new_w0 = w0 - (learningRate * w0_gradient);
			var new_w1 = w1 - (learningRate * w1_gradient);
			var new_w2 = w2 - (learningRate * w2_gradient);
			//console.log([new_w0, new_w1, new_w2]);
			return [new_w0, new_w1, new_w2];
		};

		function runGradientDescent (w0, w1, w2, points, learningRate, iterationsLimit) {
			var i = 0,
				weights = [w0, w1, w2],
				oldWeights = [-1, -1];

			console.log("Running gradient descent");
			while (i < iterationsLimit) {
				weights = stepGradient(weights[0], weights[1], weights[2], points, learningRate);
				i++;
			}

			console.log("Finished running gradient descent after", i, "iterations");

			return weights;
		};

		function run (w0, w1, w2, points, learningRate, iterationsLimit) {
			console.log("Starting at w0=",w0, "and w1=", w1, "and w2=", w2);
			console.log("Learning rate is set at", learningRate);

			console.log("Error at start is", computeError(w0, w1, w2, points));

			var result = runGradientDescent(w0, w1, w2, points, learningRate, iterationsLimit);

			console.log("Finished with w0=", result[0], "and w1=", result[1], "w2=", result[2]);
			console.log("Error at end is", computeError(result[0], result[1], result[2], points));

			return result;
		};
	}])
})();