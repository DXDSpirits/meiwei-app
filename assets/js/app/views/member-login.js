
MeiweiApp.Views.MemberLoginForm = MeiweiApp.View.extend({
	events: {
		'tap .login-button': 'login',
	},
	initView: function() {
		_.bindAll(this, 'login', 'onLoginSuccess', 'onLoginFail');
	},
	onLoginSuccess: function() {
		MeiweiApp.refreshActivePage();
	},
	onLoginFail: function(model, xhr, options) {
		this.displayError(this.$('.info-text'), xhr.responseText);
	},
	login: function() {
		window.scrollTo(0, 0);
		var username = this.$('input[name=username]').val();
		var password = this.$('input[name=password]').val();
		if (username.length > 0 && password.length > 0) {
			MeiweiApp.me.login({ username : username, password : password }, {
				success : this.onLoginSuccess, error : this.onLoginFail
			});
		}
	},
	render: function() {
	    this.$('input').val('');
		return this;
	}
});

MeiweiApp.Views.MemberRegisterForm = MeiweiApp.View.extend({
    events: {
        'tap .register-button': 'register'
    },
    initView: function() {
        _.bindAll(this, 'register', 'onLoginSuccess', 'onLoginFail', 'onRegisterFail');
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
    register: function() {
        window.scrollTo(0, 0);
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
                        success : onLoginSuccess, error : onLoginFail
                    });
                },
                error: this.onRegisterFail
            });
        }
    },
    render: function() {
        this.$('input').val('');
        return this;
    }
});

MeiweiApp.Pages.MemberLogin = new (MeiweiApp.PageView.extend({
    events: {
        'fastclick .header-btn-left': 'onClickLeftBtn',
        'tap .register-switch': 'goToRegister',
        'tap .login-switch': 'goToLogin'
    },
	onClickLeftBtn: function() { MeiweiApp.goTo('Home'); },
	initPage: function() {
		this.views = {
			loginForm: new MeiweiApp.Views.MemberLoginForm({ el: this.$('.login-box') }),
			registerForm: new MeiweiApp.Views.MemberRegisterForm({ el: this.$('.register-box') })
		};
	},
	goToRegister: function() {
	    this.views.loginForm.$el.addClass('hidden');
	    this.views.registerForm.$el.removeClass('hidden');
	    this.$('.register-switch').addClass('hidden');
        this.$('.login-switch').removeClass('hidden');
        this.scroller.refresh();
	},
	goToLogin: function() {
	    this.views.registerForm.$el.addClass('hidden');
        this.views.loginForm.$el.removeClass('hidden');
        this.$('.login-switch').addClass('hidden');
        this.$('.register-switch').removeClass('hidden');
        this.scroller.refresh();
	},
	render: function() {
		MeiweiApp.me.logout();
		this.views.loginForm.render();
		this.views.registerForm.render();
	}
}))({el: $("#view-member-login")});
