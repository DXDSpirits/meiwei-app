var bootstrap = {};

bootstrap.Home = {
	recommend: [
		{
            "id": 18, 
            "order": 2, 
            "restaurant": {
                "id": 103, 
                "fullname": "金轩中餐厅(上海浦东丽思卡尔顿酒店)", 
                "address": "浦东新区世纪大道8号上海国金中心丽思卡尔顿酒店53楼", 
                "discount": "", 
                "frontpic": "assets/img/bootstrap/restaurant/3bdb8f801ba14d1d45674f9e611566d5_1.jpg"
            }
        },
        {
            "id": 17, 
            "order": 3, 
            "restaurant": {
                "id": 109, 
                "fullname": "思南公馆酒店法国餐厅", 
                "address": "卢湾区思南路51号思南公馆酒店57号楼", 
                "discount": "晚餐套餐88折优惠，并免费获赠两粒装马卡龙一份；<br /> 午餐套餐218元/位（两道主菜）免费升级为258元/位（三道主菜）。", 
                "frontpic": "assets/img/bootstrap/restaurant/ccdd5271382009add55d20e04d6d9b3d.jpg"
            }
        },
        {
            "id": 299, 
            "order": 4, 
            "restaurant": {
                "id": 40, 
                "fullname": "壹火锅会所", 
                "address": "卢湾区复兴中路535号思南公馆30号", 
                "discount": "消费即可获赠200元现金抵用券，消费满5000至10000元可获赠价值500元现金抵用券. 消费满10000元可获赠1000元现金抵用券", 
                "frontpic": "assets/img/bootstrap/restaurant/b2deadfa140c0cb985d20984d37069f9_1.jpg"
            }
        },
        {
            "id": 15, 
            "order": 5, 
            "restaurant": {
                "id": 172, 
                "fullname": "Osteria", 
                "address": "卢湾区进贤路226号", 
                "discount": "会员专享每桌每次点两个以上的主菜，其中一份主菜可享受半价。（仅限周一）", 
                "frontpic": "assets/img/bootstrap/restaurant/a838c0903bf5a9fbf30fedcae8204cee.jpg"
            }
        },
        {
            "id": 14, 
            "order": 6, 
            "restaurant": {
                "id": 174, 
                "fullname": "龙庭会所", 
                "address": "普陀区云岭东路88号成龙电影艺术公园3号楼龙庭会所（近中江路）", 
                "discount": "会员专享午市198元自助套餐", 
                "frontpic": "assets/img/bootstrap/restaurant/ce77a6191f7111b19dd69edef590d6d3_1.jpg"
            }
        }
	],
	products: [
        {
            "id": 27, 
            "name": "鲜花", 
            "picture": "assets/img/bootstrap/product/7d25b335373bb81d2ff2ff6ac42ba087.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "350元", 
            "description": "直径25cm"
        },
        {
            "id": 40, 
            "name": "蛋糕", 
            "picture": "assets/img/bootstrap/product/ef658119e5b275adf2a60959408d9941_1.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "1200元 (参考)", 
            "description": ""
        },
        {
            "id": 43, 
            "name": "美位活动策划", 
            "picture": "assets/img/bootstrap/product/f3f859e3e7b13aacdeceae58759c25b5.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "", 
            "description": ""
        },
        {
            "id": 45, 
            "name": "私人保镖", 
            "picture": "assets/img/bootstrap/product/0eab1c6918fdf3ef14e904e9d8833911_1.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "", 
            "description": ""
        },
        {
            "id": 46, 
            "name": "乐队演出", 
            "picture": "assets/img/bootstrap/product/b1557f1913a3884e6334557cee3f2189_1.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "", 
            "description": ""
        },
        {
            "id": 47, 
            "name": "外烩服务", 
            "picture": "assets/img/bootstrap/product/5f782ee76cbda4d264298f76c9ece8b2_1.jpg", 
            "count": 0, 
            "credit": 0, 
            "price": "", 
            "description": ""
        }
    ]
};

for (var key in bootstrap) {
	//localStorage.setItem(key, JSON.stringify(bootstrap[key]));
}
