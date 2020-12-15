import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  List, ListItem, ListItemText,
} from "@material-ui/core";
import PropTypes from 'prop-types';

import {
  OwnMessage, OtherMessage, EventMessage, NotificationMessage,
} from "./Messages";

const styles = theme => ({
  window: {
    overflowY: "auto",
    height: "auto",
    maxHeight: "45vh",
    marginTop: theme.spacing(1),
    display: "flex",
    "flex-direction": "column-reverse",
  },
  nopadding: {
    paddingTop: 0,
    paddingBottom: theme.spacing(1),
  },
  floatRight: {
    float: "right",
  },
});

const chat = [];
let id = undefined;

const Chat = ({ gameID, player, classes, socket }) => {
  if (id === undefined)
    id = gameID;

  if (id !== gameID) {
    id = gameID;
    chat.splice(0, chat.length);
  }

  const [chats, setChats] = useState(chat);
  const isSelf = author => author === player ? "You" : author;

  useEffect(() => {
    const newChatHandler = (type, text, author) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Received (${type}): ${author} ${text}`);
      }
      chat.push({type, text, author});
      setChats(chat);
    }
    socket.on("chat", newChatHandler);

    return () => {
      socket.off('chat', newChatHandler);
    }
  }, [setChats, socket, chats]);

  return (
    <List className={classes.window} >
      {
        chats.slice().reverse()
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
  socket: PropTypes.object.isRequired,
};

const SidebarChat = withStyles(styles)(Chat);

export default SidebarChat;
