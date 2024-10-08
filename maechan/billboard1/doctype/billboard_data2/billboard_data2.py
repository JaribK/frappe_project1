# Copyright (c) 2024, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BillboardData2(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		height: DF.Float
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		picture: DF.Attach
		price: DF.Float
		type_of_billboards: DF.Literal["\u0e1b\u0e49\u0e32\u0e22\u0e2d\u0e31\u0e01\u0e29\u0e23\u0e44\u0e17\u0e22\u0e25\u0e49\u0e27\u0e19", "\u0e1b\u0e49\u0e32\u0e22\u0e2d\u0e31\u0e01\u0e29\u0e23\u0e44\u0e17\u0e22,\u0e2d\u0e31\u0e07\u0e01\u0e24\u0e29,\u0e1b\u0e19\u0e20\u0e32\u0e1e,\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22", "\u0e1b\u0e49\u0e32\u0e22\u0e44\u0e21\u0e48\u0e21\u0e35\u0e2d\u0e31\u0e01\u0e29\u0e23\u0e44\u0e17\u0e22", "\u0e1b\u0e49\u0e32\u0e22\u0e17\u0e35\u0e48\u0e41\u0e01\u0e49\u0e44\u0e02 \u0e02\u0e49\u0e2d\u0e04\u0e27\u0e32\u0e21,\u0e23\u0e39\u0e1b,\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22(\u0e08\u0e48\u0e32\u0e22\u0e41\u0e25\u0e49\u0e27)"]
		width: DF.Float
	# end: auto-generated types
	pass

