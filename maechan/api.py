import json
import base64
from io import BytesIO

import frappe
import frappe.defaults
import frappe.utils
import frappe.utils.logger
from frappe.utils.password import update_password as _update_password
from frappe.utils.oauth import login_oauth_user, login_via_oauth2_id_token, get_info_via_oauth
from frappe.core.doctype.user.user import User
from frappe import auth,_
from datetime import datetime, timedelta

from maechan.maechan_license.doctype.license.license import License


frappe.utils.logger.set_log_level("DEBUG")
logger = frappe.logger("maechan.api", allow_site=True, file_count=50)


@frappe.whitelist(allow_guest=True)
def hello():
    frappe.response['message'] = "Hello from code"

#### Billboard CRUD ####

@frappe.whitelist(allow_guest=True)
def get_data_by_owner_cid(owner_cid):
    doc = frappe.get_doc('Billboard Document2', {'owner_cid': owner_cid})

    land_id = 'N/A'
    
    if hasattr(doc, 'land') and isinstance(doc.land, list) and len(doc.land) > 0:
        first_land_entry = doc.land[0]
        if hasattr(first_land_entry, 'address') and isinstance(first_land_entry.address, list) and len(first_land_entry.address) > 0:
            land_id = first_land_entry.address[0].get('land_id', 'N/A')

    response = {
        "owner_name": doc.owner_name,
        "land_id": land_id,
        "number_of_billboard": len(doc.data_billboards),
        "images": [billboard.picture for billboard in doc.data_billboards],
        "total_price": doc.total_price
    }

    return response

@frappe.whitelist(allow_guest=True)
def post_billboard_document(data):
    try:
        data = frappe.parse_json(data)

        doc = frappe.get_doc({
            'doctype': 'Billboard Document2',
            'land_id': data.get('land_id'),
            'owner_cid': data.get('owner_cid'),
            'owner_name': data.get('owner_name'),
            'no_receipt': data.get('no_receipt'),
            'research_by': data.get('research_by'),
            'payment_status': data.get('payment_status'),
            'billboard_status': data.get('billboard_status'),
            'is_doctype_copy': 'false'
        })

        for billboard in data.get('data_billboards', []):
            if isinstance(billboard, dict):
                doc.append('data_billboards', {
                    'picture': billboard.get('picture'),
                    'width': billboard.get('width'),
                    'height': billboard.get('height'),
                    'type_of_billboards': billboard.get('type_of_billboards'),
                })


        doc.insert()

        newcopy = frappe.copy_doc(doc)
        newcopy.is_doctype_copy = 'true'

        newcopy.insert()
        frappe.db.commit()

        return {"message": "Document created successfully", "name": doc.name}

    except frappe.ValidationError as e:
        return {"error": str(e)}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error creating Billboard Document"))
        return {"error": str(e)}
    
@frappe.whitelist(allow_guest=True)
def get_billboard_document(name):
    try:
        doc = frappe.get_doc('Billboard Document2', name)

        data_billboards_entries = []
        for data in doc.data_billboards:
            data_billboards_entries.append({
                "picture": data.picture,
                "width": data.width,
                "height": data.height,
                "price": data.price,
                "type_of_billboards": data.type_of_billboards,
            })
        response = {
            "name": doc.name,
            "is_doctype_copy": doc.is_doctype.copy,
            "land_id": doc.land_id,
            "created_date": doc.creation,
            "owner_cid": doc.owner_cid,
            "owner_name": doc.owner_name,
            "total_price": doc.total_price,
            "no_receipt": doc.no_receipt,
            "research_by": doc.research_by,
            "payment_status": doc.payment_status,
            "billboard_status": doc.billboard_status,
            "moo":doc.moo,
            "lat":doc.lat,
            "lng":doc.lng,
            "data_billboards": data_billboards_entries
        }

        return response

    except frappe.DoesNotExistError:
        frappe.throw(_("Billboard Document not found"), frappe.DoesNotExistError)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error fetching Billboard Document"))
        frappe.throw(_("An error occurred while fetching the Billboard Document"))

