ActiveNavigation = {
	bootstrap: function() {
		this.create_main_menu();
		this.create_sub_menus();
		this.attach_events();
	},
	create_main_menu: function() {
		chrome.contextMenus.removeAll();
		chrome.contextMenus.create({
			id: 'active_navigation_content_menu',
			title: 'Active Navigation',
			contexts: ['page']
		});
		return this;
	},
	create_sub_menus: function() {
		chrome.tabs.query({}, function(tabs) {
			var tabs_length = tabs.length;
			for (var i = 0; i < tabs_length; i++) {
				var tab = tabs[i];
				var context_menu_item = {
					id: "" + tab.id,
					title: tab.title,
					parentId: "active_navigation_content_menu",
				}
				if (tab.highlighted && tab.selected && tab.active) {
					context_menu_item.type = "checkbox";
					context_menu_item.checked = true;
				}
				chrome.contextMenus.create(context_menu_item);
			}
		});
		return this;
	},
	attach_events: function() {
		this.attach_context_menu_item_clicked();
		this.attach_tab_highlighted();
	},
	attach_context_menu_item_clicked: function() {
		chrome.contextMenus.onClicked.addListener(function(info, tab) {
			chrome.tabs.update(parseInt(info.menuItemId), {highlighted: true});
		});
	},
	attach_tab_highlighted: function() {
		chrome.tabs.onHighlighted.addListener(function(tab) {
			ActiveNavigation.create_main_menu().create_sub_menus();
		});
	}
}

ActiveNavigation.bootstrap();
