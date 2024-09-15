frappe.pages['landmap'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'รายงานแผนที่แปลงที่ดิน',
		single_column: true
	});

	$(page.body).append('<div id="landmap_app"></div>')

	frappe.require(['landmap.bundle.js']).then(() => {
		// housemap.bundle.js is now loaded
	  })

}


  

