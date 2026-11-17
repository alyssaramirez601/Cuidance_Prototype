// Profile copy, from the clickable prototype screens 20 to 25 (Profile, Your Attributes,
// Guidance History, Privacy / Trust Settings, Notifications, Account Settings).
// Lines marked DRAFT aren't in the prototype and need Alyssa and Esme's OK.

export const profileCopy = {
  title: 'Profile',
  loading: 'Loading your profile',
  loadError: 'We couldn’t load your profile. Check your connection and try again.',
  edit: 'Edit',
  attributesTitle: 'Your attributes',
  updated: (date: string) => `Updated ${date}`,
  attributesHelper: 'These details help Cuidance explain fit.',
  usedInExplore: 'Used in Explore',
  usedInResults: 'Used in your results',
  viewAttributes: 'View attributes',
  // DRAFT: the prototype always has a sample person, so it never shows an empty attributes card
  noAttributes: 'Take the quiz to add your attributes.',
  rows: {
    history: 'Guidance history',
    privacy: 'Privacy & trust',
    notifications: 'Notifications',
    account: 'Account settings',
  },
  signOut: 'Sign out',
  signingOut: 'Signing out',
};

export const attributesCopy = {
  title: 'Your attributes',
  intro: 'These details help Cuidance explain fit.',
  notShared: 'Not shared',
  note: 'Shown because you selected it. Edit anytime.',
  confidenceTitle: 'Confidence exploring',
  confidenceNote: 'Cuidance adjusts how much it explains. Change this anytime.',
  editAttributes: 'Edit attributes',
  retake: 'Retake the quiz',
  // DRAFT: group titles reuse the quiz's own area names
  startingTitle: 'Getting started',
};

export const historyCopy = {
  title: 'Guidance history',
  intro: 'Your past results, newest first.',
  current: 'Current',
  reopenResult: 'Reopen result',
  reopen: 'Reopen',
  // DRAFT: the prototype always has history, so it has no empty line
  empty: 'Results you save will show up here.',
  takeQuiz: 'Take the quiz',
};

export const privacyCopy = {
  title: 'Privacy & trust',
  intro: 'Your quiz answers shape your guidance only. We do not sell your data, and partner brands never see your attributes.',
  toggles: ['Use my answers to personalize guidance', 'Show Partner Highlights on Home', 'Email guidance updates'],
  trustTitle: 'Trust & disclosure',
  privacyPolicy: 'Privacy policy',
  review: 'Review settings',
  saved: 'Privacy settings saved',
};

export const notificationsCopy = {
  title: 'Notifications',
  intro: 'Choose which Cuidance updates you want to receive.',
  toggles: [
    { title: 'Guidance updates', detail: 'New notes on your saved results' },
    { title: 'Saved item reminders', detail: 'Reminders to revisit saved items' },
    { title: 'Partner Highlights', detail: 'Partner and commercial updates' },
    { title: 'Email guidance updates', detail: 'Guidance updates sent by email' },
  ],
  note: 'Controls app and email notification preferences only.',
  save: 'Save notification settings',
  saved: 'Notification settings saved',
};

export const accountCopy = {
  title: 'Account settings',
  infoTitle: 'Account information',
  name: 'Name',
  email: 'Email',
  securityTitle: 'Security',
  changePassword: 'Change password',
  resetSent: 'Password reset link sent to your email',
  actionsTitle: 'Account actions',
  deleteAccount: 'Delete account',
  deleteDetail: 'Removes your account and saved guidance',
  save: 'Save account changes',
  saved: 'Account changes saved',
  // DRAFT: the prototype has no error states
  nameRequired: 'Enter your name.',
};

// Esme's Week 12 marketing illustrations, reused so the app matches the website and emails
export const profileArt = {
  banner: require('@/assets/art-library/profile-banner-sun-book.png'),
  attributes: require('@/assets/art-library/profile-attributes.png'),
  history: require('@/assets/art-library/profile-history.png'),
  privacy: require('@/assets/art-library/profile-privacy.png'),
  notifications: require('@/assets/art-library/profile-notifications.png'),
  account: require('@/assets/art-library/profile-account.png'),
};
