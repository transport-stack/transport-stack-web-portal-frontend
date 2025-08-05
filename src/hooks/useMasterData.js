import { useEffect, useState } from "react";
import { getDropdownAPI } from "../services/apiservices";

const useMasterData = (servicename, userType, accessTokenRequired = true, additionalParam = false) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchDropdownData = async () => {
            return await getDropdownAPI(servicename, userType, accessTokenRequired);
        };
        fetchDropdownData()
            .then((response) => {
                if (additionalParam) {
                    const options = response?.map((element) => {
                        return { label: element.name, value: element.id, value2: element.dialCode }
                    })
                    setData(options);
                } else {
                    const options = response?.map((element) => {
                        return { label: element.name, value: element.id }
                    })
                    setData(options);
                }


            })
            .catch((error) => {
                console.error(error);
            });


    }, [servicename])

    return { data };
}

export default useMasterData;