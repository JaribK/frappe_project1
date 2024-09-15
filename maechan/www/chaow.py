import frappe

def get_context(context):
    context['something'] = "XYZ"
    context['xxxx'] =frappe.form_dict
    if 'xxxx' in frappe.form_dict : 
        xxxx = frappe.form_dict['xxxx']
        context['xxxx'] = xxxx