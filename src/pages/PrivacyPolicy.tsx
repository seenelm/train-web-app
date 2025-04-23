import '../styles/privacy.css';

const PrivacyPolicy = () => (
  <div className="privacy-container">
    <div className="privacy-card">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-date">Effective Date: January 01, 2025</p>
      
      <section className="privacy-section">
        <h2 className="section-title">1. Introduction</h2>
        <p>
          Welcome to Train ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience when using our fitness and training application ("App").
        </p>
        <p>
          This Privacy Policy explains our practices regarding the collection, use, and disclosure of information through our App. By accessing or using our App, you agree to this Privacy Policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">2. Information We Collect</h2>
        
        <div className="subsection">
          <h3 className="subsection-title">2.1 Information You Provide</h3>
          <p>
            We collect information you provide directly to us, including:
          </p>
          <ul className="privacy-list">
            <li>Account information (name, email address, password)</li>
            <li>Profile information (profile picture, bio, fitness goals)</li>
            <li>Health and fitness data (workout history, exercise statistics, body measurements)</li>
            <li>Content you share (comments, messages, posts in groups)</li>
            <li>Survey responses and feedback</li>
          </ul>
        </div>

        <div className="subsection">
          <h3 className="subsection-title">2.2 Information Collected Automatically</h3>
          <p>
            When you use our App, we automatically collect certain information, including:
          </p>
          <ul className="privacy-list">
            <li>Device information (device type, operating system, unique device identifiers)</li>
            <li>Log information (access times, pages viewed, app crashes)</li>
            <li>Location information (with your permission)</li>
            <li>Usage data (features used, interaction patterns)</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="privacy-list">
          <li>Provide, maintain, and improve our App</li>
          <li>Create and update your account</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our App</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">4. Sharing of Information</h2>
        <p>
          <strong>Our Commitment:</strong> Due to our encryption system with no decryption capability, we cannot and will not sell your personal data to advertisers or other third parties. Your information remains securely encrypted with no technical means for us to convert it to a readable format for sharing or selling.
        </p>
        <p>
          We may share information only in the following limited circumstances:
        </p>
        <ul className="privacy-list">
          <li><strong>With other users:</strong> When you use social features of our App, information you provide may be displayed to other users.</li>
          <li><strong>With service providers:</strong> We share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
          <li><strong>For legal reasons:</strong> We may disclose information if we believe it is necessary to comply with applicable laws, regulations, legal processes, or governmental requests. However, due to our advanced encryption system with no decryption capability, any data shared would be in encrypted form and would appear as gibberish. We have deliberately designed our systems so that we cannot decrypt user data for sharing with any third party, including government entities. We will vigorously defend user privacy and only share the minimum required information when legally compelled to do so.</li>
          <li><strong>With your consent:</strong> We may share information with third parties when you give us consent to do so.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">5. Data Security</h2>
        <p>
          At Train, we implement industry-leading encryption technology to protect your data. All user information is encrypted using advanced cryptographic algorithms, ensuring that your data is stored in a format that appears as gibberish to any human viewer, including our own staff members.
        </p>
        <p>
          <strong>Important:</strong> Our system is designed with no decryption capability for human access. We have deliberately removed the technical ability to decrypt user data for purposes like selling or sharing with third parties. This means we <em>cannot</em> access your readable data even if we wanted to.
        </p>
        <p>
          Our proprietary encryption system ensures that:
        </p>
        <ul className="privacy-list">
          <li><strong>End-to-end encryption:</strong> Your data is encrypted from the moment it leaves your device</li>
          <li><strong>Zero-knowledge architecture:</strong> Even our own employees cannot access your unencrypted data</li>
          <li><strong>Algorithmic processing only:</strong> Only our secure, automated algorithms can process your information within our closed system</li>
          <li><strong>No decryption capability:</strong> We have deliberately designed our systems without the ability to decrypt data for human viewing or third-party sharing</li>
          <li><strong>Secure key management:</strong> Encryption keys are managed through a sophisticated system that prevents unauthorized access</li>
        </ul>
        <p>
          This approach provides an exceptional level of privacy and security, as we have technically eliminated the possibility of selling or sharing your readable data. While no security system is 100% impenetrable, our encryption-first approach with no decryption capability significantly reduces risks associated with data breaches, unauthorized access, or commercial exploitation of your personal information.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">6. Your Rights and Choices</h2>
        <p>
          You have several rights regarding your personal information:
        </p>
        <ul className="privacy-list">
          <li><strong>Account Information:</strong> You can update your account information at any time by logging into your account.</li>
          <li><strong>Location Information:</strong> You can prevent our App from collecting precise location information through your device settings.</li>
          <li><strong>Push Notifications:</strong> You can opt out of receiving push notifications through your device settings.</li>
          <li><strong>Data Access and Portability:</strong> You can request a copy of your data, which we will provide in a structured, commonly used format through our secure systems. The data you receive will be processed through our algorithms to be readable only to you. You can be confident that while your data is stored on our systems, it remains encrypted and we have no technical capability to decrypt it for sharing or selling purposes.</li>
          <li><strong>Deletion:</strong> You can request deletion of your personal information.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">7. Children's Privacy</h2>
        <p>
          Our App is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete this information.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">8. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the App or by other means. Your continued use of the App after the changes are made indicates your acceptance of the updated Privacy Policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2 className="section-title">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="contact-info">
          <p><strong>Email:</strong> privacy@trainapp.com</p>
          <p><strong>Address:</strong> 123 Fitness Street, San Francisco, CA 94103</p>
        </div>
      </section>
      
      <div className="privacy-footer">
        © 2025 Train App. All rights reserved.
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;