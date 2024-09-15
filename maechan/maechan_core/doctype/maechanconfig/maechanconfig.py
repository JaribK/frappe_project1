# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class MaechanConfig(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        garuda_logo: DF.AttachImage | None
        google_api_key: DF.Data | None
        mayor_name: DF.Data | None
        mayor_position: DF.Data | None
        mayor_signature: DF.AttachImage | None
        seal: DF.AttachImage | None
        title: DF.Data
    # end: auto-generated types
    
    seal : str
    title : str
    mayor_name : str
    mayor_position : str
    mayor_signature : str
    pass
