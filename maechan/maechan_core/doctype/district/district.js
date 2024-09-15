// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on('District', {
	refresh(frm) {
		// your code here
	},
	
	async tambon_id (frm){
	   // console.log(frm.doc.tambon_id)
	    let tambonDoc = await frappe.db.get_doc('Tambon', frm.doc.tambon_id);
	   // console.log(tambonDoc)
	   frm.set_value({
	       'amphure_id' : tambonDoc.amphure_id,
	       'province_id' : tambonDoc.province_id
	   });
	}
})