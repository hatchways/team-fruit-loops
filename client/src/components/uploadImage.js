import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dropzone from "react-dropzone";

import {
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const UploadImage = (props) => {
  const classes = useStyles();

  const [imageUrl, setImageUrl] = useState(props.values["imageUrl"]);

  const onDropAccepted = (acceptedFiles) => {
    let data = new FormData();
    data.append("id", props.values["id"]);
    data.append("image", acceptedFiles[0]);

    axios
      .post("/uploadImage", data)
      .then((res) => {
        setImageUrl(res.data.imageUrl);
      })
      .catch((err) => {});
  };

  return (
    <Dropzone
      onDropAccepted={onDropAccepted}
      accept="image/*"
      minSize={0}
      maxSize={5242880}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].size > 5242880;
        return (
          <div {...getRootProps()}>
            <Card>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={imageUrl !== "" ? imageUrl : ""}
                  title="Profile Picture"
                ></CardMedia>
                <input {...getInputProps()} />
                {!isDragActive &&
                  "Click here or drop a valid image file to set as your profile picture."}
                {isDragActive && !isDragReject && "Valid file"}
                {isDragReject && "File type not accepted"}
                {isFileTooLarge && (
                  <div className="text-danger mt-2">
                    File is too large (Please select a file under 5 MB).
                  </div>
                )}
              </CardActionArea>
            </Card>
          </div>
        );
      }}
    </Dropzone>
  );
};

export default UploadImage;
