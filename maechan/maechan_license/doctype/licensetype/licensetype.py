# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class LicenseType(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.maechan_license.doctype.licensetypedetail.licensetypedetail import LicenseTypeDetail

		details: DF.Table[LicenseTypeDetail]
		group: DF.Link
		license_type: DF.Literal["\u0e43\u0e1a\u0e2d\u0e19\u0e38\u0e0d\u0e32\u0e15", "\u0e2b\u0e19\u0e31\u0e07\u0e2a\u0e37\u0e2d\u0e23\u0e31\u0e1a\u0e23\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e41\u0e08\u0e49\u0e07"]
		rule_year: DF.Data | None
		title: DF.Text
	# end: auto-generated types

	pass


@frappe.whitelist()
def get(name=None) :
    
    if name :
        licenseTypeDoc = frappe.get_doc("LicenseType",name)
        return licenseTypeDoc
        pass
    else :
        frappe.response['http_status_code'] = 400
        frappe.response['error']  = "params name is required"
        return 'error'
    