import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core";

const axios = require("axios");

const Profile = () => {
//   useEffect(() => {
//     axios
//       .get("/profile", {
//         headers: {
//           authorization:
//             "Bearer <<token>>",
//         },
//       })
//       .then((res) => {
//         console.log("good");
//       })
//       .catch((err) => {
//         console.log("bad");
//       });
//   });

  let history = useHistory();

  const logout = () => {
    axios
      .get("/logout")
      .then((res) => {
        console.log("Successfully logged out.");
      })
      .catch((err) => {
        console.log("Error: ", err);
      })
      .finally(() => history.push("/login"));
  };

  return (
    <>
      <Button variant="contained" onClick={logout}>
        Logout
      </Button>
    </>
  );
};

export default Profile;
