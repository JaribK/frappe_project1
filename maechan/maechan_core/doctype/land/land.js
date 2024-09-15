// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

frappe.ui.form.on('Land', {
    onload: function (frm, cdt, cdn) {
	
	},
	refresh(frm) {
		// your code here
	
	},
	update_from_geojson(frm) {
	    let json = JSON.parse(frm.doc.geojson)
	    console.log(json.properties)
	    
	    frm.set_value({
	        "parcel_cod" : json.properties.PARCEL_COD,
	        "lot" : json.properties.LOT,
	        "zone_id" : json.properties.ZONE_ID,
	        "block_id" : json.properties.BLOCK_ID,
	        "land_owner" : json.properties.Name,
	        "land_size" : json.properties['RAI-NGAN-W'],
	        "parcel_no" : json.properties['PARCEL_NO'],
	        "land_type" : json.properties['land_type'],
	    })
	    
	    let coordinates_utm = json.geometry.coordinates[0][0]
	    let coordinates_latlng = coordinates_utm.map(x=>{
	        console.log("X",x)
	        return {
	            lat : x[1],
	            lng : x[0]
	        }
	    })
	    let lat = 0
	    let lng = 0
	    coordinates_latlng.forEach(x=>{
	        lat += x.lat
	        lng += x.lng
	    })
	    if(coordinates_latlng.length >0){
	        lat = lat / coordinates_latlng.length    
	        lng = lng / coordinates_latlng.length    
	    }
	    frm.set_value({
	        "lat" : lat,
	        "lng" : lng
	    })
	    
	}
})