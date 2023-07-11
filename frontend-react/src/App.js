import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PackagePage from "./pages/PackagePage";
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
        <PackagePage></PackagePage>
      </div>
    </ApolloProvider>
  );
}

export default App;
