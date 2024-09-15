# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Land(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        block_id: DF.Data | None
        district_id: DF.Link | None
        geojson: DF.JSON
        land_owner: DF.Data | None
        land_size: DF.Data | None
        land_type: DF.Data | None
        lat: DF.Float
        lng: DF.Float
        lot: DF.Data | None
        parcel_cod: DF.Data | None
        parcel_no: DF.Data | None
        zone_id: DF.Data | None
    # end: auto-generated types

    
    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        geojson: DF.JSON | None
        lat : DF.Float
        lng : DF.Float
        lot : DF.Data
        parcel_no : DF.Data
        zone_id : DF.Data
        block_id : DF.Data
        land_owner : DF.Data
        land_size : DF.Data
        land_type : DF.Data
    
    pass
