$(function() {
    MeiweiApp.Views.MemberProfileForm = MeiweiApp.View.extend({
        events: {
            'tap button': 'updateProfile'
        },
        initView: function() {
            _.bindAll(this, 'render');
            this.$('.switch-gender').switchControl();
        },
        updateProfile: function(e) {
            if (e.preventDefault) e.preventDefault();
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
            this.$('.info-text').html('');
            this.$('.switch-gender').switchControl('toggle', profile.sexe);
        }
    });
    
    MeiweiApp.Views.MemberPasswordForm = MeiweiApp.View.extend({
        events: {
            'tap button': 'updatePassword'
        },
        updatePassword: function(e) {
            if (e.preventDefault) e.preventDefault();
            var password = this.$('input[name=password]').val() || null;
            var passwordConfirm = this.$('input[name=password-confirm]').val() || null;
            if (password != passwordConfirm) {
                this.$('.info-text').html(MeiweiApp._("Password doesn't match."));
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
            //this.$('input[name=nickname]').focus();
            this.views.passwordForm.render();
            MeiweiApp.me.fetch({ success: this.views.profileForm.render });
        }
    }))({el: $("#view-member-profile")});
});
