
MeiweiApp.loadTemplates = function(names) {
	var self = this;
    $.each(names, function(index, name) {
        $.ajax({
        	async: false,
            url: '/assets/mustache/' + name + '.html', 
            success: function(data) {
                self.Templates[name] = data;
            }
        });
    });
};

MeiweiApp.loadTemplate = function(name) {
	if (_.isEmpty(this.Templates)) {
		MeiweiApp.loadTemplates([
			'recommend-list-item',
			
			'member-login-form', 'member-register-form', 'member-profile-form',
			
			'restaurant-list-item',
			'restaurant-profile-box', 'restaurant-review', 'restaurant-picture',
			'restaurant-order-form',
			
			'order-list-item'
		]);
	}
	return this.Templates[name];
};
