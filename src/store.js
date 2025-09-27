
import {configureStore} from "@reduxjs/toolkit";//configureStore wraps around createStore of classic Redux and provides more functionality.It automatically combines our reducers, adds thunk and setup devtools.In the end our store is created and returned.

import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";

const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer
  }
})

export default store;