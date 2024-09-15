# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document
from frappe.core.doctype.file.file import File
from maechan.maechan_water.doctype.watergate.watergate import WaterGate


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


class ImportWaterGate(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF

        amended_from: DF.Link | None
        geojson_file: DF.Attach | None
        status: DF.Literal['Ready', 'In Progress', 'Finished']

    # end: auto-generated types

    @frappe.whitelist()
    def preview(self):
        file = self.geojson_file
        if file:
            _file: File = frappe.get_doc(
                "File", {"file_url": file})  # type: ignore
            return readJson(_file.get_full_path())

    pass

    @frappe.whitelist()
    def import_data(self):
        file = self.geojson_file
        self.status = "In Progress"
        self.save()
        if file:
            _file: File = frappe.get_doc(
                "File", {"file_url": file})  # type: ignore
            geojsonDict = jsonToDict(_file.get_full_path())
            if geojsonDict == None or 'features' not in geojsonDict:
                frappe.throw("Import file is not valid.")
                return
            n = len(geojsonDict['features'])
            j = 0
            success = []
            failed = []
            for i in geojsonDict['features']:
                j += 1
                frappe.publish_progress(
                    int(j / n * 100), "Import Data Progress")

                waterGateList: list = frappe.db.get_list('WaterGate', filters={
                    "id": str(i['properties']['id']),
                    "fid": str(i['properties']['fid']),
                }, fields=['*'])  # type: ignore

                # return len(waterGateList), i['properties']['id'],i['properties']['fid']
                if len(waterGateList) == 1:
                    waterGate: WaterGate = frappe.get_doc(
                        "WaterGate", waterGateList[0].name)  # type: ignore
                else:
                    waterGate: WaterGate = frappe.get_doc({
                        'doctype': 'WaterGate',
                        "id": str(i['properties']['id']),
                        "fid": str(i['properties']['fid'])
                    })  # type: ignore
                    
                try:

                    waterGate.geojson = json.dumps(i)
                    waterGate.lat = i['geometry']['coordinates'][1]
                    waterGate.lng = i['geometry']['coordinates'][0]
                    waterGate.status =i['properties']['Status']
                    waterGate.fid =i['properties']['fid']
                    waterGate.id =i['properties']['id']
                    waterGate.title =i['properties']['name']
                    waterGate.image = i['properties']['Photo']
                    waterGate.save()
                    success.append(i)
                except Exception as e:
                    failed.append(i)
                    return type(waterGate), waterGate
            self.status = "Finished"
            self.save()
            self.submit()
            return {
                'total': len(geojsonDict['features']),
                'success': success,
                'failed': failed
            }
        return None
