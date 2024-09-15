import { useAsyncList } from "@react-stately/data";
import { FrappeConfig, FrappeContext } from "frappe-react-sdk";
import { useContext, useEffect, useState } from "react";
import { IHouse } from "../interfaces";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import _ from "underscore"

export function HouseSelectAutoComplete({ selectedKey, onSelectionChange }) {

    const [autoComplete, setAutoComplete] = useState(false)
    const [inputFilterText, setInputFilterText] = useState("")
    const { call } = useContext(FrappeContext) as FrappeConfig

    let list = useAsyncList({
        async load({ signal, filterText }) {

            if (filterText) {
                setAutoComplete(true)
                let res = await call.post("maechan.maechan_core.api.house_filter", { keyword: filterText })
                setAutoComplete(false)
                return {
                    items: res.message,
                };
            } else {
                setAutoComplete(false)

                return {
                    items: [],
                };
            }
        },

    });

    const debounceFilterText = _.debounce((x: string) => {
        list.setFilterText(x)
    }, 1000)

    const reloadAutoCompleted = async () => {

        let res = await call.post("maechan.maechan_core.api.house_filter", { keyword: selectedKey })
        list.items = res.message
        let selItem = (list.items as IHouse[]).find(i => i.name == selectedKey)
        console.log('reload msg', res.message,)
        console.log('reload selectedKey', selectedKey)

        console.log('reload selItem', selItem)

        if (selItem) {
            setInputFilterText(selItem.text_display)
        }
    }
    useEffect(() => {
        reloadAutoCompleted()
    }, [selectedKey])

    useEffect(() => {
        setAutoComplete(true)
        debounceFilterText(inputFilterText)
    }, [inputFilterText])

    return (
        <Autocomplete
            className="w-full"
            isRequired
            inputValue={inputFilterText}
            isLoading={autoComplete}
            items={list.items as IHouse[]}
            label="ที่อยู่กิจการ (บ้านเลขที่)"
            placeholder="Type to search..."
            onInputChange={setInputFilterText}
            selectedKey={selectedKey}
            onSelectionChange={(v) => {
                onSelectionChange(v)
            }}
        // selectedKey={createForm.business_address ? createForm.business_address : null}
        // onSelectionChange={(key) => updateForm('business_address', key)}
        >
            {(item: IHouse) => (
                <AutocompleteItem key={item.name} className="capitalize">
                    {item.text_display}
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}