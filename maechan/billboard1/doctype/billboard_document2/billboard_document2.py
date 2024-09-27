# Copyright (c) 2024, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BillboardDocument2(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.billboard1.doctype.billboard_data2.billboard_data2 import BillboardData2

		data_billboards: DF.Table[BillboardData2]
		land_id: DF.Link | None
		lat: DF.Data | None
		lng: DF.Data | None
		moo: DF.Data | None
		no_receipt: DF.Data | None
		owner_cid: DF.Data | None
		owner_name: DF.Data | None
		payment_status: DF.Literal["\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e08\u0e48\u0e32\u0e22", "\u0e08\u0e48\u0e32\u0e22\u0e41\u0e25\u0e49\u0e27"]
		research_by: DF.Data | None
		total_price: DF.Float
	# end: auto-generated types

	pass
