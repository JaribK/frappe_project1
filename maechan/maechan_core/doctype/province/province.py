# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

@frappe.whitelist(allow_guest=True)
def get_all_province():
    if 'fields' in frappe.form_dict :
        
        fields = frappe.form_dict['fields']
    else :
        fields = "*"
    return frappe.db.get_all("Province",fields=fields)

@frappe.whitelist(allow_guest=True)
def get_all_amphure():
    
    if 'fields' in frappe.form_dict :
        fields = frappe.form_dict['fields']
    else :
        fields = "*"
    if 'filters' in frappe.form_dict :
        filters = frappe.form_dict['filters']
    else :
        filters = {}
    return frappe.db.get_all("Amphure",fields=fields,filters=filters)


@frappe.whitelist(allow_guest=True)
def get_all_tambon():
    
    if 'fields' in frappe.form_dict :
        fields = frappe.form_dict['fields']
    else :
        fields = "*"
    if 'filters' in frappe.form_dict :
        filters = frappe.form_dict['filters']
    else :
        filters = {}
    return frappe.db.get_all("Tambon",fields=fields,filters=filters)


class Province(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        id: DF.Data
        name_en: DF.Data | None
        name_th: DF.Data | None
    # end: auto-generated types

    
    name_en : str
    name_th : str
    
    pass


@frappe.whitelist()
def filter_province() :
    keyword = frappe.form_dict['keyword'] if 'keyword' in frappe.form_dict else ''
    
    provinceDoctype : Province = frappe.qb.DocType('Province') # type: ignore
    query = (
        frappe.qb.from_(provinceDoctype)
        .select(provinceDoctype.name,provinceDoctype.name_th,provinceDoctype.name_en,provinceDoctype.id)
        .where(provinceDoctype.name_th.like(f"%{keyword}%") |  provinceDoctype.name_en.like(f"%{keyword}%"))
    )

    return query.run(as_dict=True)
    