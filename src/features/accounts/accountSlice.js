import { createSlice } from "@reduxjs/toolkit"; //createSlice will automatically create Action Creators from our reducers.It makes writing reducers easier(no need of switch case) and also automatically handles the default case.Third, we can now mutate state inside reducers("Immer" library will convert it back to immutable logic behind the scenes)

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({//returns a slice

  name: "account", //name of slice
  initialState,
  reducers: {
    //One reducer per action.Each reducer receives current state and action.Notice than in Classic Redux reducer, the action type was 'account/deposit' which is actually the same here, because, RTK combines 'name' and 'reducer function's names', example 'account/deposit'.
    //Since we can now write mutating logic, we do not create new object or return state.

    deposit(state, action) {
      //Here we are not writing code for the asynchronous data (thunk logic for currency converter) as of now.This is why we are also not writing any logic for 'isLoading' property of state.
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    },

    /*
    //Gives NaN value when the user tries to request a loan
    //When the Redux CDT is evaluated we see that the action object has payload set to only the 'loanAmount' when the action 'account/requestLoan' is dispatched. The 'loanPurpose' is nowhere in the action object.
    //The reason is that the automatically created Action Creator functions accept only one argument.Hence, it takes only the first argument it receives i.e the loanAmount.Therefore this becomes action.payload = 1000 (example)
    //The solution is to prepare the data before it reaches the reducer, the modified working code is written below this code
    requestLoan(state, action) {
      console.log(action);

      if (state.loan > 0) return;
      state.balance = state.balance + action.payload.amount;
      state.loan = action.payload.amount;
      state.loanPurpose = action.payload.purpose;
    },*/

    requestLoan: {
      prepare(amount, purpose) {//can receive any number of parameters
        return {
          //This object becomes the payload object in the reducer
          payload: { amount, purpose },
        };
      },

      reducer(state, action) {
        if (state.loan > 0) return; //if loan already exists we don't return state, we simply return from this function.Since now we are using mutating logic, we dont want to modify anything in this case, hence we simple return.

        state.balance = state.balance + action.payload.amount;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
      },
    },

    payLoan(state, action) {
      state.balance = state.balance - state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    }
  },
});

export function deposit(amount, currency) {
  if(currency === 'USD') return { type: "account/deposit", payload: amount };

  return async function(dispatch) {//It will internally receive the dispatch function
    dispatch({type: "account/convertingCurrency"});

    //API Call
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);

    const data = await res.json();
    const converted = data.rates.USD;
    dispatch({ type: "account/deposit", payload: converted });
  }
}

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;

/*
//Classic Redux
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) {
        return state;
      }

      return {
        ...state,
        balance: state.balance + action.payload.amount,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
      };

    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertingCurrency":
      return {
        ...state, 
        isLoading: true
      }
    default:
      //Here instead of creating and returning a new Error we return back the state, in case of unknown action type
      return state;
  }
}

//Action Creators
export function deposit(amount, currency) {
  if(currency === 'USD') return { type: "account/deposit", payload: amount };

  return async function(dispatch) {//It will internally receive the dispatch function
    dispatch({type: "account/convertingCurrency"});

    //API Call
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`);

    const data = await res.json();
    const converted = data.rates.USD;
    dispatch({ type: "account/deposit", payload: converted });
  }
}

export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

export function payLoan() {
  return { type: "account/payLoan" };
}
*/
