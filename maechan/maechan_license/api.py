import frappe
from frappe.query_builder import DocType,Order
from maechan.maechan_license.doctype.license.license import License
from maechan.maechan_core.doctype.house.house import House


@frappe.whitelist(allow_guest=True)
def license_chart():
    request = frappe.form_dict
    
    license_doctype : License = frappe.qb.DocType('License') # type: ignore
    house_doctype : House = frappe.qb.DocType('House') # type: ignore
    select_fields = [
        
    ]

    if "district_id" in request:
        
        
        district_id = request['district_id']

        licenses = (frappe.qb.from_(license_doctype) 
                        .inner_join(house_doctype)                                  # type: ignore
                        .on(license_doctype.house_id == house_doctype.name)         # type: ignore
                        .where(license_doctype.license_end_date >= frappe.utils.add_days(frappe.utils.nowdate(),-90))
                        .where( (license_doctype.workflow_state == 'Approved') | (license_doctype.workflow_state == 'Expired'))
                        .where(house_doctype.district_id == district_id)
                        .select(
                            license_doctype.name.as_('license_name'),
                            license_doctype.license_end_date,
                            
                            license_doctype.license_main_type,
                            license_doctype.license_applicant_title,
                            license_doctype.license_end_date,
                            license_doctype.license_end_date,

                            license_doctype.workflow_state,

                            house_doctype.house_no,
                            house_doctype.house_moo,
                            house_doctype.tambon_th,
                            house_doctype.amphure_th,
                            house_doctype.province_th, 
                            
                            house_doctype.name.as_('house_name'),
                            house_doctype.house_lat,
                            house_doctype.house_lng,
                        )).run(as_dict=True)                             # type: ignore



    else:

        licenses = (frappe.qb.from_(license_doctype)                            # type: ignore
                        .inner_join(house_doctype)                              # type: ignore
                        .on(license_doctype.house_id == house_doctype.name)     # type: ignore
                        .where(license_doctype.license_end_date >= frappe.utils.add_days(frappe.utils.nowdate(),-90))
                        .where( (license_doctype.workflow_state == 'Approved') | (license_doctype.workflow_state == 'Expired'))
                        .select(
                            license_doctype.name.as_('license_name'),
                            license_doctype.license_end_date,
                            
                            license_doctype.license_main_type,
                            license_doctype.license_applicant_title,
                            license_doctype.license_end_date,
                            license_doctype.license_end_date,

                            license_doctype.workflow_state,

                            house_doctype.house_no,
                            house_doctype.house_moo,
                            house_doctype.tambon_th,
                            house_doctype.amphure_th,
                            house_doctype.province_th,  

                            house_doctype.name.as_('house_name'),
                            house_doctype.house_lat,
                            house_doctype.house_lng,

                            

                        )).run(as_dict=True) 

    frappe.response['message'] = licenses
    # frappe.response['request'] = request
