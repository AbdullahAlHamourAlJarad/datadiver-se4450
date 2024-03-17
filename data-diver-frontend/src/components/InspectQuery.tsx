import React, {useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { StyledButton } from './Chat';

const InspectQuery = (props: {query: string}) => {
    const [showQuery, setShowQuery] = useState(false);

    const handleOnClick = () => {
        setShowQuery(prevState => !prevState)
    }

    return (
        <StyledButton onClick={handleOnClick}>
            <SearchIcon htmlColor='#D3D3D3' style={{ verticalAlign: "middle" }}/> 
            {showQuery ? props.query :  "Inspect Query"}
        </StyledButton>
    )
}

export default InspectQuery;