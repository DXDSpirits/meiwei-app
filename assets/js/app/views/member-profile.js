
MeiweiApp.Views.MemberProfileForm = MeiweiApp.ModelView.extend({
	events: { 'submit': 'updateProfile' },
	template: MeiweiApp.Templates['member-profile-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	updateProfile: function(e) {
		e.preventDefault();
		MeiweiApp.me.profile.set({
			nickname: this.$('input[name=nickname]').val() || null,
			email: this.$('input[name=email]').val() || null,
			mobile: this.$('input[name=mobile]').val() || null,
			sexe: this.$('select[name=sexe]').val() || null,
			birthday: this.$('input[name=birthday]').val() || null,
			anniversary: this.$('input[name=anniversary]').val() || null
		});
		var $infoText = this.$('.info-text');
		MeiweiApp.me.profile.save({}, { 
		    success: MeiweiApp.goBack,
		    error: function(model, xhr, options) {
	            var error = JSON.parse(xhr.responseText);
		        for (var k in error) { $infoText.html(error[k]);  break; };
            }
		});
	}
});

MeiweiApp.Views.MemberPasswordForm = MeiweiApp.ModelView.extend({
	events: { 'submit': 'updatePassword' },
	template: MeiweiApp.Templates['member-password-form'],
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	updatePassword: function(e) {
		e.preventDefault();
		var password = this.$('input[name=password]').val() || null;
		var $infoText = this.$('.info-text');
		MeiweiApp.me.changePassword(password, { 
			success: MeiweiApp.goBack,
			error: function(model, xhr, options) {
				var error = JSON.parse(xhr.responseText);
				for (var k in error) { $infoText.html(error[k]); break; };
			}
		});
	}
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
	events: { 'click .switch-gender': 'switchGender' },
	initPage: function() {
		this.views = {
			profileForm: new MeiweiApp.Views.MemberProfileForm({
				model: MeiweiApp.me.profile,
				el: this.$('.member-profile-form')
			}),
			profileForm: new MeiweiApp.Views.MemberPasswordForm({
				model: MeiweiApp.me,
				el: this.$('.member-password-form')
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
		MeiweiApp.me.fetch();
		MeiweiApp.me.profile.fetch({ success: this.showPage });
		this.views.profileForm.render();
	}
}))({el: $("#view-member-profile")});
