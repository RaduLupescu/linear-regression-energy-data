(function () {
	'use strict';

	angular.module('energyForecast').factory('utilsService', [function() {
		return {
			csvToArray: csvToArray,
			getLabelsForChart: getLabelsForChart,
			getDataForChart: getDataForChart
		};

		function csvToArray( strData, strDelimiter ){
	        // Check to see if the delimiter is defined. If not,
	        // then default to comma.
	        strDelimiter = (strDelimiter || ",");

	        // Create a regular expression to parse the CSV values.
	        var objPattern = new RegExp(
	            (
	                // Delimiters.
	                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

	                // Quoted fields.
	                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

	                // Standard fields.
	                "([^\"\\" + strDelimiter + "\\r\\n]*))"
	            ),
	            "gi"
	            );


	        // Create an array to hold our data. Give the array
	        // a default empty first row.
	        var arrData = [[]];

	        // Create an array to hold our individual pattern
	        // matching groups.
	        var arrMatches = null;


	        // Keep looping over the regular expression matches
	        // until we can no longer find a match.
	        while (arrMatches = objPattern.exec( strData )){

	            // Get the delimiter that was found.
	            var strMatchedDelimiter = arrMatches[ 1 ];

	            // Check to see if the given delimiter has a length
	            // (is not the start of string) and if it matches
	            // field delimiter. If id does not, then we know
	            // that this delimiter is a row delimiter.
	            if (
	                strMatchedDelimiter.length &&
	                strMatchedDelimiter !== strDelimiter
	                ){

	                // Since we have reached a new row of data,
	                // add an empty row to our data array.
	                arrData.push( [] );

	            }

	            var strMatchedValue;

	            // Now that we have our delimiter out of the way,
	            // let's check to see which kind of value we
	            // captured (quoted or unquoted).
	            if (arrMatches[ 2 ]){

	                // We found a quoted value. When we capture
	                // this value, unescape any double quotes.
	                strMatchedValue = arrMatches[ 2 ].replace(
	                    new RegExp( "\"\"", "g" ),
	                    "\""
	                    );

	            } else {

	                // We found a non-quoted value.
	                strMatchedValue = arrMatches[ 3 ];

	            }


	            // Now that we have our value string, let's add
	            // it to the data array.
	            arrData[ arrData.length - 1 ].push( strMatchedValue );
	        }

	        // Return the parsed data.
	        return( arrData );
	    };

	    function getLabelsForChart () {
			return [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
		};

		function getDataForChart (productionData, consumptionData) {
			var production = [],
				consumption = [];

			angular.forEach(productionData, function(item) {
				production.push(item.value);
			});

			angular.forEach(consumptionData, function(item) {
				consumption.push(item.value);
			});1
			1
			return [production, consumption];
		};
	}])
})();
