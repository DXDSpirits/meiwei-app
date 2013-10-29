$(function() {
    MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		className: 'simple-list-item contact-item',
    		template: MeiweiApp.Templates['contact-list-item'],
    	})
    });
    
    MeiweiApp.Pages.MemberContacts = new(MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick .filter-online': 'getOnlineContacts',
    		'fastclick .filter-local': 'getLocalContacts',
    		'tap .contact-item': 'selectContact',
    		'submit >header>form': 'searchContacts',
    	},
    	onClickRightBtn: function() {
    		if (this.options && this.options.callback && this.selectedContact)
    			this.options.callback(this.selectedContact.get('name'),
    			                      this.selectedContact.get('mobile'),
    			                      this.selectedContact.get('sexe'));
    		MeiweiApp.goBack();
    	},
    	searchContacts: function(e) {
            if (e.preventDefault) e.preventDefault();
            var filter = this.$('>header input').val();
            this.getLocalContacts(filter)
            this.$('>header input').blur();
        },
    	initPage: function() {
    		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
    		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
    		this.views = {
    			contactList: new MeiweiApp.Views.ContactList({
    				collection: new MeiweiApp.Collections.Contacts(),
    				el: this.$('.scroll-inner')
    			})
    		};
    		this.selectedContact = new MeiweiApp.Models.Contact();
    	},
    	selectContact: function(e) {
    	    var item = e.currentTarget;
    	    this.selectedContact.set({
    	        name: $(item).find('[data-field="name"]').html(),
    	        mobile: $(item).find('[data-field="mobile"]').html(),
    	        sexe: $(item).find('[data-field="sexe"]').html(),
    	    });
    	    $(item).find('i').attr('class', 'icon-select');
            $(item).siblings().find('.icon-select').attr('class', 'icon-circle');
    	},
    	getLocalContacts: function(filter) {
    	    if (navigator.contacts && _.isFunction(navigator.contacts.find)) {
        	    this.$('.filter-online').removeClass('selected');
        	    this.$('.filter-local').addClass('selected');
        		var contactCollection = this.views.contactList.collection;
        		var initScroller = this.initScroller;
        		$('#apploader').removeClass('invisible');
        		navigator.contacts.find(
        			["displayName", "phoneNumbers"],
        			function(contacts) {
        				$('#apploader').addClass('invisible');
        				var localCollection = new MeiweiApp.Collections.Contacts();
        				contacts = _.sortBy(contacts, function (contact) { return contact.displayName; });
        				for (var i = 0; i < contacts.length; i++) {
        				    if (contacts[i].displayName && contacts[i].phoneNumbers) {
        				        for (var j = 0; j< contacts[i].phoneNumbers.length; j++) {
        				            if (contacts[i].phoneNumbers[j].value) {
            				            var model = new MeiweiApp.Models.Contact({
                                            id: contacts[i].id,
                                            name: contacts[i].displayName,
                                            mobile: contacts[i].phoneNumbers[j].value
                                        });
                                        localCollection.add(model);
                                    }
        				        }
        				    }
        				}
        				contactCollection.reset(localCollection.models);
        				initScroller();
        			},
        			function(e) { $('#apploader').addClass('invisible'); },
        			{ filter: filter, multiple: true }
        		);
    		}
    	},
    	getOnlineContacts: function() {
    	    this.$('.filter-online').addClass('selected');
    	    this.$('.filter-local').removeClass('selected');
    		this.views.contactList.collection.fetch({
    			reset: true,
    			success: this.initScroller
    		});
    	},
    	render: function() {
    	    if (this.checkLazy(60)) {
    	        this.getOnlineContacts();
    		}
    	}
    }))({ el: $("#view-member-contacts") });
});
