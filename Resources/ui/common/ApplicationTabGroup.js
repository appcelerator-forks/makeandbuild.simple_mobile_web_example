function ApplicationTabGroup(Window) {
	var Query = require("shared/Query");
	
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new Window(L('local_shows'), L('shows_loading')),
		win2 = new Window(L('songs_by_artist'), L('songs_loading'));
		
	var loadLocalShows = function() {
		Query.localEvents("30066", function(json) {
			var counter = 0;
			var data = [];
			if (json.hasOwnProperty("length") && json.shift) {
				for (; counter < json.length; counter++) {
					var nextElement = json.shift()[0];
					
					data.push(createEventTableRow(nextElement));
				}
			}
			win1.tableView.setData(data);
			
		    
			win1.tableView.addEventListener('click', function(e) {
				rowClicked(e.rowData.eventTitle);
				if (e.rowData.eventLat) {
					displayMap(win1, e.rowData.eventVenue, e.rowData.eventLat, e.rowData.eventLong);	
				}	
			});
		});
	};
		
    var createSongTableRow = function(nextSong) {
    	var songTitle = nextSong["name"];
    	var songAlbum = nextSong["album"] || {};
    	var albumTitle = songAlbum["name"] || "";
    	
 		var updateRow = Ti.UI.createTableViewRow({layout: 'vertical'});
		updateRow.selectedBackgroundColor = '#13386c';

		var songText = Ti.UI.createLabel({
			color:'#000',
			left: 10,
			top: 10,
			font:{fontSize:15, fontWeight:'bold'},
			text:songTitle, 
			width:'auto',
			height:'auto'
		});
		updateRow.add(songText);
		
		if (albumTitle !== '') {
			var albumText = Ti.UI.createLabel({
				top: 10,
				left: 15,
				bottom: 10,
				font: {fontSize: 10 },
				text: albumTitle,
				width: 'auto',
				height: 'auto'
			});
			updateRow.add(albumText);		
		}
		updateRow.className = 'song_row';
		return updateRow;
   	
    };
    
    var rowClicked = function(eventTitle) {
			Query.findArtist(eventTitle, function(json) {
				//Ti.API.debug("artistFound = " + JSON.stringify(json));
				var artistData = json["artist"];
				
				var id = artistData["id"];
				var name = artistData["name"];
				
				if (name === eventTitle) {
					Query.songsForArtist(id, function(songJson) {
						var trackCounter = 0;
						//Ti.API.debug("song info = " + JSON.stringify(songJson));
						
						var tracks = songJson["tracks"] || [];
						var data = [];
						for (; trackCounter < tracks.length; trackCounter++) {
							//Ti.API.debug("data.length = " + data.length);
							data.push(createSongTableRow(tracks[trackCounter]));
						}
						win2.tableView.setData(data);
					});
				} else {
					var data = [{title: 'Data missing for ' + eventTitle}];
					win2.tableView.setData(data);
				}		
			});	
    };
    
    var displayMap = function(win, eventVenue, eventLat, eventLong) {
		var newWindow = Ti.UI.createWindow({
			title: eventVenue,
			backgroundColor: 'white'
		});
		 var mapView = Titanium.Map.createView({
			 mapType: Titanium.Map.STANDARD_TYPE,
			region:{latitude: eventLat, longitude: eventLong, latitudeDelta:0.5, longitudeDelta:0.5},
			animate:true,
			regionFit:true,
			annotations: [Ti.Map.createAnnotation({latitude: eventLat, longitude: eventLong, title: eventVenue})],
			userLocation:true	
		 });
		newWindow.add(mapView);
		win.containingTab.open(newWindow);
    };
		
    var createEventTableRow = function(nextEvent) {
		var eventDate = nextEvent["event_date"];
		var eventTitle = nextEvent["event_title"];
		var eventVenue = nextEvent["venue_name"]; 
		
		var eventLat = parseFloat(nextEvent["lat"]);
		var eventLong = parseFloat(nextEvent["lon"]);
		
		var displayAsLabel = (eventLat == 0);
		
		var eventId = nextEvent["event_id"];
		
        var updateRow = {
        	title: eventTitle + "(" + eventDate + ") @ " + eventVenue,
        	hasChild: !displayAsLabel,
        	eventTitle: eventTitle,
        	eventVenue: eventVenue, 
        	eventLat: eventLat, 
        	eventLong: eventLong
        }
        
		return updateRow; 
   };	
		
	var tab1 = Ti.UI.createTab({
		title: L('local_shows'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('songs_by_artist'),
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	self.addTab(tab1);
	self.addTab(tab2);
	
	setTimeout(loadLocalShows, 200);
	
	return self;
};

module.exports = ApplicationTabGroup;
