import React, { useEffect } from "react";
import AddSeo from "../../../utils/AddSeo";
import "../../../assets/styles/legalPages.scss";

const PolicyDocument = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="legal-section container mb-5">
      <AddSeo title="Delhi Transport Stack" description="Review our privacy policy."/>
      <h1>Privacy policy</h1>
      <p>
        This privacy policy applicable {window.location.origin}, the
        website for Delhi Transport Stack. This website is owned and operated by
        the Transport Department, GNCTD.
      </p>
      <p>
        Your privacy is important to us. Generally, you can visit our site
        without revealing any personal data unless you choose to use the
        services offered on this website. Personal data refers to information
        that can identify you. This Privacy Policy outlines how we collect, use,
        and protect your personal data in relation to the Delhi Transport Stack.
      </p>
      <p>
        We are committed to safeguarding your privacy and ensuring that your
        personal data is handled responsibly and securely, in compliance with
        the DPDP Act 2023, Govt of India. It covers personal data that is
        processed by Delhi Transport Stack or collected on behalf of Transport
        Department, GNCTD.
      </p>
      <hr />
      <h2>What data we collect </h2>
      <p>We collect Personal data Information which includes: </p>
      <ul>
        <li>
          Personal information you provide when you register for an account on {" "}
          {window.location.host}, including your name, address, mobile number,
          and E-mail address
        </li>
        <li>
          Financial data such as your payment details and purchase history when
          you buy data/ service from Delhi Transport Stack
        </li>
        <li>
          Technical data such as the devices you use to access our website, your
          Internet Protocol (IP) address, operating system, and browser type
        </li>
        <li>
          User data about how you use the Delhi Transport Stack service and
          website such as date & time user accessed our website, the Pages/URLs
          visited,
        </li>
        <li>
          Information you provide when you communicate with us by telephone,
          email, query forms on our website, or any other methods
        </li>
        <li> Your profile preferences </li>
      </ul>
      <p>
        We do not collect any special category data. Special category data is
        data that contains sensitive personal information such as religious
        beliefs, ethnicity, political view, etc.
      </p>
      <hr />
      <h2>How we use your data</h2>
      <p>
        We only use your personal data for the purposes it was collected for. As
        a Data Controller, Delhi Transport Stack is responsible for making sure
        personal data is managed in line with privacy policy.  
      </p>
      <p>We will not:  </p>
      <ul>
        <li> Sell, share, or rent your personal data to third parties </li>
        <li> Share your data with third parties for marketing purposes   </li>
      </ul>
      <p>
        We only use your personal data if there is a lawful basis for processing
        it for specific purposes. These lawful bases include: 
      </p>
      <h3 className="mt-3 mb-2"> 1. Consent</h3>
      <p>
        We need your consent before we can process your personal data for some
        purposes. For example: 
      </p>
      <ul>
        <li>
          If you agree to receive marketing communications from us, we will use
          your contact details to send you information about new services
          launched
        </li>
        <li>
          If you agree to our cookie policy, we will use cookies to collect and
          store information about how you use our website
        </li>
      </ul>
      <h3 className="mb-2">2. Contractual purposes</h3>
      <p>We will process your personal data:</p>
      <ul>
        <li>
          When it is necessary to enter a contract with you or your organization
        </li>
      </ul>
      <p>
        We’ll use your contact details, user data, technical data and financial
        data so we can provide:
      </p>
      <ul>
        <li>Provide you with our services and support </li>
        <li>Facilitate transactions on Delhi Transport Stack </li>
      </ul>
      <h3 className="mb-2">3. Legal obligation/compliance </h3>
      <p>
        We may disclose/share your personal data information, when it is
        required for us to comply with legislation, regulations, or law
        enforcement.
      </p>
      <h3 className="mt-3 mb-2">4. Legitimate interest </h3>
      <p>
        We will process your personal data if it is in our legitimate interests
        or the legitimate interests of a third party only after your consent is
        taken.
      </p>
      <p>
        We will not process your personal data if there is a good reason to
        protect your data which overrides those legitimate interests.
      </p>
      <p>
        We may use your personal data, including your contact details, user
        data, technical data and financial data provided your consent is taken
        so that we can:
      </p>
      <ul>
        <li>Carry out business, system, and process development activities </li>
        <li>Commence or defend claims </li>
        <li> Meet contractual obligations with third parties </li>
        <li>Monitor how our website is used and identify security threats </li>
        <li>Analyse and improve our services and website </li>
        <li>Carry out research and surveys. </li>
      </ul>
      <h3 className="mb-2">5. Third Party access of your data </h3>
      <p>
        We may need to share your personal data with third parties for legal and
        operational reasons provided your consent is taken. If we do, we will
        pass on how they will use your personal data to perform their services
        or functions. These third parties may include:
      </p>
      <ul>
        <li>
          Suppliers that provide services as part of a contract with Delhi
          Transport Stack, such as website agencies, operating agencies, and
          technical companies for system maintenance
        </li>
        <li>
          Appointed representatives such as legal advisors, or any party in
          connection with a contract we have with you
        </li>
      </ul>
      <h3 className="mb-2">6. Change of ownership </h3>
      <p>
        We may need to share your personal data if we transfer the ownership
        rights of this website to any other government agency or third party. In
        such scenario, the personal data we have will be transferred to them.
      </p>
      <h3 className="mt-3 mb-2">7. Data Safety and confidentiality </h3>
      <p>
        We have security measures to protect your personal data from being
        accidentally lost, used, altered, or shared without authorization.
        Anyone who will have access to your personal data information is bound
        by duty of confidentiality.
      </p>
      <p>We will: </p>
      <ul>
        <li>
          Make sure your personal data is only accessed if there is a business
          need
        </li>
        <li>
          Restrict how our service providers can process your personal data
        </li>
        <li>
          Follow procedures to prevent and deal with potential personal data
          breaches
        </li>
        <li>
          Notify you and any appropriate regulator of a personal data breach, if
          necessary.
        </li>
      </ul>

      <h3 className="mb-2">8. Where your data is processed and stored </h3>
      <p>
        All personal data is processed and stored in India. We will ask for your
        consent if we need to transfer your personal data outside India.
      </p>
      <p>
        <strong>Please Note: </strong>Data collected by Google Analytics may be
        processed outside of the India. Google Analytics data is aggregated and
        anonymized so the personal identity is never revealed.
      </p>
      <h3 className="mt-3 mb-2">9. Data Retention</h3>
      <ul>
        <li>
          We may keep your personal data, if is required for us to comply with
          legislation, regulations, or law enforcement.
        </li>
        <li>For your communication preferences until you unsubscribe. </li>
        <li>
          Will Erase your personal Data Information if there is no justification
          for keeping it 
        </li>
      </ul>
      <h3 className="mb-2">10. Your rights </h3>
      <p>
        You have the right to access to a copy, update/correct, or request
        deletion of your personal information. You can also request information
        about how your data is being processed.
      </p>
      <p>
        To exercise your rights or for any privacy-related inquiries, please
        contact us using the help & support section on the web-portal
      </p>
      <p>
        <a href="../help-support">[URL for help & support] </a>
      </p>
      <hr />
      <h2>Updates to Privacy policy</h2>
      <p>
        We May update this privacy Policy periodically to reflect the changes in
        our business as well as legal requirements. Changes to this privacy
        notice will apply to your data immediately. We encourage you to review
        this policy regularly for any updates.
      </p>
      <p>
        By Using Delhi Transport Stack service and its website, you acknowledge
        that you have read and understood this Privacy policy and agree to the
        collection, usage, and retention of your personal data information as
        described herein.
      </p>
      <p>
        **This website may contain links to other third-party websites. Privacy
        policies for third-party websites are separate to Delhi Transport Stack
        privacy policy.
      </p>
      <p className="mb-5">
        This policy was last updated on <b>16/09/2024</b>
      </p>
    </div>
  );
};

export default PolicyDocument;
