
MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "contact-list-item",
		events: {
			"click": "updateContact"
		},
		template: Mustache.compile('<div><h1>{{name}}</h1></div><div><small>{{mobile}}</small></div>'),
		updateContact: function(e) {
			this.model.trigger("select");
		}
	})
});

MeiweiApp.Pages.MemberContacts = new (MeiweiApp.PageView.extend({
	initPage: function() {
		this.views = {
			contactList: new MeiweiApp.Views.ContactList({
				collection: MeiweiApp.me.contacts,
				el: this.$('.scroll-inner')
			})
		}
		_.bindAll(this, "bindContactSelect");
	},
	bindContactSelect: function(collection, response, options) {
		collection.forEach(
			function(contact) {
				contact.on("select", function() {
					this.$('input[name=contactname]').val(contact.get('name'));
					this.$('input[name=contactphone]').val(contact.get('mobile'));
				}, this)
			}, this);
		collection.at(0).trigger("select");
	},
	render: function() {
		$.when(
			MeiweiApp.me.contacts.fetch({ reset: true, success: this.bindContactSelect })
		).then(this.showPage);
	}
}))({el: $("#view-member-contacts")});
