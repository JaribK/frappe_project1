import frappe

def get_context(context):
    context['test'] = "test1234"  # Check if this is working

    if 'owner_cid' in frappe.form_dict:
        owner_cid = frappe.form_dict['owner_cid']
        
        parent_data = frappe.get_all('Billboard Document2',
                                      filters={'owner_cid': owner_cid,'is_doctype_copy':'false','billboard_status': ['!=', 'ยกเลิกแล้ว']},
                                      fields=['name', "land_id", 'owner_name', 'total_price', 'no_receipt', 'research_by','billboard_status','payment_status'])

        if parent_data:
            context['results'] = []
            
            for parent in parent_data:
                parent_name = parent['name']
                
                billboard_data = frappe.get_all('Billboard Data2',
                                                 filters={'parent': parent_name},
                                                 fields=['picture', 'width', 'height', 'type_of_billboards', 'price'])

                billboard_count = len(billboard_data)

                context['results'].append({
                    'owner_name': parent['owner_name'],
                    'land_id':parent['land_id'],
                    'payment_status':parent['payment_status'],
                    'billboard_count': billboard_count,
                    'data_billboards': billboard_data,
                    'total_price': parent.get('total_price'),
                    'test':parent_data
                })

            context['show_results'] = True
            
        else:
            context['show_no_results'] = True
