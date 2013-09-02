
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'click .login-button': 'login',
		'click .register-button': 'register',
	},
	initialize: function() {
		_.bindAll(this, 'displayError', 'login', 'register', 'onLoginSuccess');
	},
	displayError: function(model, xhr, options) {
		window.scrollTo(0, 0);
		var $infoText = this.$('.info-text');
		var error = JSON.parse(xhr.responseText);
		for (var k in error) { $infoText.html(error[k]); break; }
	},
	onLoginSuccess: function() {
		MeiweiApp.refreshActivePage();
	},
	login: function() {
		window.scrollTo(0, 0);
		if (this.status == 'login') {
			var username = this.$('input[name=username]').val();
			var password = this.$('input[name=password]').val();
			if (username.length > 0 && password.length > 0) {
				MeiweiApp.me.login({ username : username, password : password }, {
					success : this.onLoginSuccess,
					error : this.displayError
				});
			}
		} else {
			MeiweiApp.Pages.MemberLogin.$('>header h1').html('登录');
			this.$('input').val('');
			this.$('.info-text').html('');
			this.$('input[name=username]').attr('placeholder', '输入手机或邮箱登录');
			this.$('input[name=password-confirm]').addClass('hidden');
			this.$('.login-button').css('-webkit-box-flex', '2');
			this.$('.register-button').css('-webkit-box-flex', '1');			this.status = 'login';
		}
	},
	register: function() {
		window.scrollTo(0, 0);
		if (this.status == 'register') {
			var username = this.$('input[name=username]').val() || null;
			var password = this.$('input[name=password]').val() || null;
			var passwordConfirm = this.$('input[name=password-confirm]').val() || null;
			if (password != passwordConfirm) {
				this.$('.info-text').html('两次密码输入不一致，请重新输入。');
			} else if (username && password) {
				var onLoginSuccess = this.onLoginSuccess;
				var displayError = this.displayError;
				MeiweiApp.me.register({username: username, password: password}, {
					success: function() {
						MeiweiApp.me.login({ username : username, password : password }, {
							success : onLoginSuccess,
							error : displayError
						});
					},
					error: displayError
				});
			}
		} else {
			MeiweiApp.Pages.MemberLogin.$('>header h1').html('注册');
			this.$('input').val('');
			this.$('.info-text').html('');
			this.$('input[name=username]').attr('placeholder', '请使用手机或邮箱注册');
			this.$('input[name=password-confirm]').removeClass('hidden');
			this.$('.register-button').css('-webkit-box-flex', '2');
			this.$('.login-button').css('-webkit-box-flex', '1');
			this.status = 'register';
		}
	},
	render: function() {
		this.status = null;
		this.login();
		return this;
	}
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.views = {
			loginForm: new MeiweiApp.Views.MemberLoginForm({ el: this.$('.login-box') })
		}
	},
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	render: function() {
		MeiweiApp.me.logout();
		this.views.loginForm.render();
	}
}))({el: $("#view-member-login")});
