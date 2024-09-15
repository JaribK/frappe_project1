# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BillboardLand(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		district: DF.Data
		id: DF.Data
		latitude: DF.Data | None
		longitude: DF.Data | None
		moo: DF.Data
		no: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		postal_code: DF.Data
		province: DF.Data
		road: DF.Data
		soi: DF.Data
		sub_district: DF.Data
	# end: auto-generated types

	pass
