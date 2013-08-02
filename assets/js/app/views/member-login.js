
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'click .login-button': 'login',
		'click .register-button': 'register',
	},
	initialize: function() {
		_.bindAll(this, 'displayError');
	},
	displayError: function(model, xhr, options) {
		var $infoText = this.$('.info-text');
		var error = JSON.parse(xhr.responseText);
		for (var k in error) { $infoText.html(error[k]); break; }
	},
	onLoginSuccess: function() {
		MeiweiApp.Pages.MemberLogin.ref.go();
	},
	login: function(e) {
		e.preventDefault();
		var username = this.$('input[name=username]').val();
		var password = this.$('input[name=password]').val();
		if (username.length > 0 && password.length > 0) {
			MeiweiApp.me.login({ username : username, password : password }, {
				success : this.onLoginSuccess,
				error : this.displayError
			});
		}
	},
	register: function(e) {
		e.preventDefault();
		var username = this.$('input[name=username]').val();
		var password = this.$('input[name=password]').val();
		if (username.length > 0 && password.length > 0) {
			MeiweiApp.me.register({username: username, password: password}, {
				success: this.login,
				error: this.displayError
			});
		}
	},
	template: MeiweiApp.Templates['member-login-form'],
	render: function() {
		this.$el.html(this.template());
	}
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.loginForm = new MeiweiApp.Views.MemberLoginForm({ el: this.$('.login-box') });
		this.ref = MeiweiApp.Pages.Home
	},
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	render: function() {
		MeiweiApp.me.logout();
		if (this.options.ref) this.ref = this.options.ref;
		this.loginForm.render();
		this.showPage();
	}
}))({el: $("#view-member-login")});
