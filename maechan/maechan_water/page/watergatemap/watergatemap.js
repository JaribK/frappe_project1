frappe.pages['watergatemap'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Water Gate Map',
		single_column: true
	});

	$(page.body).append('<div id="watergate_app"></div>')

	frappe.require(['watergate.bundle.js']).then(() => {
		// housemap.bundle.js is now loaded
	  })
}