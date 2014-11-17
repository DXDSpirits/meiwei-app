
MeiweiApp.Models.ClientError = MeiweiApp.Model.extend({
	urlRoot: MeiweiApp.configs.APIHost + '/clients/error/'
});

MeiweiApp.Models.App = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/clients/app/'
});

MeiweiApp.Models.Ad = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/clients/ad/'
});

MeiweiApp.Models.Hero = MeiweiApp.Model.extend({
    urlRoot: MeiweiApp.configs.APIHost + '/clients/hero/'
});

MeiweiApp.Collections.Heros = MeiweiApp.Collection.extend({
    url: MeiweiApp.configs.APIHost + '/clients/hero/',
    model: MeiweiApp.Models.Hero
});
