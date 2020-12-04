import { useReducer, useCallback } from 'react';

const intentInitial = {
  view: "loading",
  intent: "",
  text: "",
};

const intentReducer = (state, action) => {
  switch(action.type) {
  case "success":
    return { ...state, view: "pay", intent: action.intent };
  case "finished":
    return { ...state, view: "paid", text: action.text };
  case "error":
    return { ...state, view: "pay", err: true };
  default:
    return state;
  }
};

const api = {
  "createIntent": {
    url: name => `/stripe/${name}/intent`,
    method: () => "GET",
    headers: () => ({
      Accept: "application/json",
    }),
    body: () => "",
  }
};

const intentNotLoaded = (name, intent, view, text) => (
  name !== "" && intent === "" && text === "" && (
    view !== "success" || view !== "finished"
  )
);

const useFetchPaymentIntent = name => {
  const [state, dispatch] = useReducer(intentReducer, intentInitial);

  // create payment intent on page load
  const createPaymentIntent = useCallback(async () => {
    try {
      const res = await fetch(api["createIntent"].url(name), {
        method: api["createIntent"].method(),
        headers: api["createIntent"].headers(),
      });

      const state = await res.json();
      dispatch(state);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Error in fetching intent: ${err}`);
      }
      dispatch({ type: "error" })
    }
  }, [name]);

  if (intentNotLoaded(name, state.intent, state.view, state.text)) {
    return createPaymentIntent();
  }

  return {
    view: state.view,
    intent: state.intent,
    text: state.text,
    transitionPaid: () => dispatch({ type: "finished" }),
    transitionError: () => dispatch({ type: "error" }),
  };
};

export default useFetchPaymentIntent;
