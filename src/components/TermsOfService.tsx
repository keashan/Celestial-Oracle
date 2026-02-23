import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="p-8 glass rounded-[2rem] border border-white/10 bg-white/5 shadow-xl animate-fade-in space-y-6 text-white/80">
      <h2 className="text-3xl font-bold text-center text-amber-300 uppercase tracking-widest mb-6">Terms of Service</h2>
      
      <p className="text-lg leading-relaxed">
        Welcome to Cosmic Oracle. These Terms of Service ("Terms") govern your use of the Cosmic Oracle application 
        and its related services. By accessing or using the application, you agree to be bound by these Terms.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">1. Acceptance of Terms</h3>
      <p className="text-lg leading-relaxed">
        By accessing or using our application, you signify that you have read, understood, and agree to be bound 
        by these Terms, whether you are a registered user or not. If you do not agree with all of these Terms, 
        then you are expressly prohibited from using the application and you must discontinue use immediately.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">2. Use of the Application</h3>
      <ul className="list-disc list-inside ml-4 space-y-2 text-lg leading-relaxed">
        <li>You must be at least 18 years of age to use the application.</li>
        <li>You agree to use the application only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the application.</li>
        <li>The astrological readings and content provided are for entertainment purposes only and should not be taken as professional advice.</li>
      </ul>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">3. User Accounts</h3>
      <p className="text-lg leading-relaxed">
        To access certain features of the application, you may be required to register for an account. 
        You agree to provide accurate, current, and complete information during the registration process 
        and to update such information to keep it accurate, current, and complete.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">4. Intellectual Property</h3>
      <p className="text-lg leading-relaxed">
        All content on the Cosmic Oracle application, including text, graphics, logos, images, and software, 
        is the property of Cosmic Oracle or its content suppliers and protected by intellectual property laws.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">5. Disclaimers</h3>
      <p className="text-lg leading-relaxed">
        The application is provided on an as-is and as-available basis. You agree that your use of the application 
        and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, 
        express or implied, in connection with the application and your use thereof.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">6. Limitation of Liability</h3>
      <p className="text-lg leading-relaxed">
        In no event will Cosmic Oracle or its directors, employees, or agents be liable to you or any third party 
        for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including 
        lost profit, lost revenue, loss of data, or other damages arising from your use of the application.
      </p>

      <h3 className="text-2xl font-bold text-amber-200 mt-8 mb-4">7. Contact Us</h3>
      <p className="text-lg leading-relaxed">
        If you have questions or comments about these Terms, please contact us at: <a href="mailto:terms@cosmicoracle.com" className="text-amber-400 hover:underline">terms@cosmicoracle.com</a>
      </p>
    </div>
  );
};

export default TermsOfService;
