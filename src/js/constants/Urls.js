let url = {
	base: 'http://localhost/hdzx_v4/frontend/web',
	order: {
		getdepts: '/order/getdepts',
		getrooms: '/order/getrooms',
		getroomtables: '/order/getroomtables',
		getroomuse: '/order/getroomuse',
		submitorder: '/order/submitorder',
	},
	user: {
		getlogin: '/user/getlogin',
		login: '/user/login',
		logout: '/user/logout'
	},
	approve: {
		getautoorder: '/approve/getautoorder',
		getmanagerorder: '/approve/getmanagerorder',
		getschoolorder: '/approve/getschoolorder'
	}
};

export default url;