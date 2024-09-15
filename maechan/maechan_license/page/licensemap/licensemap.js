frappe.pages['licensemap'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'รายงานแผนที่ใบอนุญาต',
		single_column: true
	});

	$(page.body).append('<div id="licensemap_app"></div>')

	frappe.require(['licensemap.bundle.js']).then(() => {
		// housemap.bundle.js is now loaded
	  })

}