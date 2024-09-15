# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

from frappe.core.doctype.user.user import User
import frappe
from frappe.model.document import Document


class UserProfile(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        address_amphur: DF.Link | None
        address_district: DF.Link | None
        address_moo: DF.Data | None
        address_no: DF.Data | None
        address_province: DF.Link | None
        address_road: DF.Data | None
        address_soi: DF.Data | None
        birthdate: DF.Date | None
        email: DF.Data | None
        fullname: DF.Data | None
        nationality: DF.Data | None
        personal_id: DF.Data | None
        race: DF.Data | None
        tel: DF.Data | None
    # end: auto-generated types

    pass

    def autoname(self):
        self.name = frappe.session.user

    def before_insert(self):
        self.email = frappe.session.user


@frappe.whitelist()
def get_current_userprofile():
    profile = frappe.db.get("UserProfile", {
        "name": frappe.session.user
    })

    userdoc: User = frappe.get_doc("User", frappe.session.user)  # type: ignore

    if profile:
        return profile
    else:
        newprofile: UserProfile = frappe.new_doc(
            "UserProfile", as_dict=True)  # type: ignore
        newprofile.email = userdoc.email
        newprofile.fullname = ' '.join(
            [userdoc.first_name if userdoc.first_name else '', userdoc.last_name if  userdoc.last_name else ''])  # type: ignore
        newprofile.tel = userdoc.mobile_no

        return newprofile


@frappe.whitelist()
def update_or_create_userprofile():
    req = frappe.form_dict
    assert 'profile' in req
    profilereq = req['profile']
    if 'doctype' not in profilereq:
        profilereq['doctype'] = 'UserProfile'

    profile = frappe.get_doc(req['profile'])
    profile.save()

    return profile
