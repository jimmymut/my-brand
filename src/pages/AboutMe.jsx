import pict from "../images/jmt 1.png";
import Layout from "../components/Layout";

const AboutMe = () => {
  return (
    <div>
      <Layout>
        <div className="aboutmain-content">
          <div className="aboutme-pic">
            <img src={pict} alt="A short pic of myself" />
          </div>
          <h3>
            Hi!
            <br />I am Jimmy Mutabazi
          </h3>
          <p>
            A Rwandan citizen, studied at the University of Rwanda college of
            Science and Technology Huye and Nyarugenge campuses did the course
            of electronics and Telecommunication Engineering and now I switched
            to Tech where I did a fullstack program of three months at
            I4GxZuri-Training 2022 cohort I where we did HTML, CSS and
            JavaScript on frontend and we did django on backend. In order to
            increase my development skills, I joined Andela program (ATLP) that
            will run through nine (9) months. At this time I will be best in web
            development.
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default AboutMe;
