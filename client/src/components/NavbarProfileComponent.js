import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  Avatar,
  Typography,
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Divider,
  MenuItem,
  MenuList,
} from "@material-ui/core";

import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  profileButton: {
    textTransform: "none",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  avatar: {
    margin: theme.spacing(2),
  },
}));

const NavbarProfileComponent = (props) => {
  const classes = useStyles();

  // Handle Profile menu open/close
  const [open, setOpen] = useState(false);

  // Create mutable variable to track the menu opening button
  const anchorRef = useRef(null);

  // Toggle function to open and close menu
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Close function to close menu if clicking outside it
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // Key down function to prevent Tab key from scrolling menu options
  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Grid container direction="row">
      <Grid item>
        <Button
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          className={classes.profileButton}
          disableRipple
        >
          {/* TODO: Link this to currently logged in account if applicable */}
          <Avatar alt="Profile Image" className={classes.avatar} />
          <Typography>My Profile</Typography>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement="bottom-end"
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: "right top",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>Account Info</MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};

export default NavbarProfileComponent;
