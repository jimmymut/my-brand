import Layout from "../components/Layout";

const Home = () => {
  return (
    <div className="landing-main">
      <Layout isHome={true}>
        <div className="landing-designdiv">
          <h1>Coding is fun.</h1>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
