import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  List, ListItem, ListItemText,
} from "@material-ui/core";
import PropTypes from 'prop-types';

import {
  OwnMessage, OtherMessage, EventMessage, NotificationMessage,
} from "./Messages";

const mockChat = [
  {type: "chat", author: "Bonnie", text: "I vote for dog"},
  {type: "action", author: "Bonnie", text: "voted for 'Dog'"},
  {type: "action", author: "Kayla", text: "voted for 'Dog'"},
  {type: "chat", author: "Kayla", text: "Me to"},
  {type: "chat", author: "Tommy", text: "Why dog?"},
  {type: "chat", author: "Bonnie", text: "Dog is an animal!"},
  {type: "action", author: "Tommy", text: "voted for 'Dog'"},
  { type: "notification", text: "All team voted for 'Dog'", },
];

const styles = theme => ({
  window: {
    overflowY: "scroll",
    height: "auto",
    maxHeight: "45vh",
    marginTop: theme.spacing(1),
  },
  nopadding: {
    paddingTop: 0,
    paddingBottom: theme.spacing(1),
  },
  floatRight: {
    float: "right",
  }
});

const Chat = ({ player, classes }) => {
  const [chats, ] = useState(mockChat);
  const isSelf = author => author === player ? "You" : author;

  return (
    <List className={classes.window}>
      {
        chats
          .map(({ type, author, text }, i) => {
            const props = { key: i, text };
            if (type === "chat" && player === author) {
              return <OwnMessage {...props}/>;
            } else if (type === "chat") {
              return <OtherMessage {...props} author={author}/>;
            } else if (type === "action") {
              return <EventMessage {...props} author={isSelf(author)}/>;
            } else if (type === "notification") {
              return <NotificationMessage {...props}/>;
            }
            if (process.env.NODE_ENV === "development") {
              console.log(`Unknown chat type: ${type}`);
            };
            return false;
          })
          .map((Component, i) => (
            <ListItem dense key={i} classes={{gutters: classes.nopadding}}>
              <ListItemText>{ Component }</ListItemText>
            </ListItem>
          ))
      }
    </List>
  );
};

Chat.propTypes = {
  player: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

const SidebarChat = withStyles(styles)(Chat);

export default SidebarChat;
