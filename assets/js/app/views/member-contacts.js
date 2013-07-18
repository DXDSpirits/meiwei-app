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

    getMobileContacts: function() {
        var collection = new MeiweiApp.Collections.Contacts();
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
                self.views.contactList.collection.reset(collection.models);
                self.views.contactList.render();
            },
            function(e) {},
            {
                multiple: true
            });

        } catch(e) {};
    },

    render: function() {
        $.when(this.getMobileContacts()).then(this.showPage);
        //this.bindContactSelect(collection);
    }
}))({
    el: $("#view-member-contacts")
});