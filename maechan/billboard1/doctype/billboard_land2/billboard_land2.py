# Copyright (c) 2024, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class BillboardLand2(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		district: DF.Data | None
		geojson: DF.JSON | None
		land_id: DF.Data | None
		latitude: DF.Data | None
		longitude: DF.Data | None
		moo: DF.Data | None
		no: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		postal_code: DF.Data | None
		province: DF.Data | None
		road: DF.Data | None
		soi: DF.Data | None
		sub_district: DF.Data | None
	# end: auto-generated types

	pass
