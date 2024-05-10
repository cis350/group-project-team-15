import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { AccountCircle } from '@mui/icons-material';
import { Divider } from '@mui/material';

import { useAuth } from "../auth/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

/**
 * Navigation bar component using Material-UI. Provides a responsive navigation drawer, and login/logout functionality.
 * The navigation bar includes a toggleable drawer for navigation links, a title that also acts as a home link, and a login or logout button depending on the authentication state.
 *
 * Uses the `useAuth` hook to access the authentication state and `useNavigate` for routing.
 *
 * @returns {JSX.Element} A component that displays a navigation bar with a drawer and login/logout button.
 */
export function NavBar() {

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: 'My Profile', path: '/', icon: <AccountCircle /> },
    { text: 'Marketplace', path: '/marketplace', icon: <StorefrontIcon /> }
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem>
          <Typography sx={{fontWeight:'bold'}}>Menu</Typography>
        </ListItem>
        <Divider />
        {menuItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding onClick={() => navigate(path)}>
            <ListItemButton>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <button sx={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}
              onClick={() => navigate('/')}>
              SkillExchange
            </Typography>
          </button>
          {isLoggedIn ? (
            <Button color="inherit" onClick={logout} sx={{ml:'auto'}}>Logout</Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/")} sx={{ml:'auto'}}>Login</Button>
          )}
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const NavBarPage = () => {
  return (
    <div>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default NavBarPage;