import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  English: {
    translation: {
      signIn: 'Log In',
      signUp: 'Sign Up',
      connectingPaperDigital: 'Connecting Paper and Digital Learning',
      userType: 'I am a',
      teacher: 'Teacher',
      author: 'Author',
      sendOtp: 'Send OTP',
      dontHaveAccount: "Don't have an account? Sign Up",
      username: "Username",
      password: "Password",
      forgotPassword: "Forgot Password",
      submit: "Submit",
      welcomeLetUsKnow: "Welcome! Let us know how you'll be using Smart Paper.",
      next: 'Next',
      alreadyHaveAccount: 'Already have an account? Sign in',
      organization: 'Organization',
      inviteCode: 'Invite Code',
      emailAddress: 'Email Address',
      resetPassword: 'Reset Password',
      scan: 'Scan',
      result:'Result',
      results: 'Results',
      add: 'Add',
      testName: 'Test Name',
      pages: 'Pages',
      fetchingResults: 'Fetching results',
      preparing: 'Preparing',
      error:'Error',
      errors: 'Errors',
      warning: 'Warning',
      errorImagesNotAllowed:
        'Error images will not be allowed to upload. Please retake them again.',
      yourWork: 'Your work',
      pleaseAddFilledPhotosOfPageBelow:
        'Please add filled photos of the page below.',
      areYouSureClearResults: 'Are you sure you wish to clear results?',
      no: 'No',
      clear: 'Clear',
      welcomeToSmartPaper: 'Welcome to Smart Paper!',
      chooseLanguage: 'Choose Language',
      selectOrg: 'Select Organization',
      selectYourLanguage: 'Select your language',
      selectYourOrg: 'Select your Organization',
      organizations: 'Organizations',
      language: 'Language',
      logout: 'Logout',
      loading: 'Loading',
      view: 'View',
      from: 'From',
      to: 'To',
      delete: 'Delete',
      home: 'Home',
      library: 'Library',
      profile: 'Profile',
      resendOtp:'Resend OTP',
      number:'Number',
      name:'Name',
      updateProfile:'Update Profile',
      viewResults:'View Results',
      input:'Input',
      output:'Output',
      pleaseEnterNumberOfResults:'Please enter the number of results you\'d like to see. (Max. 2000)',
      typeOfResults:'Type of results',
      previous:'Previous',
      next2:'Next',
      classes:'Classes',
      enterPassword:'Enter Password',
      confirmPassword:'Confirm Password'
    },
  },
  हिन्दी: {
    translation: {
      signIn: 'साइन इन करें',
      signUp: 'खाता बनाएं',
      connectingPaperDigital: 'कागज़ और डिजिटल शिक्षा को जोड़ते हुए',
      userType: 'उपयोगकर्ता का प्रकार',
      teacher: 'शिक्षक',
      author: 'लेखक',
      sendOtp: 'OTP भेजें',
      dontHaveAccount: 'खाता नहीं है? नया बनाएं',
      username: 'उपयोगकर्ता नाम',
      password: 'पासवर्ड',
      forgotPassword: 'पासवर्ड भूल गए',
      submit: 'आगे बढ़ें',
      welcomeLetUsKnow:
        'आपका स्वागत है! हमें बताएं कि आप स्मार्ट पेपर का उपयोग कैसे करेंगे।',
      next: 'आगे',
      alreadyHaveAccount:
        'क्या आपके पास पहले से एक खाता मौजूद है? साइन इन करें',
      organization: 'संगठन',
      inviteCode: 'निमंत्रण कोड',
      emailAddress: 'ईमेल पता',
      resetPassword: 'पासवर्ड बदले',
      scan: 'स्कैन',
      result:'परिणाम',
      results: 'परिणाम',
      add: 'जोड़ें',
      testName: 'परीक्षा का नाम',
      pages: 'पृष्ठ',
      fetchingResults: 'परिणाम लाए जा रहे हैं',
      preparing: 'तैयार किया जा रहा है',
      error:'त्रुटि',
      errors: 'त्रुटियां',
      warning: 'चेतावनी',
      errorImagesNotAllowed:
        'त्रुटि छवियों को अपलोड करने की अनुमति नहीं दी जाएगी। कृपया उन्हें फिर से लें।',
      yourWork: 'आपका काम',
      pleaseAddFilledPhotosOfPageBelow:
        'कृपया नीचे दिए गए पृष्ठ की भरी हुई तस्वीरें जोड़ें।',
      areYouSureClearResults:
        'क्या आप निश्चित हैं कि आप परिणाम साफ़ करना चाहते हैं?',
      no: 'नहीं',
      clear: 'साफ करें',
      welcomeToSmartPaper: 'स्मार्ट पेपर में आपका स्वागत है!',
      chooseLanguage: 'भाषा चुनें',
      selectOrg: 'संगठन चुनें',
      selectYourLanguage: 'अपनी भाषा का चयन करें',
      selectYourOrg: 'अपना संगठन चुनें',
      organizations: 'संगठन',
      language: 'भाषा',
      logout: 'लॉग आउट',
      loading: 'लोड हो रहा है',
      view: 'देखें',
      from: 'कब से',
      to: 'कब तक',
      delete: 'हटा दें',
      home: 'होम',
      library: 'पुस्तकालय',
      profile: 'प्रोफ़ाइल',
      resendOtp:'OTP पुनः भेजें',
      number:'नंबर',
      name:'नाम',
      updateProfile:'प्रोफ़ाइल को नवीनतम बनाओ',
      viewResults:'परिणाम देखें',
      input:'इनपुट',
      output:'उत्पादन',
      pleaseEnterNumberOfResults:'आप कितने परिणाम देखना चाहते हैं? (अधिकतम 2000)',
      typeOfResults:'परिणामों का प्रकार',
      previous:'पिछला',
      next2:'अगला',
      classes:'क्लास',
      enterPassword:'पास वर्ड दर्ज करें',
      confirmPassword:'पासवर्ड फिर से दर्ज करें'
    },
  },
};

// const useI18n = () => {
//   const user = useSelector(currentUser);
//   const lan = user.language === 'English' && 'Hindi';
//   console.log(lan);
// };
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'English', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: 'English',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
