# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class LicenseGroup(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.maechan_core.doctype.licensetypedetail.licensetypedetail import LicenseTypeDetail

		details: DF.Table[LicenseTypeDetail]
		status: DF.Literal["\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19", "\u0e2d\u0e22\u0e39\u0e48\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e1e\u0e31\u0e12\u0e19\u0e32"]
		template: DF.HTMLEditor | None
		template_2: DF.HTMLEditor | None
		template_3: DF.HTMLEditor | None
		template_4: DF.HTMLEditor | None
		template_5: DF.HTMLEditor | None
		template_6: DF.HTMLEditor | None
		template_7: DF.HTMLEditor | None
		template_warning: DF.HTMLEditor | None
		title: DF.Data | None
	# end: auto-generated types

	pass
