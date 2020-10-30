import React, {Component} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import ListItemText from "@material-ui/core/ListItemText";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

class CustomDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        }
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
    }


    handleDrawerToggle() {
        this.setState(prevState => ({
            mobileOpen: !prevState.mobileOpen
        }));
    }

    render() {
        const container = this.props.window !== undefined ? () => this.props.window().document.body : undefined;
        return (
            <div style={{display: "flex"}}>
                <CssBaseline/>
                <AppBar style={{
                    width: `calc(100% - 240px)`,
                    marginLeft: "240"
                }} position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={this.handleDrawerToggle}
                            style={{
                                marginRight: "16px",
                                marginLeft: "-12px"
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Responsive drawer
                        </Typography>
                        <nav>
                            <RouterLink to={"/t/messages"}>
                                <Button variant="outlined" style={{margin: "8px 12px"}}>
                                    Messages
                                </Button>
                            </RouterLink>
                            <Link variant="button" color="textPrimary" href="#" style={{margin: "8px 12px"}}>
                                Enterprise
                            </Link>
                            <Link onClick={(e) => this.testRoute(e)} variant="button" color="textPrimary" href="#"
                                  style={{margin: "8px 12px"}}>
                                Routing
                            </Link>
                            <RouterLink to={"/login"}>
                                <Button variant="outlined" style={{margin: "8px 12px"}}>
                                    Login
                                </Button>
                            </RouterLink>
                        </nav>
                    </Toolbar>
                </AppBar>
                <nav style={{
                    width: "240px",
                    flexShrink: "0",
                }} aria-label="mailbox folders">
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            style={{width: "240px"}}
                        >
                            <div>
                                <div style={{minHeight: "64px"}}/>
                                <Divider/>
                                <List>
                                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                                        <ListItem button key={text}>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                            <ListItemText primary={text}/>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider/>
                                <List>
                                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                                        <ListItem button key={text}>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                            <ListItemText primary={text}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            style={{width: "240px"}}
                            variant="permanent"
                            open
                        >
                            <div>
                                <div style={{minHeight: "64px"}}/>
                                <Divider/>
                                <List>
                                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                                        <ListItem button key={text}>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                            <ListItemText primary={text}/>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider/>
                                <List>
                                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                                        <ListItem button key={text}>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                            <ListItemText primary={text}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Drawer>
                    </Hidden>
                </nav>
                <main style={{
                    padding: "24px",
                    flexGrow: "1"
                }}>
                    <div style={{minHeight: "64px"}}/>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                        facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                        gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                        donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                        Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                        imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                        arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                        donec massa sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                        facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                        tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                        consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                        vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                        hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                        tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                        nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                        accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </main>
            </div>
        )
    }
}

export default CustomDrawer