# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BillboardDocument(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from maechan.billboard.doctype.billboard_data.billboard_data import BillboardData
		from maechan.billboard.doctype.billboard_land.billboard_land import BillboardLand

		data_billboards: DF.Table[BillboardData]
		land: DF.Table[BillboardLand]
		no_reciept: DF.Data | None
		owner_cid: DF.Data | None
		owner_name: DF.Data | None
		research_by: DF.Data | None
		status: DF.Literal["\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07\u0e41\u0e25\u0e49\u0e27", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01\u0e41\u0e25\u0e49\u0e27"]
		total_price: DF.Int
	# end: auto-generated types

     
	def before_save(self):
    		calculate_billboard_prices(self)

def calculate_billboard_prices(doc):
    for row in doc.data_billboards:
        if row.width and row.height:
            price = (((row.width * row.height) / 500) * 3)
            row.price = round(price, 2)
        else:
            row.price = 0