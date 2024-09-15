
frappe.listview_settings['WaterGate'] = {
    //add_fields: ['title', 'status'],

    has_indicator_for_draft: false,
    get_indicator(doc) {
        // customize indicator color
        if (doc.status == "เปิด") {
            return [__("เปิด"), "green",""];
        } else if (doc.status =="ปิด") {
            return [__("ปิด"), "darkgrey",""];
        }
    },
    button : {
        show(doc) {
            return true
        },
        get_label() {
            return __("เปิด/ปิด");
        },
        get_description(doc) {
            return "เปิด/ปิด ประตูน้ำ"
        },
        action(doc) {
            fetch(`/api/resource/WaterGate/${doc.name}`, {
                method : 'PUT',
                headers: { 'Content-Type': 'application/json' ,
                "X-Frappe-CSRF-Token": frappe.csrf_token},
                body : JSON.stringify({
                    "status" : doc.status === "เปิด" ? "ปิด" : "เปิด"
                })
            }).then(r=>console.log(r))
        }
    }
}
