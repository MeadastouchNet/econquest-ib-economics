export const APP = {
 name: 'EconQuest', icon: 'trending-up', course: 'IB Economics HL', storageKey: 'econquest.ib-economics.v1',
 levels: ['Curious Observer', 'Festival Planner', 'Resource Scout', 'Economic Detective', 'Policy Analyst', 'Model Builder', 'Researcher', 'Economist', 'Policy Adviser', 'Economic Explorer'],
 // Google sign-in and the cloud copy of progress (Firebase project "ib-economy-hl").
 // This web config is public by design; the Firestore security rule is what keeps each user's data private.
 firebase: {
  apiKey: 'AIzaSyBaQc8jKqvxgk9vRyWzT7vdtPWSQKykk04',
  authDomain: 'ib-economy-hl.firebaseapp.com',
  projectId: 'ib-economy-hl',
  storageBucket: 'ib-economy-hl.firebasestorage.app',
  messagingSenderId: '141781277057',
  appId: '1:141781277057:web:c6676721b2cb8c6cd8b080'
 },
 voiceTest: 'Every choice has an opportunity cost. What is the next best alternative you give up?'
};
