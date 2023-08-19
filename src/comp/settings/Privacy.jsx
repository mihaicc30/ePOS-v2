import React, { useEffect } from "react";

import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";



const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);
  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll p-4 flex flex-col">
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <h2 className="text-center">Privacy Policy for CCW POS App</h2>

      <p>This Privacy Policy describes how your personal information is collected, used, and shared when you use the CCW POS mobile application ("the App"). By using the App, you agree to the collection and use of your information in accordance with this policy.</p>

      <details>
        <summary>1. Information We Collect</summary>
        <p>The App may collect certain information from you, including:</p>
        <ul>
          <li>Personal information (such as your name, email address, and contact details) when you create an account or contact us.</li>
          <li>Device information (such as your device type, operating system, and unique device identifiers) when you access or use the App.</li>
          <li>Usage information (such as the features you use, the pages you visit, and the actions you take) to improve the App's functionality and user experience.</li>
        </ul>
      </details>
      <details>
        <summary>2. Use of Information</summary>
        <p>We may use the collected information to:</p>
        <ul>
          <li>Provide and maintain the App's services.</li>
          <li>Personalize your experience and improve the App's functionality.</li>
          <li>Communicate with you, respond to your inquiries, and provide customer support.</li>
          <li>Monitor and analyze trends, usage, and activities in connection with the App.</li>
          <li>Enforce the App's terms and conditions and protect against fraudulent or unauthorized activities.</li>
        </ul>
      </details>

      <details>
        <summary>3. Sharing of Information</summary>
        <p>We may share your personal information with:</p>
        <ul>
          <li>Service providers who assist us in operating, maintaining, and improving the App's services.</li>
          <li>Third-party analytics providers to analyze usage patterns and trends.</li>
          <li>Law enforcement agencies, government authorities, or authorized third parties if required by law or to protect our rights, safety, or property.</li>
        </ul>
      </details>

      <details>
        <summary>4. Data Retention</summary>
        <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
      </details>

      <details>
        <summary>5. Security</summary>
        <p>We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>
      </details>

      <details>
        <summary>6. Children's Privacy</summary>
        <p>The App is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to remove that information.</p>
      </details>

      <details>
        <summary>7. Changes to this Privacy Policy</summary>
        <p>We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised policy in the App. We encourage you to review this Privacy Policy periodically for any updates.</p>
      </details>

      <details>
        <summary>8. Contact Us</summary>
        <p>If you have any questions or concerns about this Privacy Policy or the App's practices, please contact us at alemihai25@gmail.com.</p>
      </details>
      <p>By using the CCW POS App, you acknowledge that you have read, understood, and agreed to these Privacy Policy. If you do not agree to any of these terms, please discontinue using the App.</p>
    </div>
  );
};

export default Privacy;
