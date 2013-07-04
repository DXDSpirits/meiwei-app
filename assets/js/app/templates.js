MeiweiApp.Templates = {
	'member-login-form': Mustache.compile('<form><fieldset><legend>用户登录</legend><div><label>用户名</label><input type="text" name="username" /></div><div><label>密码</label><input type="password" name="password" /></div><button>登录</button></fieldset></form>'),
	'member-logout-form': Mustache.compile('<form><fieldset><button>登出</button></fieldset></form>'),
	'member-profile-form': Mustache.compile('<form id="member-profile-form"><fieldset><legend>用户资料</legend><div>            <label>昵称</label>            <input type="text" name="nickname" value="{{ nickname }}" />        </div>    <div>    <label>邮箱</label>            <input type="email" name="email" value="{{ email }}" />    </div>        <div>        <label>手机</label>            <input type="tel" name="mobile" value="{{ mobile }}" />    </div>        <div>        <label>男</label>            <input type="radio" name="sexe" value="0" />            <label>女</label>            <input type="radio" name="sexe" value="1" />    </div>        <div>        <label>纪念日</label>            <input type="text" name="anniversary" value="{{ anniversary }}" />    </div></fieldset></form>'),
	'member-register-form': Mustache.compile('<form>    <fieldset>        <legend>            用户注册        </legend>        <div>            <label>手机</label>            <input type="tel" name="mobile" />        </div>        <div>            <label>邮箱</label>            <input type="email" name="email" />        </div>        <div>            <label>密码</label>            <input type="password" name="password" />        </div>        <button>            注册        </button>    </fieldset></form>'),
	'order-detail': Mustache.compile('<header>    <h3>{{ orderno }}</h3>    <h5>{{ ordersubmittime }} | status: {{ status }}</h5></header><article><p>{{ member }}</p>    <p>{{ restaurantinfor.fullname }}</p>    <p>{{ personnum }}</p>    <p>{{ orderdate }}</p>    <p>{{ ordertime }}</p>    <p>{{ contactname }} {{ contactphone }}</p>    <p>{{ other }}</p>    <p>{{ adminother }}</p>    <button class="button-modify-order">修改</button></article>'),
	'order-list-item': Mustache.compile('<header>    <h3>{{ orderno }}</h3>    <h5>{{ ordersubmittime }} | status: {{ status }}</h5></header><article><p>{{ member }}</p>    <p>{{ restaurantinfor.fullname }}</p>    <p>{{ personnum }}</p>    <p>{{ orderdate }}</p>    <p>{{ ordertime }}</p>    <p>{{ contactname }} {{ contactphone }}</p>    <p>{{ other }}</p>    <p>{{ adminother }}</p></article>'),
	'product-box': Mustache.compile('<div><p>{{ product.name }}</p><ul>{{ #items }}<li>{{ name }} - {{ model }}<img src="http://www.clubmeiwei.com/upload/{{ picturepath }}" alt="" width=100 height=100></li>{{ /items }}</ul></div>'),
	'recommend-list-item': Mustache.compile('<!--<h1>{{rank}} {{ restaurant.fullname }}</h1>--><img src="http://www.clubmeiwei.com/upload/{{ restaurant.frontpic }}" alt="" >'),
	'restaurant-list-item': Mustache.compile('<header>    <h1>{{ fullname }}</h1></header><article>    <p>{{ address }}</p>    <p>{{ discount }}</p></article>'),
	'restaurant-order-form': Mustache.compile('<form id="restaurant-order-form"><fieldset><legend>{{ restaurant.fullname }}</legend><div><label>日期</label><input type="date" name="orderdate" value="{{ order.orderdate }}" /></div><div><label>时间</label><input type="time" name="ordertime" value="{{ order.ordertime }}" /></div><div><label>人数</label><input type="number" name="personnum" value="{{ order.personnum }}" /></div><div><label>联系人</label><input type="text" name="contactname" value="{{ order.contactname }}"/><input type="text" name="contactphone" value="{{ order.contactphone }}"/></div><div><textarea name="other" placeholder="其他要求">{{ order.other }}</textarea></div><button id="submit-order">提交</button></fieldset></form>'),
	'restaurant-picture': Mustache.compile('<img src="http://www.clubmeiwei.com/upload/{{ path }}" alt="{{ caption }}" width="100" height="100" >'),
	'restaurant-profile-box': Mustache.compile('<header>    <h1>{{ fullname }}</h1></header><article><p>{{ address }}</p>    <p>{{ discount }}</p></article><div>    <a href="#restaurant/{{ id }}/order" id="order-button">订餐</a></div>'),
	'restaurant-review': Mustache.compile('<h2>{{ member }}</h2><p>{{ comments }}</p><p>{{ time_created }}</p><p><span>{{ score }}</span><span>{{ service_score }}</span><span>{{ ambience_score }}</span><span>{{ food_score }}</span></p>')
};
