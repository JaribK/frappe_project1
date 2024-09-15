# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from maechan.maechan_core.doctype.district.district import District

class House(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        amphure_th: DF.Data | None
        district_id: DF.Link
        house_json: DF.JSON | None
        house_lat: DF.Float
        house_lng: DF.Float
        house_moo: DF.Data | None
        house_no: DF.Data
        house_road: DF.Data | None
        house_soi: DF.Data | None
        name: DF.Int | None
        province_th: DF.Data | None
        tambon_th: DF.Data | None
        text_display: DF.Data | None
    # end: auto-generated types
    

    
    
    def before_save(self) :
        doc = self
        if doc.district_id :
            district : District = frappe.get_doc("District",doc.district_id) # type: ignore
            
            doc.house_moo = district.moo
            doc.tambon_th = district.tambon_th
            doc.amphure_th = district.amphure_th
            doc.province_th = district.province_th
            
            doc.text_display = f"{doc.house_no} หมู่ {doc.house_moo} {doc.tambon_th} {doc.amphure_th} {doc.province_th}"
        if doc.house_json == "" :
            doc.house_json = None
    pass
