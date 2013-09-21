
MeiweiApp.Views.MemberProfileForm = MeiweiApp.View.extend({
	events: {
		'tap button': 'updateProfile'
	},
	initView: function() {
		_.bindAll(this, 'switchGender', 'render');
		var btn = this.bindFastButton(this.$('.switch-gender'), this.switchGender);
		var switchGender = this.$('.switch-gender');
		btn.onTouchMove = function(event) {
			if (Math.abs(event.touches[0].clientY - this.startY) > 10) btn.reset(event);
			if (switchGender.hasClass('on') && event.touches[0].clientX - btn.startX > 10) btn.reset(event);
			if (switchGender.hasClass('off') && event.touches[0].clientX - btn.startX < -10) btn.reset(event);
		}
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
			birthday: this.$('input[name=birthday]').val() || null
		});
		var self = this;
		MeiweiApp.me.profile.save({}, { 
		    success: MeiweiApp.goBack,
		    error: function(model, xhr, options) {
		        self.displayError(self.$('.info-text'), xhr.responseText);
            }
		});
	},
	render: function() {
		var profile = MeiweiApp.me.profile.toJSON();
		this.$('input[name=nickname]').val(profile.nickname);
		this.$('input[name=email]').val(profile.email);
		this.$('input[name=mobile]').val(profile.mobile);
		this.$('input[name=birthday]').val(profile.birthday);
		this.$('input[name=sexe]').val(profile.sexe);
		this.$('.switch-gender').toggleClass('on', (profile.sexe == 1)).toggleClass('off', (profile.sexe == 0));
		this.$('.switch-gender label').html(
			this.$('.switch-gender label').attr('data-' + (profile.sexe == 1 ? 'on' : 'off'))
		);
		this.$('.info-text').html('');
	}
});

MeiweiApp.Views.MemberPasswordForm = MeiweiApp.View.extend({
	events: {
		'tap button': 'updatePassword'
	},
	updatePassword: function(e) {
		e.preventDefault();
		var password = this.$('input[name=password]').val() || null;
		var passwordConfirm = this.$('input[name=password-confirm]').val() || null;
		if (password != passwordConfirm) {
			this.$('.info-text').html('两次密码输入不一致，请重新输入。');
		} else {
			var self = this;
			MeiweiApp.me.changePassword(password, { 
				success: MeiweiApp.goBack,
				error: function(model, xhr, options) {
					self.displayError(self.$('.info-text'), xhr.responseText);
				}
			});
		}
	},
	render: function() {
		this.$('input').val('');
		this.$('.info-text').html('');
	}
});

MeiweiApp.Pages.MemberProfile = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.views = {
			profileForm: new MeiweiApp.Views.MemberProfileForm({
				el: this.$('.member-profile-form')
			}),
			passwordForm: new MeiweiApp.Views.MemberPasswordForm({
				el: this.$('.member-password-form')
			})
		};
	},
	render: function() {
		this.$('input[name=nickname]').focus();
		this.views.passwordForm.render();
		MeiweiApp.me.fetch({ success: this.views.profileForm.render });
	}
}))({el: $("#view-member-profile")});
