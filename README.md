 <h1>Phone Verification System</h1>
  
  <p>This project implements a phone verification system where users receive a code on their phone to authenticate their login attempts. The system ensures secure access to a platform by sending a verification code via SMS, which the user must enter to successfully log in.</p>
  
  <img width="1387" alt="Image" src="https://github.com/user-attachments/assets/2c40b56b-c83e-4d05-8152-2cfb16fccecf" />
  
  <h2>Features</h2>
  <ul>
    <li><strong>Phone Authentication</strong>: Users log in to the platform and receive a unique verification code sent to their phone via SMS.</li>
    <li><strong>Code Verification</strong>: The user enters the received code to complete the authentication process and gain access.</li>
    <li><strong>Secure Login</strong>: The system ensures that only users with the correct verification code can log in, enhancing security.</li>
  </ul>

 <img width="1387" alt="Image" src="https://github.com/user-attachments/assets/f242f791-0b5b-4920-b38e-7409c1576523" />
  
  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Backend</strong>: Python</li>
    <li><strong>Database</strong>: Any relational database for storing user details and session data (e.g., SQLite, MySQL, PostgreSQL)</li>
  </ul>

  <h2>Setup Instructions</h2>
  <ol>
    <li>Clone this repository to your local machine.</li>
    <li>Install the required dependencies:
      <pre><code>pip install -r requirements.txt</code></pre>
    </li>
    <li>Configure your SMS API provider (e.g., Twilio) with the necessary credentials in the environment settings.</li>
    <li>Set up your database with tables for storing user information and session data.</li>
    <li>Run the server:
      <pre><code>python app.py</code></pre>
    </li>
    <li>Access the login page, enter your phone number, and receive a verification code to proceed.</li>
  </ol>

  <h2>Future Enhancements</h2>
  <ul>
    <li>Add support for multi-factor authentication (MFA) for added security.</li>
    <li>Implement a retry limit to prevent brute force attacks on the code input.</li>
    <li>Enhance the UI/UX for the phone number input and verification process.</li>
  </ul>
