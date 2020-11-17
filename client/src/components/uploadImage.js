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
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    height: "180px",
    padding: "10px",
    border: "1px solid black",
  },
});

const UploadImage = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState({
    id: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios.get("/account").then((res) => {
      setValues({
        id: res.data._id,
        imageUrl: res.data.imageUrl,
      });
    });
  }, []);

  const onDropAccepted = (acceptedFiles) => {
    let data = new FormData();
    data.append("id", values["id"]);
    data.append("image", acceptedFiles[0]);

    axios
      .post("/uploadImage", data)
      .then((res) => {
        // TODO: Reload the image without having to refresh the entire page
        setValues({ id: values["id"], imageUrl: res.data.imageUrl });
        console.log("Image URL successfully set: " + res.data.imageUrl);
        window.location.reload();
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
                <CardMedia>
                  <img
                    src={values["imageUrl"]}
                    alt="Profile Picture"
                    className={classes.media}
                  />
                </CardMedia>
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
