import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  List, ListItem, ListItemText,
} from "@material-ui/core";

import {
  OwnMessage, OtherMessage, EventMessage
} from "../components/ChatMessages";

const mockChat = [
  {type: "chat", text: "I vote for dog", author: "Sofia"},
  {type: "action", text: "voted for 'Dog'", author: "Sofia"},
  {type: "action", text: "voted for 'Dog'", author: "Kayla"},
  {type: "chat", text: "Me to", author: "Kayla"},
  {type: "chat", text: "Why dog?", author: "Tommy"},
  {type: "chat", text: "Dog is an animal!", author: "Sofia"},
  {type: "action", text: "voted for 'Dog'", author: "Tommy"},
];

const mockEvent = { type: "notification", text: "All team voted for 'Dog'", };

const styles = theme => ({
  window: {
    overflowY: "auto",
    height: "100%",
  },
  chat: {
    overflowY: "hidden",
    maxHeight: "50%",
  },
  nopadding: {
    paddingTop: 0,
    paddingBottom: theme.spacing(1),
  },
});

const GameSidebarChat = withStyles(styles)(({ player = "Sofia", classes }) => {
  const [chats, ] = useState(mockChat),
    [event, ] = useState(mockEvent),
    isSelf = (author, player) => author === player ? "You" : author;

  return (
    <div className={classes.chat}>
      <List className={classes.window}>
        {
          chats
            .map(({ type, author, text }) => {
              if (type === "chat") {
                return player === author
                  ? <OwnMessage text={text}/>
                  : <OtherMessage text={text} author={author}/>;
              }
              return <EventMessage text={text} author={isSelf(author, player)}/>;
            })
            .map((Component, i) => (
              <ListItem dense key={i} classes={{gutters: classes.nopadding}}>
                <ListItemText>
                  { Component }
                </ListItemText>
              </ListItem>
            ))
        }
      </List>
      <div>{ event && event.message }</div>
    </div>
  );
});

export default GameSidebarChat;
