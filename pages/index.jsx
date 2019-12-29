import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
const axios = require("axios");
import Articles from "../components/Articles";
const Index = () => {
  // Use the state hook to handle all articles
  const [articles, setArticles] = useState("");
  // Use effect hook to call our articles api and set articles
  useEffect(() => {
    axios.get("/api/articles").then(res => setArticles(res.data));
  }, []);
  return (
    <Container>
      <Articles articles={articles} />
    </Container>
  );
}
export default Index;