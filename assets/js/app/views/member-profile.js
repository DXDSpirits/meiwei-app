
MeiweiApp.Views.MemberProfileForm = MeiweiApp.ModelView.extend({
	events: { 'submit': 'updateProfile' },
	template: MeiweiApp.Templates['member-profile-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		MWA.fixBlurScroll(this.$el);
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
		MeiweiApp.me.profile.save({}, { success: MeiweiApp.goBack });
	}
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
	events: { 'click .switch-gender': 'switchGender' },
	initPage: function() {
		this.views = {
			profileForm: new MeiweiApp.Views.MemberProfileForm({
				model: MeiweiApp.me.profile,
				el: this.$('.scroll .scroll-inner')
			})
		};
	},
	switchGender: function() {
		var s = this.$('.switch-gender');
		if ($(s).hasClass('on')) {
			$(s).removeClass('on');
			$(s).find('input').val(0);
		} else {
			$(s).addClass('on');
			$(s).find('input').val(1);
		}
	},
	render: function() {
		$.when(
			MeiweiApp.me.profile.fetch()
		).then(this.showPage);
	}
}))({el: $("#view-member-profile")});
