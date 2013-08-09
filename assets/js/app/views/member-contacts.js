
MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "simple-list-item",
		events: { "click": "triggerSelect" },
		template: MeiweiApp.Templates['contact-list-item'],
		triggerSelect: function(e) {
			this.model.trigger("select");
			this.$('i').attr('class', 'icon-select');
			this.$el.siblings().find('i').attr('class', 'icon-circle');
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
		collection.forEach(function(contact) {
			this.listenTo(contact, "select", function() {
				this.selectedContact = contact;
			});
		}, this);
	},
	getLocalContacts: function() {
	    this.$('.filter-online').removeClass('selected');
	    this.$('.filter-local').addClass('selected');
		var collection = this.views.contactList.collection;
		collection.reset();
		var bindContactSelect = this.bindContactSelect;
		navigator.contacts.find(
			["displayName", "phoneNumbers"],
			function(contacts) {
				for (i = 0; i < contacts.length; i++) {
					var model = new MeiweiApp.Models.Contact();
					model.set({
						id: contacts[i].id,
						name: contacts[i].displayName,
						mobile: contacts[i].phoneNumbers ? contacts[i].phoneNumbers[0].value: ""
					});
					collection.add(model);
				}
				bindContactSelect(collection);
			},
			function(e) {},
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
		this.showPage();
	}
}))({
	el: $("#view-member-contacts")
});
