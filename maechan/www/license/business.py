import frappe
import json

def get_context(context):
    
    
    if 'business' in  frappe.form_dict :
        business = frappe.form_dict['business']
        context.business = business
    
        if business is None or business == '' :
            context.list = []
        else : 
            
            from frappe.query_builder import DocType
            License = DocType("License")

            
            result = (
                frappe.qb.from_(License)
                .select("*")
                .where(License.license_applicant_title == business)
                ).run(as_dict=True)

        
            context.list = result
    
    pass
