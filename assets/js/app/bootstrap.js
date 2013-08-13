var bootstrap = {
	'http://192.168.1.7:8000/restaurants/recommend/5/' : {
		"id" : 5,
		"isrecommended" : 1,
		"order" : 1,
		"name" : "每周餐厅",
		"recommenditem_set" : [{
			"id" : 305,
			"order" : 1,
			"restaurant" : {
				"id" : 146,
				"fullname" : "蟹源",
				"address" : "长宁区虹桥路1452号古北国际财富中心B1楼",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/403d128de043061ba3e04da9a9345577.jpg"
			}
		}, {
			"id" : 303,
			"order" : 2,
			"restaurant" : {
				"id" : 186,
				"fullname" : "仁清",
				"address" : "卢湾区南昌路125号(近瑞金二路)",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/a08006175e4ea54166be5e1b0401e04f.jpg"
			}
		}, {
			"id" : 304,
			"order" : 3,
			"restaurant" : {
				"id" : 171,
				"fullname" : "La Bomba Pizzeria",
				"address" : "长宁区荣华西道59号古北美食坊1楼A4室",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/2343a912d9fbda8ffcb5fd0f1fe92ba2.jpg"
			}
		}, {
			"id" : 306,
			"order" : 4,
			"restaurant" : {
				"id" : 184,
				"fullname" : "申粤轩",
				"address" : "华山路849号丁香花园2号楼",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/697c8baeed9ff878eeef82dc1726b0e4.jpg"
			}
		}, {
			"id" : 12,
			"order" : 5,
			"restaurant" : {
				"id" : 175,
				"fullname" : "禅边会所",
				"address" : "普陀区云岭东路88号成龙电影艺术公园2号楼禅边会所",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/27846bcedc81cabd20369a967bad702c_1.jpg"
			}
		}, {
			"id" : 16,
			"order" : 6,
			"restaurant" : {
				"id" : 39,
				"fullname" : "萱庭会所",
				"address" : "卢湾区复兴中路537号思南公馆31栋",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/90c200bd1dd5d2573bf8f712228191a9_1.JPG"
			}
		}, {
			"id" : 13,
			"order" : 7,
			"restaurant" : {
				"id" : 183,
				"fullname" : "滩外楼Y2C2",
				"address" : "黄浦区外马路579号5楼\r\n",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/f0c6f901385737544864eb666078dcb2_1.jpg"
			}
		}, {
			"id" : 19,
			"order" : 8,
			"restaurant" : {
				"id" : 187,
				"fullname" : "Napa Wine Bar & Kitchen",
				"address" : "黄浦区中山东二路22号2楼(近新永安路）",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/be5c5dbdf613bf1641e5349f1e806533_2.jpg"
			}
		}, {
			"id" : 14,
			"order" : 9,
			"restaurant" : {
				"id" : 174,
				"fullname" : "龙庭会所",
				"address" : "普陀区云岭东路88号成龙电影艺术公园3号楼龙庭会所（近中江路）",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/ce77a6191f7111b19dd69edef590d6d3_1.jpg"
			}
		}, {
			"id" : 15,
			"order" : 10,
			"restaurant" : {
				"id" : 172,
				"fullname" : "Osteria",
				"address" : "卢湾区进贤路226号",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/a838c0903bf5a9fbf30fedcae8204cee.jpg"
			}
		}, {
			"id" : 299,
			"order" : 11,
			"restaurant" : {
				"id" : 40,
				"fullname" : "壹火锅会所",
				"address" : "卢湾区复兴中路535号思南公馆30号",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/b2deadfa140c0cb985d20984d37069f9_1.jpg"
			}
		}, {
			"id" : 17,
			"order" : 12,
			"restaurant" : {
				"id" : 109,
				"fullname" : "思南公馆酒店法国餐厅",
				"address" : "卢湾区思南路51号思南公馆酒店57号楼",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/ccdd5271382009add55d20e04d6d9b3d.jpg"
			}
		}, {
			"id" : 18,
			"order" : 13,
			"restaurant" : {
				"id" : 103,
				"fullname" : "金轩中餐厅(上海浦东丽思卡尔顿酒店)",
				"address" : "浦东新区世纪大道8号上海国金中心丽思卡尔顿酒店53楼",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/3bdb8f801ba14d1d45674f9e611566d5_1.jpg"
			}
		}, {
			"id" : 302,
			"order" : 14,
			"restaurant" : {
				"id" : 1,
				"fullname" : "美位私人管家",
				"address" : "",
				"frontpic" : "http://192.168.1.7:8000/media/restaurant/402aa2dd6242b0c97dd586825070f6db_1.jpg"
			}
		}]
	}
}
for (var key in bootstrap) {
	localStorage.setItem(key, JSON.stringify(bootstrap[key]));
}
