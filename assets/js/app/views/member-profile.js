
MeiweiApp.Views.MemberProfileForm = MeiweiApp.ModelView.extend({
	events: {
		'submit': 'updateProfile',
	},
	template: MeiweiApp.Templates['member-profile-form'],
	initModelView: function() {
		_.bindAll(this, 'switchGender');
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.bindFastButton(this.$('.switch-gender'), this.switchGender);
	},
	switchGender: function() {
		window.scrollTo(0, 0);
		var switchGender = this.$('.switch-gender');
		if (switchGender.hasClass('on')) {
			switchGender.removeClass('on').addClass('off');
			switchGender.find('input').val(0);
			switchGender.find('label').html(switchGender.find('label').attr('data-off'));
		} else {
			switchGender.removeClass('off').addClass('on');
			switchGender.find('input').val(1);
			switchGender.find('label').html(switchGender.find('label').attr('data-on'));
		}
	},
	updateProfile: function(e) {
		e.preventDefault();
		MeiweiApp.me.profile.set({
			nickname: this.$('input[name=nickname]').val() || null,
			email: this.$('input[name=email]').val() || null,
			mobile: this.$('input[name=mobile]').val() || null,
			sexe: this.$('input[name=sexe]').val() || null,
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
		var $infoText = this.$('.info-text');
		var password = this.$('input[name=password]').val() || null;
		var passwordConfirm = this.$('input[name=password-conform]').val() || null;
		if (password != passwordConfirm) {
			$infoText.html('两次密码输入不一致，请重新输入。');
		} else {
			MeiweiApp.me.changePassword(password, { 
				success: MeiweiApp.goBack,
				error: function(model, xhr, options) {
					var error = JSON.parse(xhr.responseText);
					for (var k in error) { $infoText.html(error[k]); break; };
				}
			});
		}
	}
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
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
	render: function() {
		var self = this;
		MeiweiApp.me.fetch({
			success: function() {
				self.initScroller();
				self.$('input[name=nickname]').focus();
			}
		});
	}
}))({el: $("#view-member-profile")});
