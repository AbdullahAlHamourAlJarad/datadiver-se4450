import { AppBar, Box, IconButton, Toolbar, styled } from '@mui/material'
import React, { useContext } from 'react'
import Logo from './Logo'
import { AuthContext } from '../AuthProvider'

type HeaderProps = {
    drawerOpen: boolean
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header = ({drawerOpen, setDrawerOpen}: HeaderProps) => {
    const Container = styled(AppBar)({
        height: '10%',
        backgroundColor: '#5A6C83'
    })

    const DrawerButton = styled(IconButton)({
        color: '#DCDCDF',
        marginBottom: '5px',
        '&:hover': {
            backgroundColor: '#3E4B5B'
        }
    })

    const {user} = useContext(AuthContext);

    return (
        <Container>
            <Toolbar>
                <Box sx={{ width: '100%' }}>
                    <Logo />
                </Box>
                {user.isAuthenticated && <DrawerButton onClick={() => setDrawerOpen((prevState: boolean) => !(prevState))}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30px"
                        width="30px"
                        viewBox="0 0 24 24"
                        fill="#262A38">
                        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 17h-12v-2h12v2zm0-4h-12v-2h12v2zm0-4h-12v-2h12v2z" />
                    </svg>
                </DrawerButton>}
            </Toolbar>
        </Container>
    )
}

export default Header