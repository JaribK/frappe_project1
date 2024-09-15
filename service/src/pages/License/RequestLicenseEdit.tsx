import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem, Skeleton, Tooltip } from "@nextui-org/react"
import { createRef, useContext, useEffect, useState } from "react"
import { FaHome } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IAmphure, IAttachment, IBusiness, IHouse, IProvince, IRequestDetail, IRequestLicense, IRequestLicenseType, IRequestTypeDetail, ITambon } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAsyncList } from "@react-stately/data"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab } from "@nextui-org/react";
import { FaDownload, FaTrash, FaUpload } from "react-icons/fa6"

export default function RequestLicenseEdit() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()


    const [businesses, setBusinesses] = useState([] as IBusiness[])
    const [requestTypes, setRequestTypes] = useState([] as IRequestLicenseType[])

    const loadBusiness = async () => {
        try {
            let result = await call.post('maechan.maechan_license.doctype.business.business.get_businesses')
            let resquestLicenseTypeResult = await call.post('maechan.maechan_license.doctype.requestlicensetype.requestlicensetype.get_request_license_type')

            console.log(result)
            setBusinesses(result.message)
            setRequestTypes(resquestLicenseTypeResult.message)
        } catch (error) {
            console.log(error)
            alert.showError(JSON.stringify(error))
        } finally {
        }
    }


    let [createForm, setCreateForm] = useState({} as IRequestLicense)
    let [provinces, setProvinces] = useState([] as IProvince[])
    let [amphures, setAmphures] = useState([] as IAmphure[])
    let [districts, setDistricts] = useState([] as ITambon[])
    const [amphureLoad, setAmphureLoad] = useState(false)
    const [districtLoad, setDistrictLoad] = useState(false)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const loadProvinceAmphureDistrict = async (requestLicense: IRequestLicense) => {
        let pcall = call.post("maechan.maechan_core.doctype.province.province.get_all_province").then((r: { message: any; }) => {
            let provincesResult = r.message
            setProvinces(provincesResult)
        })

        let acall = null;
        let tcall = null;

        if (requestLicense.applicant_province) {
            acall = call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                filters: {
                    province_id: requestLicense.applicant_province
                }
            }).then((r: any) => {
                let result = r.message
                setAmphures(result)
            })
        }

        if (requestLicense.applicant_amphur) {
            tcall = call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                filters: {
                    province_id: requestLicense.applicant_province,
                    amphure_id: requestLicense.applicant_amphur
                }
            }).then((r: any) => {
                let result = r.message
                setDistricts(result)
            })
        }

        await Promise.all([pcall, acall, tcall])

    }

    const reloadProvinceAmphurDistrict = async (user_profile: IRequestLicense, key = '') => {


        if (user_profile.applicant_province && key == "applicant_province") {
            setAmphureLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                filters: {
                    province_id: user_profile.applicant_province
                }
            }).then((r: { message: any; }) => {
                let result = r.message
                setAmphures(result)
            }).finally(() => {
                setAmphureLoad(false)
            })

        }

        if (user_profile.applicant_amphur && key == "applicant_amphur") {
            setDistrictLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                filters: {
                    province_id: user_profile.applicant_province,
                    amphure_id: user_profile.applicant_amphur
                }
            }).then((r: any) => {
                let result = r.message
                setDistricts(result)
            }).finally(() => {
                setDistrictLoad(false)
            })
        }
    }


    const updateHouseAutocomplete = async (business_address: string) => {
        call.post("maechan.maechan_core.api.house_filter", { keyword: business_address }).then(
            houses => {
                list.setFilterText(
                    houses.message.find((x: IHouse) => x.name == business_address).text_display
                )
            }
        )
    }

    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestLicense

        if (key == "applicant_province") {
            createFormValue.applicant_amphur = ""
            createFormValue.applicant_distict = ""
        }
        else if (key == "applicant_amphur") {
            createFormValue.applicant_distict = ""
        }
        else if (key == "business") {
            let business = businesses.find(x => x.name == value)
            if (business) {
                createFormValue['house_no'] = business.business_address ?? ''
                createFormValue['house_tel'] = business.tel ?? ''
                setIsLoading(true)
                await updateHouseAutocomplete(business.business_address)
                setIsLoading(false)
            }
        } else if (key == "house_no") {
            let house = list.items.find(x => x.name == value) as IHouse
            console.log(house, key, value)
            list.setFilterText(house?.text_display ?? '')
            if (!value) {
                createFormValue.house_no = ''
            }
        }else if(key == 'request_type'){
            loadRequestLicenseType(createFormValue)
        }
        reloadProvinceAmphurDistrict(createFormValue, key)
        setCreateForm(createFormValue)
    }

    const [workflowTransition, setWorkflowTransition] = useState([] as any[])


    const loadRequestLicense = async () => {
        let response = await call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.load_request_license", {
            name: params.id
        })
        let requestLicense: IRequestLicense = response.message

        setCreateForm(requestLicense)
        setWorkflowTransition(response.transition)
        await updateHouseAutocomplete(requestLicense.house_no)
        await loadProvinceAmphureDistrict(requestLicense)

        return requestLicense

    }

    const [requestLicenseType, setRequestLicenseType] = useState({} as IRequestLicenseType)

    const loadRequestLicenseType = async (requestLicense: IRequestLicense) => {
        if (requestLicense.request_type) {
            let requestTypeResponse = await call.post("maechan.maechan_license.doctype.requestlicensetype.requestlicensetype.findByName", {
                name: requestLicense.request_type
            })

            setRequestLicenseType(requestTypeResponse.message)


        }

    }


    useEffect(() => {
        setIsLoading(true)
        loadBusiness().then(() => {
            loadRequestLicense().then((requestLicense: IRequestLicense) => {
                loadRequestLicenseType(requestLicense).then(() => {
                    setIsLoading(false)
                })

            })
        }).finally(() => {
        })

    }, [])

    let list = useAsyncList<IHouse>({
        async load({ filterText }) {
            let res = await call.post("maechan.maechan_core.api.house_filter", { keyword: filterText })
            return {
                items: res.message,
            };
        },
    });

    const [isSaving, setIsSaving] = useState(false)

    const save = async () => {
        setIsSaving(true)
        let response = await call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.first_step_requestlicense", {
            request: createForm
        })

        console.log(response)
        setCreateForm(response.message)
        setIsSaving(false)
    }

    const updateChild = (child: keyof IRequestLicense, key: string, value: string) => {
        let requestExtras = createForm[child] as IRequestDetail[]
        let childkey = requestExtras.find(x => x.key == key)
        if (childkey) {
            childkey.value = value
        }

        setCreateForm({
            ...createForm
        })
    }

    const renderForm = (x: IRequestTypeDetail, child: keyof IRequestLicense) => {
        let requestExtras = createForm[child] as IRequestDetail[]
        let childkey = requestExtras.find(e => e.key == x.key)
        if (childkey) {
            if (x.datatype == 'Data') {

                if (x.key == "ชื่อสถานประกอบการ") {
                    console.log(x.key, !childkey.value)
                    let business = businesses.find(x => x.name == createForm.business)
                    if (!childkey.value) {
                        childkey.value = business?.business_name ?? ''
                        return (<div key={x.key} className="lg:w-[50%] mb-3">
                            <Input defaultValue={childkey.value} value={childkey.value} label={x.key} type="text" onValueChange={(value) => { updateChild(child, x.key, value) }} />
                        </div>)
                    } else {
                        return (<div key={x.key} className="lg:w-[50%] mb-3">
                            <Input defaultValue={childkey.value} value={childkey.value} label={x.key} type="text" onValueChange={(value) => { updateChild(child, x.key, value) }} />
                        </div>)
                    }

                } else {
                    return (
                        <div key={x.key} className="lg:w-[50%] mb-3">
                            <Input defaultValue={childkey.value} value={childkey.value} label={x.key} type="text" onValueChange={(value) => { updateChild(child, x.key, value) }} />
                        </div>
                    )
                }

            } else if (x.datatype == 'Select') {
                let options = x.options.split('\n')
                return (
                    <div key={x.key} className="lg:w-[50%] mb-3">
                        <Select selectedKeys={[childkey.value]} label={x.key} onSelectionChange={(e) => { updateChild(child, x.key, Array.from(e)[0] as string) }}>
                            {options.map(o => (
                                <SelectItem key={o} value={o}>
                                    {o}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                )
            } else {
                return (
                    null
                )
            }
        } else {
            return null
        }


    }

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin

    const DeleteAttachmentButton = ({ attachment, success, error }: { attachment: IAttachment, success?: (request: any) => void, error?: (err: any) => void }) => {

        const [isLoading, setIsLoading] = useState(false)
        const deleteAttachment = async (a: IAttachment) => {
            setIsLoading(true)
            try {
                let response = await call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.deleteAttachment", {
                    attachment: a
                })
                if (success) {
                    success(response)
                }
            } catch (err) {
                if (error) {
                    error(err)
                }

            } finally {
                setIsLoading(false)
            }

        }

        return (
            <Tooltip showArrow={true} content="Delete">
                <Button isLoading={isLoading} onClick={() => { deleteAttachment(attachment) }} isIconOnly color="danger">
                    <FaTrash />
                </Button>
            </Tooltip>
        )
    }

    const updateAttachment = (req: any) => {
        console.log(req)
        let attachment = req.message
        if (attachment) {
            let createFormValue = { ...createForm }
            let attachmentUpdate = createFormValue.attachment_extra.find(a => a.name == attachment.name)
            if (attachmentUpdate) {
                let index = createFormValue.attachment_extra.indexOf(attachmentUpdate)
                createFormValue.attachment_extra[index] = attachment
                setCreateForm({
                    ...createFormValue
                })
            }
        }
    }

    const UploadAttachmentButton = ({ attachment, success, error }: { attachment: IAttachment, success: (request: any) => void, error: (err: any) => void }) => {

        const { file } = useContext(FrappeContext) as FrappeConfig

        const inputFile = createRef<HTMLInputElement>();

        const [isUploading, setIsUploading] = useState(false)
        const openInputFile = () => {
            inputFile?.current?.click();


        }

        const uploadFile = async (e: any) => {
            setIsUploading(true)
            console.log(e.target.files[0])
            let myFile = e.target.files[0]
            const fileArgs = {
                /** If the file access is private then set to TRUE (optional) */
                "isPrivate": false,
                /** Folder the file exists in (optional) */
                "folder": "home/RequestLicenseAttachment",
                // /** File URL (optional) */
                // /** Doctype associated with the file (optional) */
                // "doctype": "Attachment",
                // /** Docname associated with the file (mandatory if doctype is present) */
                // "docname": attachment.name,
                // /** Field to be linked in the Document **/
                // "fieldname" : "value"
            }

            file.uploadFile(
                myFile,
                fileArgs,
                /** Progress Indicator callback function **/
                (completedBytes, totalBytes) => console.log(Math.round((completedBytes / (totalBytes ?? completedBytes)) * 100), " completed")
            )
                .then((response) => {
                    console.log("File Upload complete")
                    let fileResponse = response.data.message
                    console.log(response)
                    call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.update_attachment", {
                        'fileresponse': fileResponse,
                        'attachment': attachment
                    }).then((req) => {
                        loadRequestLicense().then(() => setIsLoading(false))
                        if (success) {
                            success(req)
                        }
                    }).catch(e => {
                        alert.showError(JSON.stringify(e))
                        if (error) {
                            error(e)
                        }
                    })
                })
                .catch(e => console.error(e))
        }

        return (
            <div>
                <Tooltip aria-label="Upload" showArrow={true} content="Upload">
                    <Button isLoading={isUploading} aria-label="Upload" onClick={openInputFile} isIconOnly color="primary">
                        <FaUpload />
                    </Button>
                </Tooltip>
                <input type="file" id="file" onChange={uploadFile} ref={inputFile} style={{ display: "none" }} />

            </div>
        )
    }

    const workFlowActionButton = () => {
        let currentState = workflowTransition.find(w => w.state == createForm.workflow_state)
        console.log("XXX", createForm.workflow_state)
        if (currentState) {
            return (
                <Button onClick={(_e) => submitDoc(currentState.action)} type="button" color="secondary">{currentState.action}</Button>
            )
        }
        else {
            return null
        }
    }


    const submitDoc = async (action: any) => {
        call.post(`maechan.maechan_license.doctype.requestlicense.requestlicense.citizen_submit`, {
            name: createForm.name,
            state: createForm.workflow_state,
            action: action
        }).then(() => {
            navigate("/licenseRequest")
        }).catch(err => {
            alert.showError(JSON.stringify(err))
        })
    }

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/licenseRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>แก้ไขคำร้องขอใบอนุญาต : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>แก้ไขคำร้องขอใบอนุญาต : {params.id}</div>
                <div>
                    <Button isLoading={isSaving} className="mr-3" color="primary" onClick={save}>บันทึก</Button>
                    {workFlowActionButton()}
                </div>
            </div>

            <Tabs aria-label="Tabs" isDisabled={isLoading}>
                <Tab key="basic_information" aria-label="ข้อมูลพื้นฐาน" title="ข้อมูลพื้นฐาน" className="flex flex-col">
                    <Skeleton isLoaded={!isLoading}>
                        <div className="flex flex-col mb-3 gap-3 sm:flex-row">
                            <div className="flex flex-row lg:w-[50%] w-full">
                                <Select
                                    label="กิจการ"
                                    className=""
                                    onSelectionChange={(key) => { updateForm("business", Array.from(key)[0]) }}
                                    selectedKeys={[createForm.business as string]}
                                >
                                    {businesses.map((b) => (
                                        <SelectItem key={b.name} >
                                            {b.business_name}
                                        </SelectItem>
                                    ))}
                                </Select>

                            </div>
                            <div className="flex flex-row lg:w-[50%] w-full">
                                <Select
                                    label="ประเภทการขออนุญาต"
                                    className=""
                                    selectedKeys={[createForm.request_type as string]}

                                    onSelectionChange={(k) => updateForm('request_type', Array.from(k)[0])}
                                >
                                    {requestTypes.map((b) => (
                                        <SelectItem key={b.name} >
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ลักษณะการดำเนินการ
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <Select
                                label="ลักษณะการดำเนินงาน"
                                className=""
                                selectedKeys={[createForm.license_applicant_type as string]}

                                onSelectionChange={(k) => updateForm('license_applicant_type', Array.from(k)[0])}
                            >
                                <SelectItem key="บุคคลธรรมดา" >บุคคลธรรมดา</SelectItem>
                                <SelectItem key="นิติบุคคล" >นิติบุคคล</SelectItem>
                            </Select>

                            {createForm.license_applicant_type == 'นิติบุคคล' ? (
                                <Input
                                    value={createForm.license_applicant}
                                    name="license_applicant"
                                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                                    type="text" label="ชื่อนิติบุคคลที่ขอใบอนุญาต" />
                            ) : null}
                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ข้อมูลผู้ขอใบอนุญาต
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <Input
                                value={createForm.applicant_name}
                                name="applicant_name"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="ชื่อ-สกุล" />
                            <Input
                                value={createForm.applicant_age as string}
                                name="applicant_age"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="number" label="อายุ" />
                            <Input
                                value={createForm.applicant_nationality}
                                name="applicant_nationality"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="สัญชาติ" />
                            <Input
                                value={createForm.applicant_tel}
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                name="applicant_tel"
                                type="text" label="เบอร์โทรศัพท์" />
                            <Input
                                value={createForm.applicant_fax}
                                name="applicant_fax"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="แฟกซ์" />
                            <Input
                                value={createForm.applicant_ethnicity}
                                name="applicant_ethnicity"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="เชื้อชาติ" />

                        </div>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ที่อยู่ผู้ขอใบอนุญาต
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <Input
                                value={createForm.applicant_no}
                                name="applicant_no"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="เลขที่" />
                            <Input
                                value={createForm.applicant_moo}
                                name="applicant_moo"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="หมู่" />
                            <Input
                                value={createForm.applicant_soi}
                                name="applicant_soi"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="ตรอก/ซอย" />
                            <Input
                                value={createForm.applicant_road}
                                name="applicant_road"
                                type="text" label="ถนน" />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <Select
                                items={provinces}
                                label="จังหวัด"
                                selectedKeys={[createForm.applicant_province]}
                                onSelectionChange={(key) => {
                                    updateForm('applicant_province', Array.from(key)[0])
                                }}
                            >
                                {(province) => <SelectItem key={province.name}>{province.name_th}</SelectItem>}
                            </Select>

                            <Select
                                isLoading={amphureLoad}
                                isDisabled={amphureLoad}
                                items={amphures}
                                label="อำเภอ"
                                selectedKeys={[createForm.applicant_amphur]}
                                onSelectionChange={(key) => updateForm('applicant_amphur', Array.from(key)[0])}

                            >
                                {(amphure) => <SelectItem key={amphure.name}>{amphure.name_th}</SelectItem>}
                            </Select>
                            <Select
                                isLoading={districtLoad}
                                isDisabled={districtLoad}
                                items={districts}
                                label="ตำบล"
                                selectedKeys={[createForm.applicant_distict]}
                                onSelectionChange={(key) => updateForm('applicant_distict', Array.from(key)[0])}

                            >
                                {(district) => <SelectItem key={district.name}>{district.name_th}</SelectItem>}
                            </Select>
                        </div>

                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ที่อยู่สถานประกอบการ
                        </div>
                        <div className="grid gap-3 mb-3 grid-row sm:grid-cols-3">

                            <Autocomplete
                                className="w-full"

                                isRequired
                                inputValue={list.filterText}
                                isLoading={list.isLoading}
                                items={list.items as IHouse[]}
                                label="ที่อยู่กิจการ (บ้านเลขที่)"
                                placeholder="Type to search..."
                                onInputChange={list.setFilterText}
                                onSelectionChange={(key) => updateForm('house_no', key)}
                                selectedKey={createForm.house_no}
                            >
                                {(item: IHouse) => (
                                    <AutocompleteItem key={item.name} className="capitalize">
                                        {item.text_display}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>

                            <Input
                                value={createForm.house_tel}
                                name="house_tel"
                                onChange={(e) => updateForm(e.target.name, e.target.value)}
                                type="text" label="เบอร์โทรศัพท์" />

                        </div>

                        <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                            <Button isLoading={isSaving} className="mr-3" color="primary" onClick={save}>บันทึก</Button>
                            <Button className="mr-3" onClick={() => { navigate("/licenseRequest") }} color="default">ยกเลิก</Button>
                        </div>
                    </Skeleton>
                </Tab>

                <Tab key="extra_information" aria-label="ข้อมูลประกอบ" title="ข้อมูลประกอบ" className="flex flex-col">
                    {requestLicenseType?.details?.map((x: IRequestTypeDetail) => (
                        renderForm(x, "request_extra")
                    ))}

                    <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                        <Button isLoading={isSaving} className="mr-3" color="primary" onClick={save}>บันทึก</Button>
                        <Button className="mr-3" onClick={() => { navigate("/licenseRequest") }} color="default">ยกเลิก</Button>
                    </div>

                </Tab>

                <Tab key="attachments" title="เอกสารแนบ" aria-label="เอกสารแนบ" className="flex flex-col">
                    <Table isStriped shadow="none" aria-label="เอกสารแนบ">
                        <TableHeader>
                            <TableColumn className="text-center">
                                ลำดับ
                            </TableColumn>
                            <TableColumn className="lg:w-4/5">
                                รายการ
                            </TableColumn>
                            <TableColumn className="text-center">
                                ไฟล์
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {createForm?.attachment_extra?.map((a: IAttachment, index: number) => (
                                <TableRow key={a.name}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell>{a.key}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-row justify-center gap-1">
                                            {a.value ? (
                                                <Tooltip showArrow={true} content="Download">
                                                    <Button onClick={() => { window.open(`${siteName}/${a.value}`) }} isIconOnly color="success">
                                                        <FaDownload />
                                                    </Button>

                                                </Tooltip>
                                            ) : null}

                                            {a.value ? (
                                                <DeleteAttachmentButton attachment={a} success={(req) => { updateAttachment(req) }} />
                                            ) : null}

                                            {
                                                !a.value ? (
                                                    <UploadAttachmentButton attachment={a} />
                                                ) : null

                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </Tab>
            </Tabs>
        </div >

    )
}