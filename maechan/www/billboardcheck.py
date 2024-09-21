import frappe

def get_context(context):
    context['test'] = "test1234"  # Check if this is working

    if 'owner_cid' in frappe.form_dict:
        owner_cid = frappe.form_dict['owner_cid']
        
        # Fetch all parent data for the specified owner_cid
        parent_data = frappe.get_all('Billboard Document2',
                                      filters={'owner_cid': owner_cid},
                                      fields=['name', 'owner_name', 'total_price', 'no_receipt', 'research_by'])

        if parent_data:
            context['results'] = []  # Initialize a list to store results
            
            # Loop through each parent document
            for parent in parent_data:
                parent_name = parent['name']
                
                land_data = frappe.get_all('Billboard Land2',
                                            filters={'parent': parent_name},
                                            fields=['no', 'road', 'moo', 'soi', 'sub_district', 'district', 'province', 'postal_code', 'latitude', 'longitude'])
                
                billboard_data = frappe.get_all('Billboard Data2',
                                                 filters={'parent': parent_name},
                                                 fields=['picture', 'width', 'height', 'type_of_billboards', 'price'])

                billboard_count = len(billboard_data)

                # Append results to context
                context['results'].append({
                    'owner_name': parent['owner_name'],
                    'land_id':parent['name'],
                    'land_data': land_data,
                    'billboard_count': billboard_count,
                    'data_billboards': billboard_data,
                    'total_price': parent.get('total_price'),
                })

            context['show_results'] = True
            
        else:
            context['show_no_results'] = True
