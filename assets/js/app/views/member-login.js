
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'tap .login-button': 'login',
		'tap .register-button': 'register'
	},
	initView: function() {
		_.bindAll(this, 'login', 'register', 'onLoginSuccess', 'onLoginFail', 'onRegisterFail');
	},
	onLoginSuccess: function() {
		MeiweiApp.refreshActivePage();
	},
	onLoginFail: function(model, xhr, options) {
		this.displayError(this.$('.info-text'), xhr.responseText);
	},
	onRegisterFail: function(model, xhr, options) {
		this.displayError(this.$('.info-text'), xhr.responseText);
	},
	login: function() {
		window.scrollTo(0, 0);
		if (this.status == 'login') {
			var username = this.$('input[name=username]').val();
			var password = this.$('input[name=password]').val();
			if (username.length > 0 && password.length > 0) {
				MeiweiApp.me.login({ username : username, password : password }, {
					success : this.onLoginSuccess, error : this.onLoginFail
				});
			}
		} else {
			MeiweiApp.Pages.MemberLogin.$('>header h1').html('登录');
			this.$('input').val('');
			this.$('.info-text').html('');
			this.$('input[name=username]').attr('placeholder', '输入手机或邮箱登录');
			//this.$('input[name=password-confirm]').addClass('hidden');
			this.$('input[name=password-confirm]').remove();
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
				var onLoginFail = this.onLoginFail;
				MeiweiApp.me.register({username: username, password: password}, {
					success: function() {
						MeiweiApp.me.login({ username : username, password : password }, {
							success : onLoginSuccess,
							error : onLoginFail
						});
					},
					error: this.onRegisterFail
				});
			}
		} else {
			MeiweiApp.Pages.MemberLogin.$('>header h1').html('注册');
			this.$('input').val('');
			this.$('.info-text').html('');
			this.$('input[name=username]').attr('placeholder', '请使用手机或邮箱注册');
			//this.$('input[name=password-confirm]').removeClass('hidden');
			this.$('input[name=password]').after('<input type="password" name="password-confirm" placeholder="确认密码"/>');
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
		};
	},
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	render: function() {
		MeiweiApp.me.logout();
		this.views.loginForm.render();
	}
}))({el: $("#view-member-login")});
