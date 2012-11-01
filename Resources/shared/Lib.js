/*
Used NGINX to host the web with additional proxies configured at the address supplied below at 
lines 19 and 20.

	location /shows {
       proxy_pass      http://api.sonicliving.com/api/?&q=pop&key=SONIC_LIVING_API_KEY&radius=20&$args;
    }

    location /bands {
       proxy_pass     http://api.emusic.com/artist/info?apiKey=EMUSIC_API_KEY&format=JSON&$args;
    }

    location /songs {
       proxy_pass     http://api.emusic.com/track/search?apiKey=EMUSIC_API_KEY&format=JSON&$args;
    }

*/

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