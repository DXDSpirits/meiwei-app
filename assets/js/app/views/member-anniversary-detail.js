
MeiweiApp.Views.MemberAnniversaryForm = MeiweiApp.View.extend({
	events: {
		'click .save-button': 'save',
		'click .delete-button': 'remove',
	},
	save: function(e) {
		e.preventDefault();
		this.anniversary.set({
			date: this.$('input[name=date]').val() || null,
			description: this.$('input[name=description]').val() || null
		});
		var $infoText = this.$('.info-text');
		this.anniversary.save({}, { 
		    success: function() {
		    	MeiweiApp.goTo('MemberAnniversaries');
		    },
		    error: function(model, xhr, options) {
	            var error = JSON.parse(xhr.responseText);
		        for (var k in error) { $infoText.html(error[k]);  break; };
            }
		});
	},
	remove: function() {
		this.anniversary.destroy({
			success: function() {
		    	MeiweiApp.goTo('MemberAnniversaries');
		    }, 
		});
	},
	render: function() {
		if (this.anniversary.isNew()) {
			this.$('.delete-button').remove();
		} else if (this.$('.delete-button').length == 0) {
			this.$('.button-group').append('<button class="delete-button">删除</button>');
		}
		this.$('input[name=date]').val(this.anniversary.get('date'));
		this.$('input[name=description]').val(this.anniversary.get('description'));
	}
});

MeiweiApp.Pages.MemberAnniversariyDetail = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.views = {
			anniversaryForm: new MeiweiApp.Views.MemberAnniversaryForm({
				el: this.$('.anniversary-detail-form')
			}),
		};
	},
	render: function() {
		this.views.anniversaryForm.anniversary = this.options.anniversary ? 
			this.options.anniversary : new MeiweiApp.Models.Anniversary();
		this.views.anniversaryForm.render();
	}
}))({el: $("#view-member-anniversary-detail")});
