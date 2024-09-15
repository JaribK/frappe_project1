# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

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


class ImportHouse(Document):

    @frappe.whitelist()
    def preview(self):
        file = self.geojson_file
        if file:
            _file = frappe.get_doc("File", {"file_url": file})
            return readJson(_file.get_full_path())

    @frappe.whitelist()
    def import_house(self):
        file = self.geojson_file
        self.status = "In Progress"
        self.save();
        if file:
            _file = frappe.get_doc("File", {"file_url": file})
            geojsonDict = jsonToDict(_file.get_full_path())
            n = len(geojsonDict['features'])
            j = 0
            success = []
            failed = []
            for i in geojsonDict['features']:
                j += 1
                frappe.publish_progress(
                    int(j / n * 100), "Import House Progress")

                moo = frappe.db.get_list('District', filters={
                    'moo': i['properties']['Moo']
                }, fields=['*'],)
                if len(moo) == 1:
            
                    house = frappe.db.get_list('House', filters={
                        "house_no": i['properties']['Name'],
                        "district_id": moo[0].name
                    }, fields=['*'],)
                    if len(house) == 1:
                        house = house[0]
                        house = frappe.get_doc("House",house.name)
                        pass
                    else:
                        house = frappe.get_doc({
						'doctype': 'House',
                        "house_no": i['properties']['Name'],
                        "district_id": moo[0].name
                    	})

                    house.house_json = json.dumps(i)
                    if i['geometry'] is not None :
                        house.house_lat = i['geometry']['coordinates'][1]
                        house.house_lng =  i['geometry']['coordinates'][0]
                        house.save()
                    success.append(i)
                else:
                    failed.append(i)
                    # frappe.throw("District is inconsistency")
            self.status ="Finished"
            self.save()
            self.submit()
            return {
                'total': len(geojsonDict['features']),
                'success': success,
                'failed': failed
            }
        return None
