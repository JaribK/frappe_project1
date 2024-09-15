# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from maechan.maechan_core.doctype.amphure.amphure import Amphure
from maechan.maechan_core.doctype.tambon.tambon import Tambon
from maechan.maechan_core.doctype.province.province import Province

from typing import NewType


class District(Document):
    
    tambon_th : str
    amphure_th : str
    tambon_id : str
    name_th : str
    amphure_th : str
    province_th : str
    text_display : str 
    moo : str
    
    def before_save(self) :
        doc = self
        
        tambon : Tambon = frappe.get_doc('Tambon', doc.tambon_id) # type: ignore
        doc.tambon_th = tambon.name_th
        doc.amphure_th = tambon.amphure_th
        doc.province_th = tambon.province_th


        if doc.amphure_th == "" or doc.amphure_th is None :
            amphure : Amphure = frappe.get_doc('Amphure', tambon.amphure_id) # type: ignore
            doc.amphure_th = amphure.name_th
            pass

        if doc.province_th == "" or doc.province_th is None :
            province : Province = frappe.get_doc('Province', tambon.province_id) # type: ignore
            doc.province_th = province.name_th
            pass

        if(doc.province_th and doc.amphure_th and doc.tambon_th) :
            doc.text_display = f"หมู่ที่ {doc.moo} ตำบล{doc.tambon_th} อำเภอ{doc.amphure_th} จังหวัด{doc.province_th}"
            pass
