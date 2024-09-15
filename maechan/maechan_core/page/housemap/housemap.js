frappe.pages['housemap'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'รายงานแผนที่ประจำบ้าน',
		single_column: true
	});

	$(page.body).append('<div id="housemap_app"></div>')

	frappe.require(['housemap.bundle.js']).then(() => {
		// housemap.bundle.js is now loaded
	  })

}


  

