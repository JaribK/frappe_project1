// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on('ImportHouse', {
    refresh(frm) {
        // your code here
        // $('.primary-action').prop('hidden', true);
        $('button[data-label="Cancel"]').prop('hidden', true);
        $('button[data-label="Submit"]').prop('hidden', true);
        
        console.log(frm.doc)

        if (frm.doc.docstatus == 0){
            frm.add_custom_button(__('Start Import'), function () {
                frappe.call({
                    doc : frm.doc,
                    method : 'import_house',
                    btn: $('button[data-label="Start Import"]'),
                    freeze: false,
                    callback : (r)=>{
                        console.log(r)
                    }
                })
            },);
    
            frm.change_custom_button_type(__('Start Import'), null, 'primary');
        }
        
    
        frm.trigger('preview')

    },
    preview(frm) {
        console.log(frm.doc.geojson_file)
        if(frm.doc.geojson_file){
            frappe.call({
                doc: frm.doc,
                method: 'preview',
                args: {
                    doc_name: frm.doc.name
                },
                // disable the button until the request is completed
                btn: $('button[data-fieldname="preview"]'),
                // freeze the screen until the request is completed
                freeze: true,
                callback: (r) => {
                    // on success
                    try {
                        let json = JSON.parse(r.message)
                        console.log(json);
                        let element = document.querySelector(`.frappe-control[data-fieldname="import_preview"]`);
    
                        let datatabel = new DataTable(element, {
                            columns: ['Name', 'Moo', 'Lat', 'Lng'],
                            layout: 'fluid',
                            data: json.features.filter(i => i.geometry != null).map(i => {
                                return [
                                    i.properties.Name,
                                    i.properties.Moo,
                                    i.geometry.coordinates[1],
                                    i.geometry.coordinates[0]
                                ]
                            })
                        });
    
    
    
    
                    } catch (e) {
                        console.log(e)
                    }
                },
                error: (r) => {
                    // on error
                }
            })
        }else {
            import_preview = document.querySelector(`.frappe-control[data-fieldname="import_preview"]`);
            import_preview.innerHTML = "";
        }
       


    }
})