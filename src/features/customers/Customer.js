import { useSelector } from "react-redux";

function Customer() {
  const customer = useSelector(store => store.customer.fullName)//here store.customer is the name we provided as key to customerReducer in store.js
  console.log(customer)
  return <h2>👋 Welcome, {customer}</h2>;
}

export default Customer;
