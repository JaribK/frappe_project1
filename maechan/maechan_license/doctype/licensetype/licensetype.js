// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on("LicenseType", {
	refresh(frm) {
	},
	group(frm) {
		frm.clear_table("details")

        frappe.db.get_doc("LicenseGroup", frm.doc.group)
            .then(r => {

                r.details.forEach(x => {
                    // console.log(x)

                    extraDetails = frm.add_child("details");
                    extraDetails.key = x.key
					extraDetails.datetype = x.datetype
					extraDetails.options = x.options
                })

                frm.refresh_fields("details");
            })
	}
});
