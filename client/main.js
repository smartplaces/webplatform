Meteor.subscribe('beacons');
Meteor.subscribe('locations');
Meteor.subscribe('tags');
Meteor.subscribe('messages');
Meteor.subscribe('scenarios');
Meteor.subscribe('coupons');
Meteor.subscribe('logos');
Meteor.subscribe('banners');
Meteor.subscribe('passes');

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY'
});

AccountsEntry.config({
  homeRoute: '/',
  dashboardRoute: '/locations',
  language: 'ru'
});
