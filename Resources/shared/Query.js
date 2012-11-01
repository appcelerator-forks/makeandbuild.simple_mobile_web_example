var Lib = require("shared/Lib");

var invokeRemoteCall = function(url, successCallback) {
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
			// this function is called when data is returned from the server and available for use
	        // this.responseText holds the raw text return of the message (used for text/JSON)
	        // this.responseXML holds any returned XML (including SOAP)
	        // this.responseData holds any returned binary data
	        //Ti.API.debug(this.responseText);
	        successCallback(JSON.parse(this.responseText));
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
	        Ti.API.debug(e.error);
	        alert('error');
	    }
	});
	xhr.open("GET", url);
	xhr.send();
}

exports.localEvents = function(zipCode, successCallback) {
	var url = Lib.getShowInfoUrl(zipCode);
	invokeRemoteCall(url, successCallback);	
};

exports.findArtist = function(artistName, successCallback) {
	var url = Lib.getArtistIdUrl(artistName);
	invokeRemoteCall(url, successCallback);
};

exports.songsForArtist = function(artistId, successCallback) {
	var url = Lib.getSongListUrl(artistId);
	invokeRemoteCall(url, successCallback);
};
