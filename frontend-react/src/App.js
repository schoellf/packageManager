import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PackagePage from "./pages/PackagePage";
import ApprovePackagesPage from "./pages/ApprovedPackagesPage.";
import HeaderSite from "./components/HeaderSite";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from './services/notifyer';


const client = new ApolloClient({
  uri: 'http://10.10.10.144:1337/graphql',
  // uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache()
})


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <div>
          <ToastContainer newestOnTop></ToastContainer>
        </div>
        <HeaderSite></HeaderSite>
        <BrowserRouter>
        <Routes>
          <Route index element={<ApprovePackagesPage></ApprovePackagesPage>}></Route>
          <Route path="/admin" element={<PackagePage></PackagePage>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
