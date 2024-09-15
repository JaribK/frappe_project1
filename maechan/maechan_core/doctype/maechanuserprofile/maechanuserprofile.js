// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on("MaechanUserProfile", {
	refresh(frm) {

        if(frm.is_new()){
            frm.set_value('signature_owner',frappe.session.user)
        }
	},
});
