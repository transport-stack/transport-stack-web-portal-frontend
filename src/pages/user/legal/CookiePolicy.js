import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import AddSeo from "../../../utils/AddSeo";
import "../../../assets/styles/legalPages.scss";

const CookiePolicy = () => {
  const { cookiesMeasureStatus } = useSelector((state) => state.cookies);
  const [selectedOption, setSelectedOption] = useState(cookiesMeasureStatus ? "useCookies" : "doNotUseCookies");
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    const data = {
      status: event.target.value === "useCookies",
    };
    dispatch({ type: "useCookiesMeasureRequest", payload: data });
  };

  return (
    <div className="legal-section container mb-5">
      <AddSeo title="Delhi Transport Stack" description="Learn about our cookie policy." />
      <h1>Cookie policy</h1>
      <p>
        This cookie policy is applicable to {window.location.origin}, the
        website for Delhi Transport Stack. We use cookies to collect and store
        information about how you use the&nbsp;
        <a href={window.location.origin} target="_blank" rel="noopener noreferrer">
          {window.location.origin}
        </a>{''}
        &nbsp; website.
      </p>
      <p>
        When you visit this website, a "cookie" may be sent to your computer.
        Cookies are files that are saved on your browser of your phone, or
        computer. A cookie is a piece of data that identifies you as a unique
        user.
      </p>
      <p>
        We use cookies on this website to improve the quality of services and to
        understand the user base of this website better. We do this by storing
        user preferences in cookies and by tracking user trends and patterns of
        how users search.
      </p>
      <p>
        Most browsers are initially set up to accept cookies. You can reset your
        browser to refuse all cookies or to indicate when a cookie is being
        sent. Please note, however, that some parts of the services offered on
        this website may not function properly if you refuse cookies.
      </p>
      <p>
        This policy explains how we use cookies to collect data when you visit
        our website. Read our Privacy Policy [Hyperlink] to find out more about
        the personal data we collect and use it.
      </p>
      <p>The data we collect using cookies includes information about:</p>
      <ul>
        <li>
          Your Internet Protocol (IP) address, browser type and operating system
          used
        </li>
        <li>
          The web pages you visit (surf) on the {window.location.host} website
        </li>
        <li> The web pages you enter and exit the website from</li>
        <li> The time and date of your visit to website </li>
        <li>
          If you have followed a link to this website from another website, the
          address of that website
        </li>
        <li>
          If the visitor reached this website from another website, the address
          of that referring website
        </li>
        <li>
          We make no attempt to link these addresses with the identity of
          individuals visiting our site unless an attempt to damage the site has
          been detected
        </li>
      </ul>
      <p>
        You can use your browser settings to allow, restrict or delete cookies.
        Restricting cookies may limit the services available on the Delhi
        transportstack.in website.
      </p>
      <hr />
      <h2>Cookies on Delhi transportstack.in</h2>
      <p>
        The tables below show detailed information about essential as well as
        non-essential individual cookies used and for the purposes on this
        website.
      </p>
      <h2>Essential cookies</h2>
      <p>
        Essential cookies are necessary for the website to work properly. For
        example, so that you can log in to your account or complete a form.
        These cookies are required to always be on.
      </p>
      <Table>
        <thead>
          <tr>
            <th>Cookie name</th>
            <th>Purpose</th>
            <th>Expiry period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>consent</td>
            <td>
              Used to remember if you have consented to anonymised tracking with
              Google Analytics
            </td>
            <td>1 year</td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <h2>Non-essential cookies</h2>
      <p>
        These Analytical and performance cookies monitor how you use the
        website. This helps us to improve how the website works and the
        experience you have.
      </p>
      <Table>
        <thead>
          <tr>
            <th>Cookie name</th>
            <th>Purpose</th>
            <th>Expiry period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Used to distinguish individual users</td>
            <td>2 years</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>Used to distinguish individual users</td>
            <td>24 hours</td>
          </tr>
          <tr>
            <td>_gat</td>
            <td>Used to limit amount of user requests</td>
            <td>1 minute</td>
          </tr>
          <tr>
            <td>AMP_TOKEN</td>
            <td>A unique ID assigned to each user</td>
            <td>Between 30 seconds and 1 year</td>
          </tr>
          <tr>
            <td>gac</td>
            <td>
              A unique ID that makes Google Analytics and Google Ads work
              together
            </td>
            <td>End of session</td>
          </tr>
        </tbody>
      </Table>
      <hr />
      <h2>Cookie settings for non-essential cookies</h2>
      <p>
        As mentioned above we would like to set additional cookies to understand
        how you use this website, so that we can improve user experience.
      </p>
      <hr />
      <h2>Use cookies that measure my website use</h2>
      <div className="radio-div">
        <input
          type="radio"
          value="useCookies"
          checked={selectedOption === "useCookies"}
          onChange={handleChange}
        />
        <span className="ps-2">Use cookies that measure my website use</span>
      </div>
      <div className="mb-3 radio-div">
        <input
          type="radio"
          value="doNotUseCookies"
          checked={selectedOption === "doNotUseCookies"}
          onChange={handleChange}
        />
        <span className="ps-2">
          Do not use cookies that measure my website use
        </span>
      </div>
      <p>
        You can learn more about how to manage your cookies by visiting the Help
        function of your browser, the settings of your mobile device or you can
        visit,{' '}
        <a
          href="https://www.aboutcookies.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aboutcookies.org
        </a>{' '}
        and
        <a
          href={"https://ico.org.uk/for-the-public/online/cookies/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ico.org.uk/for-the-public/online/cookies/
        </a>{' '}
        which provides detailed information on managing cookies on popular
        browsers.
      </p>
      <p className="mt-3">
        This policy was last updated on <b>16/09/2024</b>
      </p>
    </div>
  );
};

export default CookiePolicy;
