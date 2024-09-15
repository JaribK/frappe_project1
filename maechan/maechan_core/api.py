import frappe
from frappe.query_builder import DocType,Order
from maechan.maechan_core.doctype.house.house import House

@frappe.whitelist(allow_guest=True)
def land_chart():

    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        lands = frappe.db.get_all(
            "Land", filters={"district_id": district_id}, fields='*')
    else:
        lands = frappe.db.get_all("Land", fields='*')

    frappe.response['message'] = lands
    # frappe.response['request'] = request


@frappe.whitelist(allow_guest=True)
def house_chart():
    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        houses = frappe.db.get_all(
            "House", filters={"district_id": district_id}, fields='*')
    else:
        houses = frappe.db.get_all("House", fields='*')

    frappe.response['message'] = houses
    # frappe.response['request'] = request


def district_list():
    request = frappe.form_dict
    # district = frappe.db.get_list("District", fields="*",order_by=['moo asc','tambon_id asc'])
    district = frappe.qb.from_("District").select("*").orderby('moo',order=frappe.qb.asc).orderby('tambon_id',order=frappe.qb.asc).run(as_dict=True)

    frappe.response['message'] = "District List"
    frappe.response['data'] = district

@frappe.whitelist()
def load_signature() :
    sig = frappe.db.get_all(
        "MaechanUserProfile", filters={"signature_owner": frappe.session.user}, fields='*')
    count = len(sig)
    if count >= 1 :
        frappe.response['message'] = sig
        frappe.response['count'] = len(sig)
    else :
        frappe.response['message'] = None
        frappe.response['count'] = 0 
    pass

@frappe.whitelist()
def update_signature() :
    from typing import List
    from maechan.maechan_core.doctype.maechanuserprofile.maechanuserprofile import MaechanUserProfile
    
    signatures : List[MaechanUserProfile] = frappe.db.get_all(
        "MaechanUserProfile", filters={"signature_owner": frappe.session.user}, fields='*') # type: ignore
    count = len(signatures) # type: ignore
    
    request = frappe.form_dict
    
    if 'signature' in request : 
    
        if count >= 1 :
            #update signature
            sig : MaechanUserProfile  = signatures[0] # type: ignore
            sig  = frappe.get_doc('MaechanUserProfile',sig.name) # type: ignore
            sig.signature = request['signature']
            sig.save()
            pass
        else :
            #create signature
            sig : MaechanUserProfile = frappe.new_doc('MaechanUserProfile') # type: ignore
            sig.signature_owner = frappe.session.user
            sig.signature = request['signature']
            
            sig.insert()
            pass 
        
        
        frappe.response['message'] = sig
    
        

@frappe.whitelist()
def house_filter():
    req = frappe.form_dict

    assert 'keyword' in req

    keyword = req['keyword']

    housedoc = frappe.qb.DocType('House')
    query = (
        frappe.qb.from_(housedoc)
        .select(housedoc.name,housedoc.text_display)
        .where(
            housedoc.text_display.like(f"%{keyword}%")  | housedoc.name == f"{keyword}" 
        ).limit(30)
        
    )

    result = query.run(as_dict=True)
    return result