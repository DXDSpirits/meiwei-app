
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'click .login-button': 'login',
		'click .register-button': 'register',
	},
	initialize: function() {
		_.bindAll(this, 'displayError', 'onRegisterSuccess');
	},
	displayError: function(model, xhr, options) {
		var error = JSON.parse(xhr.responseText);
		for (var k in error) { $infoText.html(error[k]); break; }
	},
	onRegisterSuccess: function() {
		MeiweiApp.me.login({username: username, password: password}, {
			success: this.onLoginSuccess,
			error: this.displayError
		});
	},
	onLoginSuccess: function() {
		MeiweiApp.Pages.MemberLogin.ref.go();
	},
	login: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.login({username: username, password: password}, {
			success: this.onLoginSuccess,
			error: this.displayError
		});
	},
	register: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		$infoText = this.$('.info-text');
		MeiweiApp.me.register({username: username, password: password}, {
			success: this.onRegisterSuccess,
			error: this.displayError
		});
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
		if (this.options.ref) this.ref = this.options.ref;
		this.loginForm.render();
		this.showPage();
	}
}))({el: $("#view-member-login")});
