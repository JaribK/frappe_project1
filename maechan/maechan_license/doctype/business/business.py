# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Business(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		business_address: DF.Link | None
		business_name: DF.Data | None
		manager: DF.Link | None
		tel: DF.Data | None
	# end: auto-generated types

	def validate(self) :

		error = dict()
		frappe.response['error'] = error

		if not self.business_address :
			error['message'] = "กรุณากรอกข้อมูลให้ครบถ้วน"	
			error['business_address'] = "กรุณากรอกข้อมูลให้ครบถ้วน"	
			frappe.throw("กรุณากรอกข้อมูล")

		
		if not self.business_name :
			error['message'] = "กรุณากรอกข้อมูลให้ครบถ้วน"	
			error['business_name'] = "กรุณากรอกข้อมูลให้ครบถ้วน"	
			frappe.throw("กรุณากรอกข้อมูล")

		frappe.response['error'] = error
	pass


@frappe.whitelist()
def add_business():
	req = frappe.form_dict

	assert 'business_address' in req
	assert 'business_name' in req
	assert 'tel' in req


	b : Business = frappe.new_doc('Business') # type: ignore
	b.business_address = req['business_address'].strip()
	b.business_name = req['business_name'].strip()
	b.tel = req['tel'].strip()
	b.manager = frappe.session.user

	#validate
	b.save()

	return b

@frappe.whitelist()
def get_businesses():

	businessDoctype = frappe.qb.DocType("Business")
	houseDoctype = frappe.qb.DocType("House")

	query = (
		frappe.qb.from_(businessDoctype).where(businessDoctype.manager == frappe.session.user)
		.join(houseDoctype).on(houseDoctype.name == businessDoctype.business_address)
		.select(
				businessDoctype.name,businessDoctype.manager,businessDoctype.business_name,businessDoctype.business_address,businessDoctype.tel,
				houseDoctype.text_display.as_('business_address_text_display')
			)
	)

	result = query.run(as_dict=True)

	return result

@frappe.whitelist()
def get_business_by_name() :
	
	req = frappe.form_dict
	assert 'name' in req

	name = req['name']
	return frappe.get_doc("Business",name)


@frappe.whitelist()
def update_business():
	
	req = frappe.form_dict
	assert 'business' in req
	business = req['business']
	if 'doctype' not in business :
		business['doctype'] = 'Business'

	business = frappe.get_doc(business)
	business.save()

	return business
