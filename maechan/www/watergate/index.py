import frappe
import json

def get_context(context):
    context.watergates  = json.dumps(frappe.db.get_list('WaterGate',fields =['title','status','id','fid','image','lat','lng']))
    context.i = 10
    pass
