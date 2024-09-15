// Copyright (c) 2024, SE and contributors
// For license information, please see license.txt
async function update_province_amphure_district(frm) {

    let province_id = frm.doc.address_province
    let amphure_id = frm.doc.address_amphur
    let tambon_id = frm.doc.address_district

    console.log(province_id, amphure_id, tambon_id)

    if (province_id) {
        frm.set_query('address_amphur', () => {
            return {
                filters: {
                    province_id: province_id
                }
            }
        })

        if (amphure_id) {
            frm.set_query('address_district', () => {
                return {
                    filters: {
                        amphure_id: amphure_id
                    }
                }
            })
        } else {
            frm.set_query('address_district', () => {
            })
        }
    } else {
        frm.set_query('address_amphur', () => {
            return {}
        })

    }

}

frappe.ui.form.on("UserProfile", {
    refresh(frm) {
        update_province_amphure_district(frm)

    },


    address_province(frm) {
        update_province_amphure_district(frm)

        frm.doc.address_amphur = null
        frm.doc.address_district = null
        frm.refresh_fields()
    },
    address_amphur(frm) {
        update_province_amphure_district(frm)
        frm.doc.address_district = null
        frm.refresh_fields()

    },
    async address_district(frm, update = true) {
        console.log(frm)
        await frappe.model.get_value('Tambon', frm.doc.address_district, 'amphure_id', (r) => {
            frm.doc.address_amphur = r.amphure_id
            frm.refresh_field('address_amphur')
        }) // 1st way

        await frappe.model.get_value('Tambon', frm.doc.address_district, 'province_id', (r) => {
            frm.doc.address_province = r.province_id
            frm.refresh_field('address_province')
        }) // 1st way
    }
});
