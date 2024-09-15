import { BreadcrumbItem, Breadcrumbs, Button, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { FrappeConfig, FrappeContext, useFrappeGetDocList, useSWR } from "frappe-react-sdk"
import { useContext, useEffect, useMemo, useState } from "react"
import { useAlertContext } from "../../providers/AlertProvider"
import { FaEdit, FaHome } from "react-icons/fa"
import { IBusiness } from "../../interfaces"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa6"




function BusinessIndex() {

    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res.message);


    const { data, error, isLoading } = useSWR(
        "maechan.maechan_license.doctype.business.business.get_businesses",
        fetcher
    );

    const [businesses, setBusinesses] = useState([])
    const alert = useAlertContext()

    useEffect(() => {
        setBusinesses(data)
    }, [data])

    const navigate = useNavigate()


    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/business/create")}
                    color="primary" endContent={<FaPlus />}>เพิ่มกิจการ</Button>
            </div>
        )
    }, [])

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/business'}>กิจการของท่าน</Link></BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                รายการกิจการของท่าน
            </div>

            <div className="flex flex-row w-full text-xl mb-3">
                <Skeleton isLoaded={!isLoading} className="w-full rounded-lg">
                    <Table isStriped shadow="none" aria-label="รายการกิจการ"
                        topContent={topContent}
                        topContentPlacement="outside"
                        classNames={{
                            wrapper: 'p-0'
                        }}

                    >
                        <TableHeader>
                            <TableColumn>ชื่อกิจการ</TableColumn>
                            <TableColumn>ที่อยู่</TableColumn>
                            <TableColumn>โทร</TableColumn>
                            <TableColumn>การกระทำ</TableColumn>
                        </TableHeader>

                        <TableBody emptyContent={"No rows to display."}>
                            {
                                businesses?.map((b: IBusiness & { business_address_text_display: string }) => (
                                    <TableRow key={b.name}>
                                        <TableCell>{b.business_name}</TableCell>
                                        <TableCell>{b.business_address_text_display}</TableCell>
                                        <TableCell>{b.tel}</TableCell>

                                        <TableCell>
                                            <div className="flex flex-row w-fit gap-2">
                                                <Tooltip placement="top" content="แก้ไข" >
                                                    <span
                                                        onClick={() => { navigate(`/business/${b.name}/edit`) }}
                                                        className="text-lg cursor-pointer active:opacity-50">
                                                        <FaEdit />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </Skeleton>
            </div>

            <div className="flex flex-row w-full mb-3">
                หากต้องการลบให้ติดต่อผู้ดูแลระบบ
            </div>



        </div>
    )
}

export default BusinessIndex