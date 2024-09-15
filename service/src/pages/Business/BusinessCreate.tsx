import { AsyncListOptions, useAsyncList } from "@react-stately/data";
import { FrappeConfig, FrappeContext, useFrappePostCall } from "frappe-react-sdk";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IBusiness, IHouse } from "../../interfaces";
import { Key } from "@react-types/shared";
import _ from "underscore"
import { Autocomplete, AutocompleteItem, BreadcrumbItem, Breadcrumbs, Button, Input } from "@nextui-org/react";
import { FaHome } from "react-icons/fa";
import { HouseSelectAutoComplete } from "../../components/houseSelectAutoComplete";
function BusinessCreate() {


    const { call } = useContext(FrappeContext) as FrappeConfig
    const navigate = useNavigate()

    const [createForm, setCreateForm] = useState({
        business_name: "",
        business_address: "",
    } as IBusiness)

    const updateForm = (key: string, value: Key) => {
        console.log('updateform', key, value)
        setCreateForm({
            ...createForm,
            [key]: value
        })
    }

    const submit = async () => {
        // console.log(createForm)
        let isValid = true//validate()

        // console.log(isValid)
        if (isValid) {
            try {
                let result = await call.post("maechan.maechan_license.doctype.business.business.add_business", createForm)
                console.log('submit result', result)


                navigate("/business")
            } catch (error) {
                console.log(error)

            }

        }

    }



    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><FaHome /></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/business'}>กิจการของท่าน</Link></BreadcrumbItem>
                <BreadcrumbItem>เพิ่มกิจการ</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                เพิ่มกิจการ
            </div>


            <div className="flex flex-row lg:w-[50%] mb-3">
                <Input type="text"
                    isRequired label="ชื่อกิจการ" placeholder="กรุณาระบุชื่อกิจการ" name="business_name" value={createForm.business_name} onChange={(e) => { updateForm('business_name', e.target.value) }} />

            </div>

            <div className="flex flex-row lg:w-[50%] mb-3">
                <Input type="text"
                    label="เบอร์โทรศัพท์" placeholder="เบอร์โทรศัพท์" name="tel" value={createForm.tel} onChange={(e) => { updateForm('tel', e.target.value) }} />
            </div>

            <div className="flex flex-row lg:w-[50%] mb-3">

                <HouseSelectAutoComplete
                    selectedKey={createForm.business_address}
                    onSelectionChange={(v: string) => { updateForm("business_address", v) }} />

            </div>
            <div className="flex flex-row lg:w-[50%]">
                <Button color="primary" className="mr-3" onClick={submit}>บันทึก</Button>
                <Button color="default" onClick={() => navigate('/business')}>ยกเลิก</Button>

            </div>


        </div>


    )
}

export default BusinessCreate