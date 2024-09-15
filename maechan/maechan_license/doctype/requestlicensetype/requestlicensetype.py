# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RequestLicenseType(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF
        from maechan.maechan_license.doctype.attachment.attachment import Attachment
        from maechan.maechan_license.doctype.checklist.checklist import CheckList
        from maechan.maechan_license.doctype.checklisttypedetail.checklisttypedetail import CheckListTypeDetail
        from maechan.maechan_license.doctype.requesttypedetail.requesttypedetail import RequestTypeDetail

        attachment: DF.Table[Attachment]
        checklist: DF.Table[CheckList]
        checklist_details: DF.Table[CheckListTypeDetail]
        details: DF.Table[RequestTypeDetail]
        request_type: DF.Data | None
    # end: auto-generated types

    pass


@frappe.whitelist()
def get_request_license_type():
    return frappe.get_all("RequestLicenseType", fields="*")


@frappe.whitelist()
def findByName():
    req = frappe.form_dict
    assert 'name' in req
    name = req['name']

    return frappe.get_doc("RequestLicenseType", name)