@frappe.whitelist(allow_guest=True)
def get_all_new_billboard_documents():
    try:
        documents = frappe.get_all(
            'Billboard Document2',
            filters={'is_doctype_copy': 'false'},
            fields=[
                'name', 'is_doctype_copy', 'land_id', 'owner_cid', 'owner_name', 
                'total_price', 'no_receipt', 'research_by', 'creation', 'moo',
                'lat', 'lng', 'payment_status'
            ]
        )

        results = []

        for doc in documents:
            detailed_doc = frappe.get_doc('Billboard Document2', doc['name'])
            data_billboards_entries = []
            for data in detailed_doc.data_billboards:
                data_billboards_entries.append({
                    "picture": data.picture,
                    "width": data.width,
                    "height": data.height,
                    "price": data.price,
                    "type_of_billboards": data.type_of_billboards,
                })
            response = {
                "name": detailed_doc.name,
                "is_doctype_copy": detailed_doc.is_doctype_copy,
                "land_id": detailed_doc.land_id,
                "created_date": detailed_doc.creation.strftime('%Y-%m-%d %H:%M:%S'),
                "owner_cid": detailed_doc.owner_cid,
                "owner_name": detailed_doc.owner_name,
                "total_price": detailed_doc.total_price,
                "no_receipt": detailed_doc.no_receipt,
                "research_by": detailed_doc.research_by,
                "payment_status": detailed_doc.payment_status,
                "billboard_status": detailed_doc.billboard_status,
                "moo": detailed_doc.moo,
                "lat": detailed_doc.lat,
                "lng": detailed_doc.lng,
                "data_billboards": data_billboards_entries
            }
            results.append(response)

        return results

    except frappe.DoesNotExistError:
        frappe.throw(_("Billboard Document not found"), frappe.DoesNotExistError)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error fetching Billboard Documents"))
        frappe.throw(_("An error occurred while fetching the Billboard Documents"))

@frappe.whitelist(allow_guest=True)
def get_all_old_billboard_documents():
    try:
        documents = frappe.get_all(
            'Billboard Document2',
            filters={'is_doctype_copy': 'true'},
            fields=[
                'name', 'is_doctype_copy', 'land_id', 'owner_cid', 'owner_name', 
                'total_price', 'no_receipt', 'research_by', 'creation', 'moo',
                'lat', 'lng', 'payment_status'
            ]
        )

        results = []

        for doc in documents:
            detailed_doc = frappe.get_doc('Billboard Document2', doc['name'])
            data_billboards_entries = []
            for data in detailed_doc.data_billboards:
                data_billboards_entries.append({
                    "picture": data.picture,
                    "width": data.width,
                    "height": data.height,
                    "price": data.price,
                    "type_of_billboards": data.type_of_billboards,
                })
            response = {
                "name": detailed_doc.name,
                "is_doctype_copy": detailed_doc.is_doctype_copy,
                "land_id": detailed_doc.land_id,
                "created_date": detailed_doc.creation.strftime('%Y-%m-%d %H:%M:%S'),
                "owner_cid": detailed_doc.owner_cid,
                "owner_name": detailed_doc.owner_name,
                "total_price": detailed_doc.total_price,
                "no_receipt": detailed_doc.no_receipt,
                "research_by": detailed_doc.research_by,
                "payment_status": detailed_doc.payment_status,
                "billboard_status": detailed_doc.billboard_status,
                "moo": detailed_doc.moo,
                "lat": detailed_doc.lat,
                "lng": detailed_doc.lng,
                "data_billboards": data_billboards_entries
            }
            results.append(response)

        return results

    except frappe.DoesNotExistError:
        frappe.throw(_("Billboard Document not found"), frappe.DoesNotExistError)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error fetching Billboard Documents"))
        frappe.throw(_("An error occurred while fetching the Billboard Documents"))

