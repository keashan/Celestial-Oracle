import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-8 glass rounded-[2rem] border border-white/10 bg-white/5 shadow-xl animate-fade-in space-y-6 text-white/80">
      <h2 className="text-3xl font-bold text-center text-amber-300 uppercase tracking-widest mb-6">Privacy Policy</h2>
      
      <p className="text-lg leading-relaxed">
        At Cosmic Oracle, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
        disclose, and safeguard your information when you visit our application.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">Information We Collect</h3>
      <p className="text-lg leading-relaxed">
        We collect personal information that you voluntarily provide to us when you register on the application, 
        express an interest in obtaining information about us or our products and services, when you participate 
        in activities on the application, or otherwise when you contact us.
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2 text-lg leading-relaxed">
        <li><strong>Personal Data:</strong> Name, birth date, birth time, birth location, and email address.</li>
        <li><strong>Usage Data:</strong> Information about how you access and use the application.</li>
      </ul>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">How We Use Your Information</h3>
      <p className="text-lg leading-relaxed">
        We use the information we collect to:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2 text-lg leading-relaxed">
        <li>Provide and deliver personalized astrological predictions and services.</li>
        <li>Improve, operate, and maintain our application.</li>
        <li>Send you marketing and promotional communications.</li>
        <li>Respond to your comments or inquiries.</li>
      </ul>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">Disclosure of Your Information</h3>
      <p className="text-lg leading-relaxed">
        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-2 text-lg leading-relaxed">
        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
        <li><strong>Third-Party Service Providers:</strong> We may share your data with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
      </ul>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">Security of Your Information</h3>
      <p className="text-lg leading-relaxed">
        We use administrative, technical, and physical security measures to help protect your personal information. 
        While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
        that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
        can be guaranteed against any interception or other type of misuse.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">Contact Us</h3>
      <p className="text-lg leading-relaxed">
        If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@cosmicoracle.com" className="text-amber-400 hover:underline">privacy@cosmicoracle.com</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
