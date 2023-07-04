import React, { useEffect } from "react";

import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

const TC = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
  }, []);
  return (
    <div className="basis-[80%] bg-[--c60] z-10 overflow-y-scroll p-4 flex flex-col">
      <button className="mr-auto p-2 text-3xl" onClick={() => navigate(-1)}>
        <AiOutlineLeft />
      </button>
      <h2 className="text-center">Terms and Conditions (T&amp;C) for CCW POS App</h2>

      <details>
        <summary>1. Introduction:</summary>
        <p>Welcome to CCW POS! These Terms and Conditions govern your use of the CCW POS mobile application ("the App"). By using the App, you agree to comply with these terms. If you do not agree with any part of these terms, please refrain from using the App.</p>
      </details>

      <details>
        <summary>2. Use of the App:</summary>
        <p>
          a. The App is intended for personal, non-commercial use only. You may not use the App for any unauthorized or illegal purposes.
          <br />
          b. You are responsible for maintaining the confidentiality of your account information and ensuring that it is kept up to date.
          <br />
          c. You must not engage in any activities that may disrupt or interfere with the proper functioning of the App or its associated services.
        </p>
      </details>

      <details>
        <summary>3. Intellectual Property:</summary>
        <p>
          a. All intellectual property rights related to the App and its content, including but not limited to logos, trademarks, images, and text, are owned by the developer, Mihai Culea.
          <br />
          b. You may not reproduce, distribute, modify, or create derivative works of the App's content without prior written consent from the developer.
        </p>
      </details>

      <details>
        <summary>4. Privacy:</summary>
        <p>a. The App may collect and store personal information as described in the Privacy Policy. By using the App, you consent to the collection and use of your personal information in accordance with the Privacy Policy.</p>
      </details>

      <details>
        <summary>5. Liability:</summary>
        <p>
          a. The developer, Mihai Culea, does not assume any liability for the accuracy, completeness, or reliability of the information provided in the App.
          <br />
          b. You agree to use the App at your own risk. The developer will not be liable for any damages or losses arising from your use of the App or reliance on its content.
        </p>
      </details>

      <details>
        <summary>6. Support:</summary>
        <p>
          For any support or inquiries related to the App, please contact us at
          <a href="mailto:alemihai25@gmail.com">alemihai25@gmail.com</a>. We will make our best efforts to assist you promptly.
        </p>
      </details>

      <details>
        <summary>7. Modifications to the Terms:</summary>
        <p>The developer reserves the right to modify these Terms and Conditions at any time without prior notice. It is your responsibility to review the terms periodically for any updates or changes.</p>
      </details>

      <details>
        <summary>8. Governing Law:</summary>
        <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the developer operates.</p>
      </details>

      <p>By using the CCW POS App, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. If you do not agree to any of these terms, please discontinue using the App.</p>
    </div>
  );
};

export default TC;
