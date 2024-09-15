frappe.pages['thedsaban-profile'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: frappe.session.user,
		single_column: true,
	});

	$(page.body).append('<div id="maechan_app"></div>')

	frappe.require(['thedsaban_profile.bundle.js',]).then(() => {
		// housemap.bundle.js is now loaded
	  })

}