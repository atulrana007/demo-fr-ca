import React, { Fragment } from "react";

import Hero from "../components/Hero";
import Content from "../components/Content";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { getAccessTokenSilently } = useAuth0();
  const GetSomething = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://api.mcafee.com",
      });
      console.log(token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment>
      <Hero />
      <button onClick={GetSomething}>Click Here</button>
      <hr />
      <Content />
    </Fragment>
  );
};

export default Home;
