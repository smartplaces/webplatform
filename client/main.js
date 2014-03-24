Meteor.subscribe('beacons');
Meteor.subscribe('locations');
Meteor.subscribe('tags');
Meteor.subscribe('messages');
Meteor.subscribe('scenarios');

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY'
});

AccountsEntry.config({
  homeRoute: '/',
  dashboardRoute: '/locations',
  language: 'ru'
});
