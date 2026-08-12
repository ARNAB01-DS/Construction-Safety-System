import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Nav
    'nav.overview':    'Overview',
    'nav.livefeed':    'Live Feed',
    'nav.violations':  'Violations',
    'nav.analytics':   'Analytics',
    'nav.detect':      'Detect',
    'nav.model':       'Model & ML',
    'nav.business':    'Business Plan',
    'nav.budget':      'Budget & ROI',
    'nav.apidocs':     'API Docs',
    'nav.settings':    'Settings',
    'nav.signout':     'Sign Out',
    // Pages
    'page.dashboard':       'Safety Overview',
    'page.dashboard.sub':   'Real-time monitoring',
    'page.detect':          'PPE Detection',
    'page.detect.sub':      'Upload an image to analyze PPE compliance',
    'page.violations':      'Violation Log',
    'page.violations.sub':  'All PPE non-compliance events',
    'page.settings':        'Settings',
    'page.settings.sub':    'Configure your site, detection & alerts',
    // Buttons
    'btn.signin':       'Sign In',
    'btn.signout':      'Sign Out',
    'btn.getstarted':   'Get Started',
    'btn.exportcsv':    'Export CSV',
    'btn.oshapdf':      'OSHA Report PDF',
    'btn.exportreport': 'Export Report',
    'btn.livefeeds':    'Live Feeds',
    'btn.save':         'Save Changes',
    'btn.saved':        '✓ Saved!',
    'btn.detect':       'Detect PPE',
    'btn.upload':       'Upload Image',
    'btn.changelogo':   'Change Logo',
    // Labels
    'label.email':     'Email address',
    'label.password':  'Password',
    'label.remember':  'Keep me signed in for 30 days',
    'label.orgname':   'Organization Name',
    'label.sitename':  'Site Name',
    'label.phone':     'Contact Phone',
    'label.address':   'Site Address',
    'label.postal':    'Postal / ZIP Code',
    'label.country':   'Country',
    // Detection
    'detect.drop':       'Drag & drop your image here',
    'detect.or':         'or',
    'detect.browse':     'Browse Files',
    'detect.formats':    'Supports JPEG, PNG, WebP — max 10MB',
    'detect.analyzing':  'Analyzing image…',
    'detect.compliant':  'COMPLIANT',
    'detect.violation':  'VIOLATION DETECTED',
    'detect.detections': 'Total Detections',
    'detect.latency':    'Inference Latency',
    'detect.original':   'Original Image',
    'detect.processed':  'Detection Result',
    // Status
    'status.online':  'Online',
    'status.offline': 'Offline',
    'status.live':    'Live',
    // Alerts
    'alert.critical': 'Critical',
    'alert.high':     'High',
    'alert.medium':   'Medium',
  },

  bn: {
    // Nav
    'nav.overview':    'সংক্ষিপ্ত বিবরণ',
    'nav.livefeed':    'লাইভ ফিড',
    'nav.violations':  'লঙ্ঘন',
    'nav.analytics':   'বিশ্লেষণ',
    'nav.detect':      'শনাক্ত করুন',
    'nav.model':       'মডেল ও এমএল',
    'nav.business':    'ব্যবসায়িক পরিকল্পনা',
    'nav.budget':      'বাজেট ও আরওআই',
    'nav.apidocs':     'এপিআই ডক্স',
    'nav.settings':    'সেটিংস',
    'nav.signout':     'সাইন আউট',
    // Pages
    'page.dashboard':       'নিরাপত্তা সংক্ষিপ্ত বিবরণ',
    'page.dashboard.sub':   'রিয়েল-টাইম পর্যবেক্ষণ',
    'page.detect':          'পিপিই শনাক্তকরণ',
    'page.detect.sub':      'পিপিই সম্মতি বিশ্লেষণের জন্য একটি ছবি আপলোড করুন',
    'page.violations':      'লঙ্ঘন লগ',
    'page.violations.sub':  'সমস্ত পিপিই অ-সম্মতি ঘটনা',
    'page.settings':        'সেটিংস',
    'page.settings.sub':    'সাইট, শনাক্তকরণ ও সতর্কতা কনফিগার করুন',
    // Buttons
    'btn.signin':       'সাইন ইন',
    'btn.signout':      'সাইন আউট',
    'btn.getstarted':   'শুরু করুন',
    'btn.exportcsv':    'সিএসভি রপ্তানি',
    'btn.oshapdf':      'ওএসএইচএ রিপোর্ট পিডিএফ',
    'btn.exportreport': 'রিপোর্ট রপ্তানি',
    'btn.livefeeds':    'লাইভ ফিড',
    'btn.save':         'পরিবর্তন সংরক্ষণ',
    'btn.saved':        '✓ সংরক্ষিত!',
    'btn.detect':       'পিপিই শনাক্ত করুন',
    'btn.upload':       'ছবি আপলোড',
    'btn.changelogo':   'লোগো পরিবর্তন',
    // Labels
    'label.email':     'ইমেইল ঠিকানা',
    'label.password':  'পাসওয়ার্ড',
    'label.remember':  '৩০ দিনের জন্য সাইন ইন রাখুন',
    'label.orgname':   'প্রতিষ্ঠানের নাম',
    'label.sitename':  'সাইটের নাম',
    'label.phone':     'যোগাযোগের ফোন',
    'label.address':   'সাইটের ঠিকানা',
    'label.postal':    'পোস্টাল / জিপ কোড',
    'label.country':   'দেশ',
    // Detection
    'detect.drop':       'এখানে আপনার ছবি টেনে আনুন',
    'detect.or':         'অথবা',
    'detect.browse':     'ফাইল ব্রাউজ করুন',
    'detect.formats':    'JPEG, PNG, WebP সমর্থন করে — সর্বোচ্চ ১০MB',
    'detect.analyzing':  'ছবি বিশ্লেষণ করা হচ্ছে…',
    'detect.compliant':  'সম্মতিপূর্ণ',
    'detect.violation':  'লঙ্ঘন শনাক্ত',
    'detect.detections': 'মোট শনাক্তকরণ',
    'detect.latency':    'অনুমান বিলম্ব',
    'detect.original':   'মূল ছবি',
    'detect.processed':  'শনাক্তকরণ ফলাফল',
    // Status
    'status.online':  'অনলাইন',
    'status.offline': 'অফলাইন',
    'status.live':    'লাইভ',
    // Alerts
    'alert.critical': 'জরুরি',
    'alert.high':     'উচ্চ',
    'alert.medium':   'মাঝারি',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('safescan_lang') || 'en';
  });

  const setLanguage = (l) => {
    setLang(l);
    localStorage.setItem('safescan_lang', l);
  };

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  const languages = [
    { code: 'en', name: 'English',  flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা',    flag: '🇧🇩' },
  ];

  return (
    <LangContext.Provider value={{ lang, setLanguage, t, languages }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
