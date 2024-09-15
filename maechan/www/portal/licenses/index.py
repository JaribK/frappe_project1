# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
import frappe.www.list
from frappe import _

no_cache = 1


def get_context(context):
    if frappe.session.user == "Guest":
        frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

    context.current_user = frappe.get_doc("User", frappe.session.user) # type: ignore
    context.show_sidebar = True
    context.website_sidebar = frappe.get_doc("Website Sidebar","ใบอนุญาต")
    
    licenses = frappe.db.get_list('License',
                                  filters={
                                      },
                                  fields=["*"],
                                  order_by='',
                                  start=10,
                                  page_length=20,
                                )
    context.licenses = licenses
    context.licenses_count = len(licenses)

