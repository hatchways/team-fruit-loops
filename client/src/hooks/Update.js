import { useState } from "react";

const useForceUpdate = () => {
  const [updateView, setUpdateView] = useState(0);

  return () => setUpdateView(updateView + 1);
};

export default useForceUpdate;
