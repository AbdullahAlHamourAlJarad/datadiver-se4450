import React, {useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';

const InspectQuery = (props: {query: string}) => {
    const [showQuery, setShowQuery] = useState(false);

    const handleOnClick = () => {
        setShowQuery(prevState => !prevState)
    }

    return (
        <button style={{backgroundColor: "inherit", color: "#D3D3D3", margin: "0 auto", marginTop: "10px", display: "block" }} onClick={handleOnClick}>
            <SearchIcon htmlColor='#D3D3D3' style={{ verticalAlign: "middle" }}/> 
            {showQuery ? props.query :  "Inspect Query"}
        </button>
    )
}

export default InspectQuery;