# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import getdate


def execute(filters=None):
    
    sql = """
        select 
        tabLicense.name,
        case when tabLicense.docstatus = 0 then 'ร่าง' else 'อนุมัติ' end as status,
        case when DATEDIFF(tabLicense.license_end_date,curdate()) > 0 then 'กำลังใช้งาน' else 'หมดอายุ' end AS `active_expired`,
        case when DATEDIFF(tabLicense.license_end_date,curdate()) > 0 then DATEDIFF(tabLicense.license_end_date,curdate()) else 0 end AS `expired_in`,
    
        tabLicenseType.title,
        tabLicense.license_main_type,
        tabLicense.license_applicant,
        tabLicense.license_applicant_title,
        tabLicense.license_start_date,
        tabLicense.license_end_date,
        tabHouse.house_no as house_no,
        tabHouse.house_soi as house_soi,
        tabHouse.house_road as house_road,
        tabHouse.house_moo as house_moo,
        tabHouse.tambon_th as house_tambon,
        tabHouse.amphure_th as house_amphure,
        tabHouse.province_th as house_province
        

        from 
            tabLicense
        
        join tabHouse on tabLicense.house_id = tabHouse.name
        join `tabLicenseType` on `tabLicenseType`.name = tabLicense.license_type
    """
    data = frappe.db.sql(sql,as_dict=True)
    
    if 'start_date' in filters and  filters['start_date'] :
        data = [i for i in data if i['license_start_date'] >= getdate(filters['start_date'])]
        
    if 'end_date' in filters and  filters['end_date'] :
        data = [i for i in data if i['license_start_date'] <= getdate(filters['end_date'])]
    
    if len(data) >0 :
        columns = list(data[0].keys())
    else :
        columns  = []
        
        
    return columns,data