@frappe.whitelist(allow_guest=True)
def get_all_billboard_documents():
    try:
        documents = frappe.get_all(
            'Billboard Document2',
            fields=[
                'name', 'is_doctype_copy', 'land_id', 'owner_cid', 'owner_name', 
                'total_price', 'no_receipt', 'research_by', 'creation', 'moo',
                'lat', 'lng', 'payment_status'
            ]
        )

        results = []

        for doc in documents:
            detailed_doc = frappe.get_doc('Billboard Document2', doc['name'])
            data_billboards_entries = []
            for data in detailed_doc.data_billboards:
                data_billboards_entries.append({
                    "picture": data.picture,
                    "width": data.width,
                    "height": data.height,
                    "price": data.price,
                    "type_of_billboards": data.type_of_billboards,
                })
            response = {
                "name": detailed_doc.name,
                "is_doctype_copy": detailed_doc.is_doctype_copy,
                "land_id": detailed_doc.land_id,
                "created_date": detailed_doc.creation.strftime('%Y-%m-%d %H:%M:%S'),
                "owner_cid": detailed_doc.owner_cid,
                "owner_name": detailed_doc.owner_name,
                "total_price": detailed_doc.total_price,
                "no_receipt": detailed_doc.no_receipt,
                "research_by": detailed_doc.research_by,
                "payment_status": detailed_doc.payment_status,
                "billboard_status": detailed_doc.billboard_status,
                "moo": detailed_doc.moo,
                "lat": detailed_doc.lat,
                "lng": detailed_doc.lng,
                "data_billboards": data_billboards_entries
            }
            results.append(response)

        return results

    except frappe.DoesNotExistError:
        frappe.throw(_("Billboard Document not found"), frappe.DoesNotExistError)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error fetching Billboard Documents"))
        frappe.throw(_("An error occurred while fetching the Billboard Documents"))

@frappe.whitelist(allow_guest=True)
def update_billboard_document(name, data):
    try:
        data = frappe.parse_json(data)

        doc = frappe.get_doc('Billboard Document2', name)

        doc.land_id = data.get('land_id')
        doc.owner_cid = data.get('owner_cid')
        doc.owner_name = data.get('owner_name')
        doc.no_receipt = data.get('no_receipt')
        doc.research_by = data.get('research_by')
        doc.payment_status = data.get('payment_status')
        doc.billboard_status = data.get('billboard_status')
        doc.is_doctype_copy = 'false'

        doc.set('data_billboards', [])

        for billboard in data.get('data_billboards', []):
            if isinstance(billboard, dict):
                doc.append('data_billboards', {
                    'picture': billboard.get('picture'),
                    'width': billboard.get('width'),
                    'height': billboard.get('height'),
                    'type_of_billboards': billboard.get('type_of_billboards'), 
                })

        doc.save()

        newcopy = frappe.copy_doc(doc)
        newcopy.is_doctype_copy = 'true'

        newcopy.save()
        frappe.db.commit()

        return {"message": "Document updated successfully"}

    except frappe.DoesNotExistError:
        return {"error": "Billboard Document not found"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error updating Billboard Document"))
        return {"error": str(e)}


@frappe.whitelist(allow_guest=True)
def delete_billboard_document(name):
    try:
        doc = frappe.get_doc('Billboard Document2', name)
        doc.delete()
        frappe.db.commit()

        return {"message": "Document deleted successfully"}

    except frappe.DoesNotExistError:
        return {"error": "Billboard Document not found"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Error deleting Billboard Document"))
        return {"error": str(e)}
########################
@frappe.whitelist(allow_guest=True)
def login(username, password):
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=username, pwd=password)
        login_manager.post_login()
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.local.response['message'] = {
            "success_key": 0,
            "status_detail": "Invalid Login"
        }
        return
    
    api_keys = generate_keys(frappe.session.user)
    user = frappe.get_doc("User", frappe.session.user)

    frappe.local.response['message'] = {
        "success_key": 1,
        "status_detail": "Login Success",
        "token": frappe.session.sid,
        "user": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": user.full_name,
            "api_key": api_keys['api_key'],
            "api_secret": api_keys['api_secret'],
        }
    }
