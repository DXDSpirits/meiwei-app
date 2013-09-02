
MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "simple-list-item",
		events: { "click": "triggerSelect" },
		template: MeiweiApp.Templates['contact-list-item'],
		triggerSelect: function(e) {
			this.model.trigger("select");
			this.$('i').attr('class', 'icon-select');
			this.$el.siblings().find('.icon-select').attr('class', 'icon-circle');
		}
	})
});

MeiweiApp.Pages.MemberContacts = new(MeiweiApp.PageView.extend({
	events: {
		'click .filter-online': 'getOnlineContacts',
		'click .filter-local': 'getLocalContacts',
	},
	onClickRightBtn: function() {
		if (this.options && this.options.callback)
			this.options.callback(this.selectedContact.get('name'), this.selectedContact.get('mobile'));
		MeiweiApp.goBack();
	},
	initPage: function() {
		this.lazy = 5 * 60 * 1000;
		this.listenTo(MeiweiApp.me, 'logout', function() { this.lastRender = null; });
		this.listenTo(MeiweiApp.me, 'login', function() { this.lastRender = null; });
		this.views = {
			contactList: new MeiweiApp.Views.ContactList({
				collection: new MeiweiApp.Collections.Contacts(),
				el: this.$('.scroll-inner')
			})
		};
		this.selectedContact = null;
		_.bindAll(this, "bindContactSelect");
	},
	bindContactSelect: function(collection, response, options) {
		this.initScroller();
		collection.forEach(function(contact) {
			this.listenTo(contact, "select", function() {
				this.selectedContact = contact;
			});
		}, this);
	},
	getLocalContacts: function() {
	    this.$('.filter-online').removeClass('selected');
	    this.$('.filter-local').addClass('selected');
		var contactCollection = this.views.contactList.collection;
		var bindContactSelect = this.bindContactSelect;
		$('#apploader').removeClass('hide');
		navigator.contacts.find(
			["displayName", "phoneNumbers"],
			function(contacts) {
				$('#apploader').addClass('hide');
				var localCollection = new MeiweiApp.Collections.Contacts();
				contacts = _.sortBy(contacts, function (contact) { return contact.displayName; });
				for (i = 0; i < contacts.length; i++) {
					var model = new MeiweiApp.Models.Contact({
						id: contacts[i].id,
						name: contacts[i].displayName,
						mobile: contacts[i].phoneNumbers ? contacts[i].phoneNumbers[0].value: ""
					});
					localCollection.add(model);
				}
				contactCollection.reset(localCollection.models);
				bindContactSelect(contactCollection);
			},
			function(e) { $('#apploader').addClass('hide'); },
			{ multiple: true }
		);
	},
	getOnlineContacts: function() {
	    this.$('.filter-online').addClass('selected');
	    this.$('.filter-local').removeClass('selected');
		this.views.contactList.collection.fetch({
			reset: true,
			success: this.bindContactSelect
		});
	},
	render: function() {
		this.getOnlineContacts();
	}
}))({ el: $("#view-member-contacts") });
