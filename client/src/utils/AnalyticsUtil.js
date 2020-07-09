const MIXPANEL_TOKEN = null;

export function track(eventName, properties, shouldLowercaseProperties) {
	if (typeof mixpanel !== 'undefined') {
		const eventProperties = shouldLowercaseProperties
			? lowercaseProperties(properties)
			: properties;
		window.mixpanel.track(eventName, eventProperties);
	}
}

export function lowercaseProperties(properties) {
	return properties
		? Object.keys(properties).reduce((previousValue, currentValue) => {
				let value = properties[currentValue];
				if (typeof value !== 'undefined') {
					value = value.toLowerCase();
				}
				return (previousValue[currentValue] = value), previousValue;
		  }, {})
		: null;
}

export function identifyUser(user) {
	if (typeof mixpanel !== 'undefined') {
		const { id: userId } = user;
		window.mixpanel.people.set(user);
		window.mixpanel.identify(userId);
	}
}

export function initializeMixpanel() {
	if (MIXPANEL_TOKEN !== null) {
		(function (f, b) {
			if (!b.__SV) {
				var a, e, i, g;
				window.mixpanel = b;
				b._i = [];
				b.init = function (a, e, d) {
					function f(b, h) {
						var a = h.split('.');
						2 == a.length && (b = b[a[0]]) && (h = a[1]);
						b[h] = function () {
							b.push([h].concat(Array.prototype.slice.call(arguments, 0)));
						};
					}
					var c = b;
					'undefined' !== typeof d ? (c = b[d] = []) : (d = 'mixpanel');
					c.people = c.people || [];
					c.toString = function (b) {
						var a = 'mixpanel';
						'mixpanel' !== d && (a += '.' + d);
						b || (a += ' (stub)');
						return a;
					};
					c.people.toString = function () {
						return c.toString(1) + '.people (stub)';
					};
					i = 'disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user'.split(
						' '
					);
					for (g = 0; g < i.length; g++) f(c, i[g]);
					b._i.push([a, e, d]);
				};
				b.__SV = 1.2;
				a = f.createElement('script');
				a.type = 'text/javascript';
				a.async = !0;
				a.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
				e = f.getElementsByTagName('script')[0];
				e.parentNode.insertBefore(a, e);
			}
		})(document, window.mixpanel || []);
		window.mixpanel.init(MIXPANEL_TOKEN, {
			api_host: 'https://api.mixpanel.com'
		});
	}
}

const AnalyticsUtil = {
	track,
	initializeMixpanel,
	identifyUser
};

export default AnalyticsUtil;
