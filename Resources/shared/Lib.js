var showHost = "PROXY_HOST_ADDRESS";
var artistSongHost = "PROXY_HOST_ADDRESS";
	
var getUrl = function(host, path) {
	return "http://" + host + "/" + path;
};

exports.getShowInfoUrl = function(zipCode) {
	return getUrl(showHost, "shows") + "?zips[]=" + zipCode;
};

exports.getArtistIdUrl = function(artist) {
	artist = artist || "";
	artist = escape(artist);
	return getUrl(artistSongHost, "bands") + "?artistName=" + artist; 
};

exports.getSongListUrl = function(artistId) {
	return getUrl(artistSongHost, "songs") + "?artistId=" + artistId;
};