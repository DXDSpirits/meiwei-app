$(function() {
    MeiweiApp.Views.MemberAnniversaryForm = MeiweiApp.View.extend({
    	events: {
    		'tap .save-button': 'saveItem',
    		'tap .delete-button': 'deleteItem',
    	},
    	saveItem: function(e) {
    		if (e.preventDefault) e.preventDefault();
    		this.anniversary.set({
    			date: this.$('input[name=date]').val() || null,
    			description: this.$('input[name=description]').val() || null
    		});
    		var self = this;
    		this.anniversary.save({}, { 
    		    success: function() {
    				MeiweiApp.goTo('MemberAnniversaries');
    		    },
    		    error: function(model, xhr, options) {
    				self.displayError(self.$('.info-text'), xhr.responseText);
                }
    		});
    	},
    	deleteItem: function() {
    		this.anniversary.destroy({
    			success: function() {
    		    	MeiweiApp.goTo('MemberAnniversaries');
    		    }, 
    		});
    	},
    	render: function() {
    		if (this.anniversary.isNew()) {
    			this.$('.delete-button').addClass('hidden');
    			this.$('.inspritions').removeClass('hidden');
    		} else {
    			this.$('.delete-button').removeClass('hidden');
    			this.$('.inspritions').addClass('hidden');
    		}
    		this.$('input[name=date]').val(this.anniversary.get('date'));
    		this.$('input[name=description]').val(this.anniversary.get('description'));
    	}
    });
    
    MeiweiApp.Pages.MemberAnniversariyDetail = new (MeiweiApp.PageView.extend({
        events: {
            'fastclick .header-btn-left': 'onClickLeftBtn',
            'tap .inspritions > span': 'fillInsprition'
        },
    	initPage: function() {
    		this.views = {
    			anniversaryForm: new MeiweiApp.Views.MemberAnniversaryForm({
    				el: this.$('.anniversary-detail-form')
    			}),
    		};
    	},
    	fillInsprition: function(e) {
    	    var span = e.currentTarget;
    	    this.$('input[name="description"]').val($(span).html());
    	},
    	render: function() {
    		this.views.anniversaryForm.anniversary = this.options.anniversary ? 
    			this.options.anniversary : new MeiweiApp.Models.Anniversary();
    		this.views.anniversaryForm.render();
    	}
    }))({el: $("#view-member-anniversary-detail")});
});
