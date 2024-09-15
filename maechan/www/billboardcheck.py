import frappe

def get_context(context):
    context['test'] = "test1234" #check if this is working

    if 'owner_cid' in frappe.form_dict:
        owner_cid = frappe.form_dict['owner_cid']
        
        parent_data = frappe.get_all('Billboard Document2',
                                     filters={'owner_cid': owner_cid},
                                     fields=['name', 'owner_name', 'total_price', 'no_receipt', 'research_by'])

        if parent_data:
            parent_name = parent_data[0]['name']

            land_data = frappe.get_all('Billboard Land2',
                                       filters={'parent': parent_name},
                                       fields=['land_id', 'no', 'road', 'moo', 'soi', 'sub_district', 'district', 'province', 'postal_code', 'latitude', 'longitude'])
            
            billboard_data = frappe.get_all('Billboard Data2',
                                            filters={'parent': parent_name},
                                            fields=['picture', 'width', 'height', 'type_of_billboards','price'])

            billboard_count = len(billboard_data)

            context['owner_name'] = parent_data[0]['owner_name']
            context['land_id'] = land_data[0]['land_id'] if land_data else None
            context['billboard_count'] = billboard_count
            context['data_billboards'] = billboard_data
            context['total_price'] = parent_data[0].get('total_price')
            context['show_results'] = True
        
        else:
            context['show_no_results'] = True
