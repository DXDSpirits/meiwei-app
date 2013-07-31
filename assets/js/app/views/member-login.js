
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'click .login-button': 'login',
		'click .register-button': 'register'
	},
	login: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.login(username, password);
	},
	register: function(e) {
		e.preventDefault();
		username = this.$('input[name=username]').val();
		password = this.$('input[name=password]').val();
		MeiweiApp.me.register(username, password);
	},
	template: MeiweiApp.Templates['member-login-form'],
	render: function() {
		this.$el.html(this.template);
	}
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.loginForm = new MeiweiApp.Views.MemberLoginForm({ el: this.$('.login-box') });
		this.ref = MeiweiApp.Pages.Home
		this.listenTo(MeiweiApp.me, 'login', function() {
			MeiweiApp.me.profile.fetch(); // Validate login.
			this.ref.go();
		});
	},
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	render: function() {
		if (this.options.ref) this.ref = this.options.ref;
		this.loginForm.render();
		this.showPage();
	}
}))({el: $("#view-member-login")});
