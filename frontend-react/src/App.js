import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PackagePage from "./pages/PackagePage";
import ApprovePackagesPage from "./pages/ApprovePackagesPage.";
import HeaderSite from "./components/HeaderSite";


const client = new ApolloClient({
  uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache()
})


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
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
