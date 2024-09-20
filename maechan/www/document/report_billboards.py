import frappe

from datetime import datetime

def get_context(context):
    context['test'] = "connect success" #check if this is working

    #datetime thai
    thai_months = {
        1: "มกราคม", 2: "กุมภาพันธ์", 3: "มีนาคม", 4: "เมษายน",
        5: "พฤษภาคม", 6: "มิถุนายน", 7: "กรกฎาคม", 8: "สิงหาคม",
        9: "กันยายน", 10: "ตุลาคม", 11: "พฤศจิกายน", 12: "ธันวาคม"
    }

    context['thai_year'] = datetime.now().year + 543

    thai_mouth = thai_months[datetime.now().month]
    thai_year = datetime.now().year + 543

    context['thai_date'] = datetime.now().strftime(f'%d {thai_mouth} {thai_year}')

    #get data from doctype
    parent_data = frappe.get_all('Billboard Document2',
                                     fields=['name', 'owner_name', 'total_price', 'no_receipt', 'research_by','creation'])
    
    
    curr_year = datetime.now().year
    prev_year = curr_year - 1

    start_date = f'{prev_year}-01-01'
    end_date = f'{curr_year}-12-31'

    base_billboard_data = frappe.get_all('Billboard Data2',
                                filters={'creation': 
                                         ['between', [start_date, end_date]]},
                                fields=['picture', 'width', 'height', 'type_of_billboards', 'price', 'creation'])
    

    curr_billboard_data = frappe.get_all('Billboard Data2',
                                filters={
                                    'type_of_billboards': ['in', [
                                        'ป้ายอักษรไทยล้วน', 
                                        'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย', 
                                        'ป้ายไม่มีอักษรไทย', 
                                        'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)'
                                    ]],
                                    'creation': ['like', f'{curr_year}%']
                                },
                                fields=['picture', 'width', 'height', 'type_of_billboards', 'price', 'creation'])

    curr_type1_data = [billboard for billboard in curr_billboard_data if billboard['type_of_billboards'] == 'ป้ายอักษรไทยล้วน']
    curr_type2_data = [billboard for billboard in curr_billboard_data if billboard['type_of_billboards'] == 'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย']
    curr_type3_data = [billboard for billboard in curr_billboard_data if billboard['type_of_billboards'] == 'ป้ายไม่มีอักษรไทย']
    curr_type4_data = [billboard for billboard in curr_billboard_data if billboard['type_of_billboards'] == 'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)']

    prev_billboard_data = frappe.get_all('Billboard Data2',
                                filters={
                                    'type_of_billboards': ['in', [
                                        'ป้ายอักษรไทยล้วน', 
                                        'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย', 
                                        'ป้ายไม่มีอักษรไทย', 
                                        'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)'
                                    ]],
                                    'creation': ['like', f'{prev_year}%']
                                },
                                fields=['picture', 'width', 'height', 'type_of_billboards', 'price', 'creation'])

    prev_type1_data = [billboard for billboard in prev_billboard_data if billboard['type_of_billboards'] == 'ป้ายอักษรไทยล้วน']
    prev_type2_data = [billboard for billboard in prev_billboard_data if billboard['type_of_billboards'] == 'ป้ายอักษรไทย,อังกฤษ,ปนภาพ,เครื่องหมาย']
    prev_type3_data = [billboard for billboard in prev_billboard_data if billboard['type_of_billboards'] == 'ป้ายไม่มีอักษรไทย']
    prev_type4_data = [billboard for billboard in prev_billboard_data if billboard['type_of_billboards'] == 'ป้ายที่แก้ไข ข้อความ,รูป,เครื่องหมาย(จ่ายแล้ว)']

    context['curr_type1_amount'] = len(curr_type1_data)
    context['curr_type2_amount'] = len(curr_type2_data)
    context['curr_type3_amount'] = len(curr_type3_data)
    context['curr_type4_amount'] = len(curr_type4_data)

    context['prev_type1_amount'] = len(prev_type1_data)
    context['prev_type2_amount'] = len(prev_type2_data)
    context['prev_type3_amount'] = len(prev_type3_data)
    context['prev_type4_amount'] = len(prev_type4_data)

    context['curr_amount_billboards'] = len(curr_billboard_data)
    context['prev_amount_billboards'] = len(prev_billboard_data)
    context['amount_billboards'] = len(base_billboard_data) - 1

