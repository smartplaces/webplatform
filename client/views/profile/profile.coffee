Template.profile.helpers
  email:         -> Meteor.user().emails[0].address if Meteor.user().emails?
  firstName:     -> Meteor.user().profile.firstName
  lastName:      -> Meteor.user().profile.lastName
  organization:  -> Meteor.user().profile.organization
  address:       -> Meteor.user().profile.location
  contacts:      -> Meteor.user().profile.contacts
  url:           -> Meteor.user().profile.url

Template.profile.events
  'submit form': (e) ->
    e.preventDefault()
    profile =
      firstName: $(e.target).find('[id=firstName]').val()
      lastName: $(e.target).find('[id=lastName]').val()
      organization: $(e.target).find('[id=organization]').val()
      address: $(e.target).find('[id=address]').val()
      contacts: $(e.target).find('[id=contacts]').val()
      url: $(e.target).find('[id=url]').val()

    if profile.url and not profile.url.match(/^http/) and not profile.url.match(/^https/) and url isnt ''
      profile.url = 'http://' + profile.url

    if !profile.firstName
      $('.errorsFirstName').text('Необходимо указать ваше имя!')
      return;
    if !profile.lastName
      $('.errorsLastName').text('Необходимо указать вашу фамилию!')
      return
    if !profile.organization
      $('.errorsOrganization').text('Необходимо указать организацию!')
      return
    Meteor.users.update Meteor.userId(),
      $set:
        'profile': profile
    Router.go('index')
