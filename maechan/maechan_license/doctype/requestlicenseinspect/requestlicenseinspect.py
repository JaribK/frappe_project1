# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RequestLicenseInspect(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.maechan_license.doctype.checklist.checklist import CheckList
		from maechan.maechan_license.doctype.checklistdetail.checklistdetail import CheckListDetail

		amended_from: DF.Link | None
		checklist_comment: DF.SmallText | None
		checklist_date: DF.Date | None
		checklist_extra: DF.Table[CheckListDetail]
		checklist_list: DF.Table[CheckList]
		checklist_result: DF.Literal["-", "\u0e1c\u0e48\u0e32\u0e19", "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19"]
		request_license: DF.Link | None
	# end: auto-generated types

	pass
@frappe.whitelist()
def get_requestlicenseinspect() :
	name = frappe.form_dict['name']
	if name :
		doc = frappe.get_doc("RequestLicenseInspect",name)
		owner = frappe.get_doc("User",doc.owner)
		doc.owner = owner # type: ignore

		return doc
	else :
		frappe.response['http_status_code'] = 400
		return "error"
	