@frappe.whitelist(allow_guest=True)
def logout():
    try:
        if frappe.session.user:
            frappe.local.login_manager.logout()
            frappe.local.response['message'] = {
                "success_key": 1,
                "status_detail": "Logout Success"
            }
        else:
            frappe.local.response['message'] = {
                "success_key": 0,
                "status_detail": "No active session"
            }
    except Exception as e:
        frappe.local.response['message'] = {
            "success_key": 0,
            "status_detail": f"Logout failed: {str(e)}"
        }

def generate_keys(user):
    user_details = frappe.get_doc("User", user)
    api_secret = frappe.generate_hash(length=32)

    if not user_details.api_key:
        api_key = frappe.generate_hash(length=32)
        user_details.api_key = api_key
    else:
        api_key = user_details.api_key
    
    user_details.api_secret = api_secret
    user_details.save()

    return {"api_key": api_key, "api_secret": api_secret}

@frappe.whitelist(allow_guest=True)
def land_chart():

    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        lands = frappe.db.get_all(
            "Land", filters={"district_id": district_id}, fields='*')
    else:
        lands = frappe.db.get_all("Land", fields='*')

    frappe.response['message'] = lands
    # frappe.response['request'] = request


@frappe.whitelist(allow_guest=True)
def house_chart():
    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        houses = frappe.db.get_all(
            "House", filters={"district_id": district_id}, fields='*')
    else:
        houses = frappe.db.get_all("House", fields='*')

    frappe.response['message'] = houses
    # frappe.response['request'] = request


@frappe.whitelist(allow_guest=True)
def license_preivew():
    request = frappe.form_dict
    if request['type'] == "License":

        if 'name' in request:
            doc_name = request['name']
            doc: License = frappe.get_doc("License", doc_name)  # type: ignore

            from frappe.core.doctype.file.utils import get_local_image

            if doc.license_signature_img:
                localImg = get_local_image(doc.license_signature_img)
                buffered = BytesIO()
                localImg[0].save(buffered, format="png")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

                doc.license_signature_img = 'data: image/png;base64, ' + img_str  # type: ignore

            content = frappe.render_template(
                'templates/license/licensedefault.html', {'doc': doc})
            content = f"<html>{content}</html>"
            return content
        elif 'uuid' in request:
            from frappe.query_builder import DocType
            LicenseDocType = frappe.qb.DocType('License')

            q = (frappe.qb.from_(LicenseDocType)
                .limit(1)
                .select("*")
                .where(LicenseDocType.uuid == request['uuid']))

            result = q.run(as_dict=True)
            if (len(result) == 1):

                doc: License = frappe.get_doc(
                    "License", result[0]['name'])  # type: ignore

                from frappe.core.doctype.file.utils import get_local_image

                if doc.license_signature_img:
                    localImg = get_local_image(doc.license_signature_img)
                    buffered = BytesIO()
                    localImg[0].save(buffered, format="png")
                    img_str = base64.b64encode(
                        buffered.getvalue()).decode("utf-8")

                    doc.license_signature_img = 'data: image/png;base64, ' + img_str  # type: ignore

                content = frappe.render_template(
                    'templates/license/licensedefault.html', {'doc': doc})
                content = f"<html>{content}</html>"
                return content

            return "Not found"

    frappe.throw("Request is invalid")


@frappe.whitelist(allow_guest=True)
def login_via_line(code: str, state: str):
    provider = "line"
    decoder = decoder_compat
    info = get_info_via_oauth(provider, code, decoder, id_token=True)
    logger.debug("TEST")
    logger.debug(info)
    login_oauth_user(info, provider=provider, state=state)


def decoder_compat(b):
    # https://github.com/litl/rauth/issues/145#issuecomment-31199471
    return json.loads(bytes(b).decode("utf-8"))


