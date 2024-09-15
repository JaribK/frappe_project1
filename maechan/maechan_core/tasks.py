import frappe
from datetime import datetime

def update_expired_license():
    today = datetime.today()
    today_str = today.strftime("%Y-%m-%d")
    filters={
        'license_end_date': ['<',datetime.today()],
        'workflow_state' : ['!=','Expired']
        }
    
    expired_license = frappe.db.get_list('License',fields=['name'],filters=filters)
    print(len(expired_license))
    
    for i in expired_license :
        frappe.db.set_value('License',i.name,'workflow_state','Expired')
        frappe.db.set_value('License',i.name,'license_approve_status','หมดอายุ')

    frappe.db.commit()
        
    pass