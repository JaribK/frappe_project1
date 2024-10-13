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

		billboard_status: DF.Literal["\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07\u0e41\u0e25\u0e49\u0e27", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01\u0e41\u0e25\u0e49\u0e27"]
		data_billboards: DF.Table[BillboardData2]
		is_doctype_copy: DF.Literal["true", "false"]
		land_id: DF.Link | None
		lat: DF.Float
		lng: DF.Float
		moo: DF.Data | None
		no_receipt: DF.Data | None
		owner_cid: DF.Data | None
		owner_name: DF.Data | None
		payment_status: DF.Literal["\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e08\u0e48\u0e32\u0e22", "\u0e08\u0e48\u0e32\u0e22\u0e41\u0e25\u0e49\u0e27"]
		research_by: DF.Data | None
		total_price: DF.Float
	# end: auto-generated types

	def before_save(self):
          calculate_billboard_prices(self)
          cal_total_price(self)
          true_moo(self)

def calculate_billboard_prices(doc):
    for row in doc.data_billboards:
        if row.width and row.height:
            price = (((row.width * row.height) / 500) * 3)
            row.price = round(price, 2)
        else:
            row.price = 0
            
def cal_total_price(doc):
    total_price_cal = 0
    for row in doc.data_billboards:
        total_price_cal += row.price

    doc.total_price = total_price_cal

def true_moo(doc):
    if int(doc.moo) >= 6 and int(doc.moo) < 8:
        tmoo = int(doc.moo) + 1
        doc.moo = str(tmoo)

