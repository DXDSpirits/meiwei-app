//测试notification
var d = new Date();
d = d.getTime() + 60 * 1000; //60 seconds from now
d = new Date(d);

window.addNotification({
	fireDate: d,
	alertBody: "This is a local notification.",
	repeatInterval: "daily",
	soundName: "horn.caf",
	badge: 0,
	notificationId: 123,
	foreground: function(notificationId) {
		alert("Hello World! This alert was triggered by notification " + notificationId);
		console.log(notificationId);
	},
	background: function(notificationId) {
		alert("Hello World! This alert was triggered by notification " + notificationId);
		console.log(notificationId);

	}
})



MeiweiApp.Views.ContactList = MeiweiApp.CollectionView.extend({
	ModelView: MeiweiApp.ModelView.extend({
		tagName: "div",
		className: "simple-list-item",
		events: { "click": "triggerSelect" },
		template: Mustache.compile('<div class="span"><h1>{{name}}</h1></div><div class="span"><small>{{mobile}}</small></div>'),
		triggerSelect: function(e) {
			this.model.trigger("select");
		}
	})
});

MeiweiApp.Pages.MemberContacts = new(MeiweiApp.PageView.extend({
	events: {
		'click .filter-bar :nth-child(1)': 'selectOnline',
		'click .filter-bar :nth-child(2)': 'selectLocal',
		'click simple-list-item': 'confirmSelect'
	},
	selectOnline: function() { this.getOnlineContacts(); },
	selectLocal: function() { this.getLocalContacts(); },
	confirmSelect: function() {  },
	initPage: function() {
		this.views = {
			contactList: new MeiweiApp.Views.ContactList({
				collection: new MeiweiApp.Collections.Contacts(),
				el: this.$('.scroll-inner')
			})
		};
		_.bindAll(this, "bindContactSelect");
	},
	
	bindContactSelect: function(collection, response, options) {
		collection.forEach(function(contact) {
			contact.on("select", function() {
				this.options.callback(contact.get('name'), contact.get('mobile'));
				if (!this.options.multiple)	this.options.caller.showPage();
			}, this)
		}, this);
	},
	
	getLocalContacts: function(callback) {
		var collection = this.views.contactList.collection;
		var self = this;
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
			},
			function(e) {},
			{ multiple: true }
		);
	},
	
	getOnlineContacts: function() {
		this.views.contactList.collection.fetch({
			reset: true,
			success: this.bindContactSelect
		});
	},
	
	render: function(options) {
		this.options = this.options || {};
		_.extend(this.options, options);
		this.getOnlineContacts();
		this.showPage();
	}
}))({
	el: $("#view-member-contacts")
});
