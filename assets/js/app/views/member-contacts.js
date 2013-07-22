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

MeiweiApp.Pages.MemberContacts = new(MeiweiApp.PageView.extend({
    initPage: function() {
        this.views = {
            contactList: new MeiweiApp.Views.ContactList({
                collection: new MeiweiApp.Collections.Contacts(),
                el: this.$('.scroll-inner')
            })
        }
        _.bindAll(this, "bindContactSelect");
    },
    bindContactSelect: function(collection, response, options) {
        collection.forEach(function(contact) {
            contact.on("select",
            function() {
                this.$('input[name=contactname]').val(contact.get('name'));
                this.$('input[name=contactphone]').val(contact.get('mobile'));
            },
            this)
        },
        this);
        collection.at(0).trigger("select");
    },

    getMobileContacts: function(callback) {
        var collection = this.views.contactList.collection;
        try {
            var self = this;
            navigator.contacts.find(["displayName", "phoneNumbers"],
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
                if (typeof callback == 'function') {
                    callback.call( self );
                }
            },
            function(e) {},
            {
                multiple: true
            });

        } catch(e) {};
    },

    render: function() {
        this.getMobileContacts(function() {
            this.showPage();
        });
    }
}))({
    el: $("#view-member-contacts")
});