import { AppBar, Box, Toolbar } from "@mui/material";
import { Link , LinkProps} from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, handleLogout }) => {
  return (
    <AppBar sx={{ color: 'white' }}>
      <Toolbar>
        <Box flexGrow={1}>
          <NavLink to="/" style={{ color: 'white', marginRight: '10px' }}>
            <h2>City Search App</h2>
          </NavLink>
        </Box>
        {isLoggedIn ? (
          <Box sx={{ p: 2 }}>
            <NavLink to="/dashboard" style={{ color: 'white', marginRight: '10px' }}>
              Dashboard
            </NavLink>
            <NavLink to="/login" style={{ color: 'white', marginRight: '10px' }} onClick={handleLogout}>
              Logout
            </NavLink>
          </Box>
        ) : (
          <>
            <NavLink to="/login" style={{ color: 'white', marginRight: '10px' }}>
              Login
            </NavLink>
            <NavLink to="/register" style={{ color: 'white', marginRight: '10px' }}>
              Register
            </NavLink>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, ...rest }) => {
  return (
    <Link to={to} style={{ color: 'white', marginRight: '10px' }} {...rest}>
      {children}
    </Link>
  );
};

export default Navbar;
