# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Tambon(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        amphure_id: DF.Link | None
        amphure_th: DF.Data | None
        id: DF.Data
        name_en: DF.Data | None
        name_th: DF.Data | None
        province_id: DF.Link | None
        province_th: DF.Data | None
        zipcode: DF.Data | None
    # end: auto-generated types
    
    name_th : str
    name_en : str
    amphure_id : str
    zipcode : str
    province_id : str
    amphure_th : str
    province_th : str
    
    
    pass
