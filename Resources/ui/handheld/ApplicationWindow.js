function ApplicationWindow(title, loadingMsg) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
		
	// Create a TableView.
    var aTableView = Ti.UI.createTableView();
    	
	// Populate the TableView data.
	var data = [
		{title: loadingMsg},
	];
	aTableView.setData(data);
		
	// Add to the parent view.
	self.add(aTableView);
	
	self.tableView = aTableView;
		
	return self;
};

module.exports = ApplicationWindow;
