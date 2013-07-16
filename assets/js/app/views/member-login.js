
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: { 'submit': 'login' },
	login: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.login(username, password);
		MeiweiApp.goTo('member/profile');
	},
	template: MeiweiApp.Templates['member-login-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Views.MemberLogoutForm = MeiweiApp.View.extend({
	events: { 'submit': 'logout' },
	logout: function(e) {
		e.preventDefault();
		MeiweiApp.me.logout();
		MeiweiApp.goTo('home');
	},
	template: MeiweiApp.Templates['member-logout-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Views.MemberRegisterForm = MeiweiApp.View.extend({
	events: { 'submit': 'register' },
	register: function(e) {
		e.preventDefault();
		email = this.$('input[name=email]').val();
		mobile = this.$('input[name=mobile]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.register(email, mobile, password);
		MeiweiApp.goTo('member/profile');
	},
	template: MeiweiApp.Templates['member-register-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.loginForm = new MeiweiApp.Views.MemberLoginForm({ el: this.$('.login-box') });
		this.logoutForm = new MeiweiApp.Views.MemberLogoutForm({ el: this.$('.logout-box') });
		this.registerForm = new MeiweiApp.Views.MemberRegisterForm({ el: this.$('.register-box') });
	},
	render: function() {
		this.loginForm.render();
		this.logoutForm.render();
		this.registerForm.render();
		this.showPage();
	}
}))({el: $("#view-member-login")});
