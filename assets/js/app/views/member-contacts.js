$(function() {
    
    var ContactList = MeiweiApp.CollectionView.extend({
    	ModelView: MeiweiApp.ModelView.extend({
    		className: 'simple-list-item contact-item',
    		template: TPL['contact-list-item'],
    		render: function() {
                var attrs = this.model ? this.model.toJSON() : {};
                this.$el.html(this.template(attrs));
                MeiweiApp.initLang(this.$el);
                this.$el.attr('data-index', this.$('[data-field="name"]').html()[0]);
                return this;
            }
    	})
    });
    
    MeiweiApp.Pages.MemberContacts = new(MeiweiApp.PageView.extend({
    	events: {
    		'fastclick .header-btn-left': 'onClickLeftBtn',
    		'fastclick .header-btn-right': 'onClickRightBtn',
    		'fastclick .filter-online': 'getOnlineContacts',
    		'fastclick .filter-local': 'getLocalContacts',
    		'click .contact-item': 'selectContact',
    		'submit .search-form': 'searchContacts',
    		//'touchstart .alphabet': 'alphabetOnTouchStart',
    		//'touchmove .alphabet': 'alphabetOnTouchMove',
    		//'touchend .alphabet': 'alphabetOnTouchEnd'
    	},
    	onClickRightBtn: function() {
    		if (this.options && this.options.callback && this.selectedContact)
    			this.options.callback(this.selectedContact.get('name'),
    			                      this.selectedContact.get('mobile'),
    			                      this.selectedContact.get('sexe'));
    		MeiweiApp.goBack();
    	},
    	alphabetOnTouchStart: function(ev) {
            var e = ev.originalEvent;
            e.preventDefault();
            this.$('.alphabet').addClass('hover');
            var theTarget = e.target;
            if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
            theTarget = theTarget.innerText;
            var pos = this.$('.contact-item[data-index="' + theTarget + '"]')[0];
            if (pos) this.scroller.scrollToElement(pos);
            return false;
    	},
    	alphabetOnTouchMove: function(ev) {
            var e = ev.originalEvent;
            e.preventDefault();
            var theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
            theTarget = theTarget.innerText;
            var pos = this.$('.contact-item[data-index="' + theTarget + '"]')[0];
            if (pos) this.scroller.scrollToElement(pos);
            return false;
        },
        alphabetOnTouchEnd: function(ev) {
            var e = ev.originalEvent;
            e.preventDefault();
            this.$('.alphabet').removeClass('hover');
            return false;
        },
    	searchContacts: function(e) {
            if (e.preventDefault) e.preventDefault();
            this.getLocalContacts();
        },
    	initPage: function() {
    		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
    		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
    		this.views = {
    			contactList: new ContactList({
    				collection: new MeiweiApp.Collections.Contacts(),
    				el: this.$('.scroll-inner')
    			})
    		};
    		this.selectedContact = new MeiweiApp.Models.Contact();
    	},
    	selectContact: function(e) {
    	    var item = e.currentTarget;
    	    this.selectedContact.set({
    	        name: $(item).find('[data-field="name"]').text(),
    	        mobile: $(item).find('[data-field="mobile"]').text(),
    	        sexe: $(item).find('[data-field="sexe"]').text(),
    	    });
    	    $(item).find('i').attr('class', 'icon icon-select');
            $(item).siblings().find('.icon-select').attr('class', 'icon icon-circle');
    	},
    	getLocalContacts: function() {
    	    if (navigator.contacts && _.isFunction(navigator.contacts.find)) {
        	    this.$('.filter-online').removeClass('selected');
        	    this.$('.filter-local').addClass('selected');
        		var contactCollection = this.views.contactList.collection;
        		var initScroller = this.initScroller;
        		var keywords = this.$('.search-form > input').val();
        		$('#apploader').removeClass('invisible');
        		navigator.contacts.find(
        			["displayName", "phoneNumbers"],
        			function(contacts) {
        				$('#apploader').addClass('invisible');
        				var localCollection = new MeiweiApp.Collections.Contacts();
        				contacts = _.sortBy(contacts, function (contact) { return contact.displayName; });
        				for (var i = 0; i < contacts.length; i++) {
        				    if (contacts[i].displayName && contacts[i].phoneNumbers &&
        				        contacts[i].displayName.indexOf(keywords) != -1) {
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
        			{ filter: "", multiple: true }
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
    	    this.getOnlineContacts();
    	}
    }))({ el: $("#view-member-contacts") });
});