# create api for register
@frappe.whitelist(allow_guest=True)
def sign_up(email: str, full_name: str, redirect_to: str) -> tuple[int, str]:
    if is_signup_disabled():
        frappe.throw(_("Sign Up is disabled"), title=_("Not Allowed"))

    user = frappe.db.get("User", {"email": email})
    if user:
        if user.enabled:
            return 0, _("Already Registered")
        else:
            return 0, _("Registered but disabled")
    else:
        if frappe.db.get_creation_count("User", 60) > 300:
            frappe.respond_as_web_page(
                _("Temporarily Disabled"),
                _(
                    "Too many users signed up recently, so the registration is disabled. Please try back in an hour"
                ),
                http_status_code=429,
            )

        from frappe.utils import random_string

        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "first_name": escape_html(full_name),
                "enabled": 1,
                "new_password": random_string(10),
                "user_type": "Website User",
            }
        )

        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()

        # set default signup role as per Portal Settings
        default_role = frappe.db.get_single_value(
            "Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role)

        if redirect_to:
            frappe.cache.hset("redirect_after_login", user.name, redirect_to)

        if user.flags.email_sent:
            return 1, _("Please check your email for verification")
        else:
            return 2, _("Please ask your administrator to verify your sign-up")


@frappe.whitelist(allow_guest=True)
def register():
    request = frappe.form_dict

    profileUser = frappe.db.get("User", {"email": request.email})
    if profileUser:
        return 0
    else:
        profileUser = frappe.get_doc(
        {
            "doctype": "UserProfile",
            "fullname": request.fullname,
            "nationality": request.nationality,
            "race": request.race,
            "birthdate": request.birthdate,
            "tel": request.tel,
            "email": request.email,
            "address_no": request.address_no,
            "address_moo": request.address_moo,
            "address_soi": request.address_soi,
            "address_road": request.address_road,
            "address_district": request.address_district,
            "address_amphur": request.address_amphur,
            "address_province": request.address_province,
            }
        )

        profileUser.flags.ignore_permissions = True
        profileUser.flags.ignore_password_policy = True
        profileUser.insert()

        return 1


@frappe.whitelist(allow_guest=True)
def createUser():
    request = frappe.form_dict

    user : User = frappe.db.get("User", {"email": request.email}) # type: ignore
    if user:
        if user.enabled:
            return "Already Registered"
        else:
            return "Registered but disabled"
    else:
        from frappe.utils import random_string
        user  = frappe.get_doc(
                {
                    "doctype": "User",
                    "email": request.email,
                    "first_name": request.fullname,
                    "enabled": 1,
                    "new_password": request.pwd,
                    "user_type": "Website User",
                }
            ) # type: ignore

        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()

        default_role = frappe.db.get_single_value(
            "Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role)
        return "Please check your email for verification"


@frappe.whitelist(allow_guest=True)
def checkEmail():
    request = frappe.form_dict
    email = frappe.db.get("User", {"email": request.email})
    return email


@frappe.whitelist(allow_guest=True)
def setOwner():
    request = frappe.form_dict
    sql_query = """UPDATE `tabUserProfile`SET owner= %(owner)s WHERE name = %(owner)s"""
    frappe.db.sql(sql_query,{'owner' : request.email})
    frappe.db.commit()


@frappe.whitelist(allow_guest=True)
def checkTel():
    request = frappe.form_dict
    tel = frappe.db.get("UserProfile", {"tel": request.tel})
    return tel


@frappe.whitelist(allow_guest=True )
def app_register():
    
    request = frappe.form_dict
    if 'register' in request :
        registerReq = request['register']

        registerReq['doctype'] = 'User'
        registerReq['new_password'] = registerReq['password']
        user = frappe.get_doc(
            registerReq
        )
        
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()
        
        default_role = frappe.db.get_single_value(
            "Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role) # type: ignore
        return "Please check your email for verification"



