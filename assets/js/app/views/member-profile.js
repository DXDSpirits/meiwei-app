
MeiweiApp.Views.MemberProfileForm = MeiweiApp.ModelView.extend({
	events: { 'submit': 'updateProfile' },
	template: MeiweiApp.Templates['member-profile-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	updateProfile: function(e) {
		e.preventDefault();
		MeiweiApp.me.profile.set({
			nickname: this.$('input[name=nickname]').val(),
			email: this.$('input[name=email]').val(),
			mobile: this.$('input[name=mobile]').val(),
			sexe: this.$('input[name=sexe]').val(),
			birthday: this.$('input[name=birthday]').val(),
			anniversary: this.$('input[name=anniversary]').val()
		});
		MeiweiApp.me.profile.save();
	}
});

MeiweiApp.Views.MemberAvatarForm = MeiweiApp.ModelView.extend({
	events: { 'submit': 'uploadAvatar' },
	template: MeiweiApp.Templates['member-profile-avatar-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	uploadAvatar: function(e) {
		e.preventDefault();
		avatar = this.$('input[name=avatar]').val();
		console.log(this.$el.serialize())
	},
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
	initialize: function() {
		this.views = {
			profileForm: new MeiweiApp.Views.MemberProfileForm({
				model: MeiweiApp.me.profile,
				el: this.$('.scroll .wrapper div:nth-child(1)')
			}),
			avatarForm: new MeiweiApp.Views.MemberAvatarForm({
				model: MeiweiApp.me.profile,
				el: this.$('.scroll .wrapper div:nth-child(2)')
			})
		}
	},
	show: function() {
		MeiweiApp.me.profile.fetch();
		this.slideIn();
	}
}))({el: $("#view-member-profile")});
