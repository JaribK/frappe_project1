// Copyright (c) 2024, SE and contributors
// For license information, please see license.txt


let today = new Date()
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let format = `${year}-${month}-${day}`

frappe.query_reports["LicenseStatusReport2"] = {
	"filters": [
		{
            fieldname: 'start_date',
            label: __('Start Date'),
            fieldtype: 'Date',
			default : null
        },

		{
            fieldname: 'end_date',
            label: __('End Date'),
            fieldtype: 'Date',
			default : null
        },

	]
};
