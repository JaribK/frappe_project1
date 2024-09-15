# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document
import json
import time


def readJson(jsonFile):

    with open(jsonFile, encoding='utf-8') as file:
        # load csv file data using csv library's dictionary reader
        json = file.read()

    return json


def jsonToDict(jsonFile):
    jsonstr = readJson(jsonFile)
    if jsonstr:
        geojson = json.loads(jsonstr)
        return geojson
    return None


def getCenterLatLng(coordinates):
    lat = 0.0
    lng = 0.0
    for x in coordinates:
        lat += x[1]
        lng += x[0]
    lat = lat / len(coordinates)
    lng = lng / len(coordinates)

    return (lat, lng)

from frappe.core.doctype.file.file import File
from maechan.maechan_core.doctype.land.land import Land
class ImportLand(Document):

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        geojson_file: DF.Attach | None

    @frappe.whitelist()
    def preview(self):
        file = self.geojson_file
        if file:
            _file : File = frappe.get_doc("File", {"file_url": file}) # type: ignore
            return readJson(_file.get_full_path())

    @frappe.whitelist()
    def import_land(self):
        file = self.geojson_file
        self.status = "In Progress"
        self.save()
        if file:
            _file : File = frappe.get_doc("File", {"file_url": file}) # type: ignore
            geojsonDict = jsonToDict(_file.get_full_path())
            if geojsonDict == None or 'features' not in geojsonDict :
                frappe.throw("Import file is not valid.")
                return
            n = len(geojsonDict['features'])
            j = 0
            success = []
            failed = []
            for i in geojsonDict['features']:
                j += 1
                frappe.publish_progress(
                    int(j / n * 100), "Import Land Progress")

                moo = frappe.db.get_list('District', filters={
                    'moo': i['properties']['Moo']
                }, fields=['*'],)
                if len(moo) == 1:
                    if (i['properties']['PARCEL_COD'] == None):
                        failed.append(i)

                        pass
                    else:

                        lands : list[Land] = frappe.db.get_list('Land', filters={
                            "PARCEL_COD": i['properties']['PARCEL_COD'],
                            "district_id": moo[0].name
                        }, fields=['*'],) # type: ignore

                        if len(lands) == 1:
                            land : Land = frappe.get_doc(
                                "Land", i['properties']['PARCEL_COD']) # type: ignore
                        else:
                            land : Land = frappe.get_doc({
                                'doctype': 'Land',
                                "parcel_cod": i['properties']['PARCEL_COD'],
                                "district_id": moo[0].name
                            }) # type: ignore

                        try:

                            land.geojson = json.dumps(i)
                            land.lat, land.lng = getCenterLatLng( # type: ignore
                                i['geometry']['coordinates'][0][0]) 
                            land.lot = i['properties']['LOT']
                            land.parcel_no = i['properties']['PARCEL_NO']
                            land.zone_id = i['properties']['ZONE_ID']
                            land.block_id = i['properties']['BLOCK_ID']
                            land.land_owner = i['properties']['Name']
                            land.land_size = i['properties']['RAI-NGAN-W']
                            land.land_type = i['properties']['land_type']
                            land.save()
                            success.append(i)
                        except Exception as e:
                            failed.append(i)
                            return type(land), land
                else:
                    failed.append(i)
                    # frappe.throw("District is inconsistency")
            self.status = "Finished"
            self.save()
            self.submit()
            return {
                'total': len(geojsonDict['features']),
                'success': success,
                'failed': failed
            }
        return None
