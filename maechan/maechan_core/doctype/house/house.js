// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on('House', {
	refresh(frm) {
		// your code here
	},
	populate_json(frm) {
	    let house_json =  frm.doc.house_json
	    try {
	        let json = JSON.parse(house_json)
	        if (json.properties.Name) {
	            frm.set_value({
	                "house_no" : json.properties.Name,
	            })
	        }
	        
	        if (json.geometry.type === "Point" && json.geometry.coordinates) {
	            frm.set_value({
	                "house_lat" : json.geometry.coordinates[1],
	                "house_lng" : json.geometry.coordinates[0],
	            })
	        }
	    }catch(e){
	        console.log(e)
	        frappe.throw(__(e.message))
	    }
	},
	validate(frm) {
	    // validte json
	    try {
	        console.log('json',frm.doc.house_json)
			if(frm.doc.house_json && frm.doc.house_json != ""){
				let house_json =  frm.doc.house_json
				let json = JSON.parse(house_json)
				if (json.properties.Name) {
					if(frm.doc.house_no != json.properties.Name){
						frappe.throw(__('บ้านเลขที่ไม่ตรงกับ geojson'))
					}
				}
				console.log('point')
				if (json.geometry.type == "Point" && json.geometry.coordinates) {
					if( frm.doc.house_lat != json.geometry.coordinates[1]){
						frappe.throw(__('lat ไม่ตรงกับ geojson'))
	
					}
				   
					if( frm.doc.house_lng != json.geometry.coordinates[0]){
						frappe.throw(__('lng ไม่ตรงกับ geojson'))
	
					}
				}
			}
    	    
	    }catch(e){
	        frappe.throw(__(e.message))

	    }
	}
})