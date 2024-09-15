import { Autocomplete, AutocompleteItem, BreadcrumbItem, Breadcrumbs, Button, Input, Skeleton } from "@nextui-org/react"
import { useAsyncList } from "@react-stately/data";
import { FrappeConfig, FrappeContext, useFrappeGetDoc, } from "frappe-react-sdk";
import { useContext, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAlertContext } from "../../providers/AlertProvider";
import { IBusiness } from "../../interfaces";
import { HouseSelectAutoComplete } from "../../components/houseSelectAutoComplete";

function BusinessEdit() {


    const { call } = useContext(FrappeContext) as FrappeConfig
    const navigate = useNavigate()
    const params = useParams()

    const [createForm, setCreateForm] = useState({
        business_name: "",
        business_address: "",
    } as IBusiness)

    useEffect(() => {
        setIsLoading(true)

        call.post("maechan.maechan_license.doctype.business.business.get_business_by_name", {
            name: params.id
        }).then(r => {
            setCreateForm(r.message)
            setIsLoading(false)
            console.log(r.message.business_address)

        })

    }, [])

    const updateForm = (key: string, value: string) => {
        setCreateForm({
            ...createForm,
            [key]: value
        })

    }

    const alert = useAlertContext()
    const [loading, setIsLoading] = useState(true)
    const submit = async () => {
        // console.log(createForm)
        let isValid = true//validate()
        setIsLoading(true)
        if (isValid) {
            try {
                let result = await call.post("maechan.maechan_license.doctype.business.business.update_business", {
                    'business': createForm
                })
                console.log('submit result', result)
                setCreateForm(result.message)

            } catch (error) {
                console.log(error)
                alert.showError(JSON.stringify(error))
            }

        }
        setIsLoading(false)

    }


    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/business'}>กิจการของท่าน</Link></BreadcrumbItem>
                <BreadcrumbItem>แก้ไขกิจการ : {params.id}</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                แก้ไขกิจการ : {params.id}
            </div>

            <div className="flex flex-row lg:w-[50%] mb-3">
                <Skeleton isLoaded={!loading} className="rounded-lg w-full">
                    <Input type="text"
                        isRequired label="ชื่อกิจการ" placeholder="กรุณาระบุชื่อกิจการ" name="business_name" value={createForm.business_name} onChange={(e) => { updateForm('business_name', e.target.value) }} />
                </Skeleton>
            </div>

            <div className="flex flex-row lg:w-[50%] mb-3">
                <Skeleton isLoaded={!loading} className="rounded-lg w-full">
                    <Input type="text"
                        label="เบอร์โทรศัพท์" placeholder="เบอร์โทรศัพท์" name="tel" value={createForm.tel} onChange={(e) => { updateForm('tel', e.target.value) }} />
                </Skeleton>
            </div>

            <div className="flex flex-row lg:w-[50%] mb-3">
                <Skeleton isLoaded={!loading} className="rounded-lg w-full">
                    {
                        true ? (<HouseSelectAutoComplete
                            selectedKey={createForm.business_address}
                            onSelectionChange={(v: string) => { updateForm("business_address", v) }} />) : null
                    }
                </Skeleton>
            </div>
            <div className="flex flex-row lg:w-[50%]">
                <Button isLoading={loading} color="primary" className="mr-3" onClick={submit}>บันทึก</Button>
                <Button isLoading={loading} color="default" onClick={() => navigate('/business')}>ยกเลิก</Button>
            </div>


        </div>


    )
}

export default BusinessEdit