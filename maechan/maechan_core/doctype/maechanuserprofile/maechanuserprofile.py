# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MaechanUserProfile(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        signature: DF.AttachImage | None
        signature_owner: DF.Link | None
    # end: auto-generated types
 
    def before_insert(self) :
        if(frappe.session.user):
            user = frappe.get_doc("User",frappe.session.user)
            self.signature_owner = user.name
    pass
