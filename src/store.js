const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

//The difference between this reducer and reducer of useReducer hook is that, here we pass the initialState as default value of state
function reducer(state = initialState, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) {
        return state;
      }
      //MORE CODE LATER
      return { ...state, loan: action.payload };

    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    default:
      //Here instead of creating and returning a new Error we return back the state, in case of unknown action type
      return state;
  }
}
