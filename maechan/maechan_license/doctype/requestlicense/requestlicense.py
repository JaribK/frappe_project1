# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

from typing import List
import frappe
from frappe.model.naming import getseries
from frappe.model.document import Document
from maechan.maechan_license.doctype.license.license import License
from maechan.maechan_license.doctype.licensetype.licensetype import LicenseType
from maechan.maechan_license.doctype.requestlicensetype.requestlicensetype import RequestLicenseType
from frappe.model.workflow import apply_workflow
from maechan.maechan_license.doctype.business.business import Business


class RequestLicense(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF
        from maechan.maechan_license.doctype.attachment.attachment import Attachment
        from maechan.maechan_license.doctype.licensedetail.licensedetail import LicenseDetail
        from maechan.maechan_license.doctype.requestdetail.requestdetail import RequestDetail

        amended_from: DF.Link | None
        applicant_age: DF.Data | None
        applicant_amphur: DF.Link | None
        applicant_amphur_th: DF.Data | None
        applicant_distict: DF.Link | None
        applicant_distict_th: DF.Data | None
        applicant_ethnicity: DF.Data | None
        applicant_fax: DF.Data | None
        applicant_moo: DF.Data | None
        applicant_name: DF.Data | None
        applicant_nationality: DF.Data | None
        applicant_no: DF.Data | None
        applicant_province: DF.Link | None
        applicant_province_th: DF.Data | None
        applicant_road: DF.Data | None
        applicant_soi: DF.Data | None
        applicant_tel: DF.Data | None
        applicant_title: DF.Data | None
        attachment_extra: DF.Table[Attachment]
        business: DF.Link | None
        comment: DF.SmallText | None
        date: DF.Date | None
        house_no: DF.Link | None
        house_tel: DF.Data | None
        license_applicant: DF.Data | None
        license_applicant_type: DF.Literal["\u0e1a\u0e38\u0e04\u0e04\u0e25\u0e18\u0e23\u0e23\u0e21\u0e14\u0e32", "\u0e19\u0e34\u0e15\u0e34\u0e1a\u0e38\u0e04\u0e04\u0e25"]
        license_extra: DF.Table[LicenseDetail]
        license_fee: DF.Currency
        license_type: DF.Link | None
        old_request_license: DF.Link | None
        payment_attachment: DF.Attach | None
        renew_license: DF.Link | None
        request_extra: DF.Table[RequestDetail]
        request_status: DF.Literal["\u0e2a\u0e23\u0e49\u0e32\u0e07", "\u0e23\u0e2d\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e40\u0e2d\u0e01\u0e2a\u0e32\u0e23", "\u0e40\u0e2d\u0e01\u0e2a\u0e32\u0e23\u0e44\u0e21\u0e48\u0e04\u0e23\u0e1a", "\u0e41\u0e01\u0e49\u0e44\u0e02", "\u0e23\u0e2d\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e16\u0e32\u0e19\u0e17\u0e35\u0e48", "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19", "\u0e23\u0e2d\u0e2d\u0e2d\u0e01\u0e43\u0e1a\u0e2d\u0e19\u0e38\u0e0d\u0e32\u0e15", "\u0e23\u0e2d\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19", "\u0e04\u0e33\u0e23\u0e49\u0e2d\u0e07\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01"]
        request_type: DF.Link | None
        workflow_state: DF.Link | None
    # end: auto-generated types

    def autoname(self):
        number = getseries('REQ-LICENSE', 5)
        self.name = f"REQ-LICENSE-{number}"
        return self.name

    def fetch_license_extra(self, license: License | None = None):
        if license == None:
            if self.license_type:
                licenseTypeDoc: LicenseType = frappe.get_doc(
                    'LicenseType', self.license_type)  # type: ignore
                for detail in licenseTypeDoc.details:

                    self.append('license_extra', {
                        'key': detail.key,
                    })
        else:
            for extra in license.license_extra:
                self.append('license_extra', {
                            'key': extra.key, # type: ignore
                            'value': extra.value # type: ignore
                            })

    pass


def get_active_workflow():

    workflows = frappe.db.get_all("Workflow",
                                  filters={
                                      'document_type': "RequestLicense",
                                      'is_active': True
                                  },
                                  fields='*',
                                  )

    workflow = workflows[0] if len(workflows) > 0 else None

    return workflow


def get_transitions(workflow, doc):

    transition = frappe.db.get_all("Workflow Transition",
                                   filters={
                                       'parent': workflow['workflow_name'],
                                       'allow_self_approval': True,
                                       'state': doc.workflow_state
                                   }, fields=['*'])

    return transition


def get_workflow_transition(doc):
    workflow = get_active_workflow()
    if (workflow):
        transition = get_transitions(workflow, doc)
    else:
        transition = None

    return transition


@frappe.whitelist()
def load_request_license():
    request = frappe.form_dict
    assert 'name' in request

    name = request['name']
    requestLicenseDoc: RequestLicense = frappe.get_doc(
        "RequestLicense", name)  # type: ignore

    workflow = get_active_workflow()

    if (workflow):
        transition = get_transitions(workflow, requestLicenseDoc)
    else:
        transition = None

    frappe.response['requestLicenseInspect'] = frappe.get_all("RequestLicenseInspect", fields="*", filters={
        'request_license': requestLicenseDoc.name
    })
    frappe.response['workflow'] = workflow
    frappe.response['transition'] = transition
    return requestLicenseDoc


@frappe.whitelist()
def load_request_licenses():
    user = frappe.session.user
    result = frappe.db.get_all("RequestLicense", filters={
        'owner': user
    })

    docs: List[RequestLicense] = [frappe.get_doc(
        'RequestLicense', x.name) for x in result]  # type: ignore
    appointments = {}
    licenses = {}
    for (i, x) in enumerate(docs):
        if x.business :
            x.business = frappe.get_doc('Business', x.business)  # type: ignore
        x.house_no = frappe.get_doc('House', x.house_no)  # type: ignore

        appointments[x.name] = (frappe.db.get_all("RequestLicenseInspect", fields="*", filters={  # type: ignore
            'request_license': x.name,
            'docstatus' : 1
        }))

        licenses[x.name] = (frappe.db.get_all("License", fields="*", filters={
            'request_license': x.name,
            'workflow_state': ['in', ['Approved', 'Expired']]
        }))

    frappe.response['appointment'] = appointments
    frappe.response['licenses'] = licenses

    return docs


@frappe.whitelist()
def first_step_requestlicense():
    req = frappe.form_dict
    assert 'request' in req

    requestLicense = req['request']

    if 'doctype' not in requestLicense:
        requestLicense['doctype'] = 'RequestLicense'

    if 'applicant_title' not in requestLicense or requestLicense['applicant_title'] == '':
        if 'business' in requestLicense and requestLicense['business'] :
            business: Business = frappe.get_doc(
                "Business", requestLicense['business'])  # type: ignore
            requestLicense['applicant_title'] = business.business_name

    requestLicenseObj: RequestLicense = frappe.get_doc(
        requestLicense)  # type: ignore
    requestLicenseObj.save()

    if (requestLicenseObj.request_type):
        reqtypeObj: RequestLicenseType = frappe.get_doc(
            'RequestLicenseType', requestLicenseObj.request_type)  # type: ignore

        for x in reqtypeObj.details:
            found = False
            for i in requestLicenseObj.request_extra:
                if i.key == x.key:
                    found = True
                    break

            if not found:
                requestLicenseObj.append('request_extra', {
                    'key': x.key
                })

        for x in reqtypeObj.attachment:

            found = False
            for i in requestLicenseObj.attachment_extra:
                if i.key == x.key:
                    found = True
                    break

            if not found:
                requestLicenseObj.append('attachment_extra', {
                    'key': x.key
                })

        requestLicenseObj.save()
    
        requestLicenseObj.notify_update()

    
    frappe.response['message'] = requestLicenseObj


@frappe.whitelist()
def deleteAttachment():
    from maechan.maechan_license.doctype.attachment.attachment import Attachment
    req = frappe.form_dict
    assert 'attachment' in req
    attchmentReq = req['attachment']
    attachmentDoc: Attachment = frappe.get_doc(attchmentReq)  # type: ignore
    attachmentDoc.value = ''
    attachmentDoc.save()

    return attachmentDoc


@frappe.whitelist()
def update_attachment():

    from maechan.maechan_license.doctype.attachment.attachment import Attachment
    req = frappe.form_dict
    assert 'attachment' in req
    assert 'fileresponse' in req
    attchmentReq = req['attachment']
    fileReq = req['fileresponse']
    attachmentDoc: Attachment = frappe.get_doc(attchmentReq)  # type: ignore
    attachmentDoc.value = fileReq['file_url']
    attachmentDoc.save()

    return attachmentDoc


@frappe.whitelist()
def update_payment():

    req = frappe.form_dict
    assert 'requestlicense' in req
    assert 'fileresponse' in req
    requestLicenseReq = req['requestlicense']
    fileReq = req['fileresponse']

    requestLicenseDoc: RequestLicense = frappe.get_doc(
        requestLicenseReq)  # type: ignore
    requestLicenseDoc.payment_attachment = fileReq['file_url']
    requestLicenseDoc.save()

    return requestLicenseDoc


@frappe.whitelist()
def clear_payment():

    req = frappe.form_dict
    assert 'requestlicense' in req

    requestLicenseReq = req['requestlicense']

    requestLicenseDoc: RequestLicense = frappe.get_doc(
        requestLicenseReq)  # type: ignore
    requestLicenseDoc.payment_attachment = None
    requestLicenseDoc.save()

    return requestLicenseDoc


@frappe.whitelist()
def citizen_submit():
    req = frappe.form_dict
    assert 'name' in req
    assert 'action' in req
    assert 'state' in req
    name = req['name']
    doc: RequestLicense = frappe.get_doc(
        "RequestLicense", name
    )   # type: ignore

    transition = get_workflow_transition(doc=doc)

    if (transition):
        if req['action'] == 'ปรับปรุงสถานที่แล้วเสร็จ':
            doc.save()

        apply_workflow(doc, req['action'])

    return doc


@frappe.whitelist()
def renew_license():
    request = frappe.form_dict
    assert 'license' in request

    licenseDoc: License = frappe.get_doc(
        'License', request['license'])  # type: ignore
    if licenseDoc:
        if licenseDoc.request_license:
            requestLicenseDoc: RequestLicense = frappe.get_doc(
                "RequestLicense", licenseDoc.request_license)  # type: ignore
            renew_request_license: RequestLicense = frappe.copy_doc(
                requestLicenseDoc)  # type: ignore
            renew_request_license.renew_license = licenseDoc.name
            renew_request_license.old_request_license = requestLicenseDoc.name
            renew_request_license.workflow_state='สร้าง'
            renew_request_license.request_status='สร้าง'
            renew_request_license.save()

            licenseDoc.renew_request = renew_request_license.name
            licenseDoc.save()

            return renew_request_license
        else:
            renew_request_license = frappe.new_doc(
                "RequestLicense")  # type: ignore
            renew_request_license.renew_license = licenseDoc.name
            renew_request_license.license_applicant_type = licenseDoc.license_applicant_type
            renew_request_license.applicant_name = licenseDoc.license_applicant
            renew_request_license.applicant_nationality = licenseDoc.license_applicant_nationality
            renew_request_license.applicant_ethnicity = licenseDoc.license_applicant_ethnicity
            renew_request_license.applicant_tel = licenseDoc.license_applicant_telephone
            renew_request_license.applicant_fax = licenseDoc.license_applicant_fax
            renew_request_license.applicant_no = licenseDoc.license_applicant_address_no
            renew_request_license.applicant_moo = licenseDoc.license_applicant_address_moo
            renew_request_license.applicant_soi = licenseDoc.license_applicant_address_soi
            renew_request_license.applicant_road = licenseDoc.license_applicant_address_road
            renew_request_license.applicant_distict = licenseDoc.license_applicant_address_district
            renew_request_license.applicant_amphur = licenseDoc.license_applicant_address_amphur
            renew_request_license.applicant_province = licenseDoc.license_applicant_address_province
            renew_request_license.applicant_amphur_th = licenseDoc.license_applicant_address_amphur_th
            renew_request_license.applicant_province_th = licenseDoc.license_applicant_address_province_th
            renew_request_license.house_no = licenseDoc.house_id
            renew_request_license.house_tel = licenseDoc.telephone
            renew_request_license.applicant_title = licenseDoc.license_applicant_title
            renew_request_license.license_type = licenseDoc.license_type
            renew_request_license.fetch_license_extra(license=licenseDoc)

            renew_request_license.save()
            licenseDoc.renew_request = renew_request_license.name
            licenseDoc.save()
            return renew_request_license

    else:
        frappe.response['http_status_code'] = 400
        return "License not found."
