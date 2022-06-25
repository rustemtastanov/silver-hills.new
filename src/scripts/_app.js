let vendorsTimer;

function unique(array) {
	return array.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});
}

function sort(array, dir) {
	return array.sort(function(val1, val2) {
		return dir=="asc" ? (val1 > val2 ? 1 : -1) : val1 < val2 ? 1 : -1;
	});
}

function getYoutubeId(url) {
	url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

function initApp() {

	Vue.use(VueAwesomeSwiper);
	Vue.directive("mask", VueMask.VueMaskDirective);

	Vue.filter("formatMonth", function(value) {
		if (value) return value.split(".")[1];
	});

	Vue.filter("formatYear", function(value) {
		if (value) return value.split(".")[2];
	});

	Vue.filter("formatPage", function(value) {
		let amount = value+1;
		return amount<10 ? "0"+amount : amount;
	});

	Vue.filter("formatAmount", function(value) {
		let amount = value;
		return amount<10 ? "0"+amount : amount;
	});

	new Vue({
		el: "#app",
		data: {
			isPhone: null,
			scrollTopOffset: 0,
			scrollBarWidth: 0,
			scrollBarOffset: 0,
			StatusSlides: [],
			StatusModalShow: false,
			TermsSelected: {},
			TermsDropShow: false,
			appIsLoaded: false,
			ShowDropMenu: false,
			ShowPolicy: false,
			ShowForm: false,
			ShowResponse: false,
			parallax: false,
			UTM: {},
			lazyLoadInstance: null
		},
		created() {
			const vm = this;
			vm.checkDevice();
			window.addEventListener("resize", function() {
				vm.checkDevice();
			});
		},
		mounted() {
			const vm = this;
			vm.initLazy();
			vm.checkUtm();
			vm.getScrollBarWidth();
			vm.appIsLoaded = true;
			vm.scrollTopOffset = vm.headerEl.clientHeight - 1;
			let hash = location.hash;
			if (hash && hash=="#policy") vm.showPolicy();
			document.addEventListener("keydown", function(e) {
				if (e.code=="Escape") {
					if (vm.StatusModalShow) vm.hideStatus();
					if (vm.ShowPolicy) vm.hidePolicy();
					if (vm.ShowForm) vm.closeForm();
					if (vm.TermsDropShow) vm.closeTerms();
				}
			});
			if (!vm.isPhone && !vm.parallax) vm.initParallax();
			vm.initAnimations();
		},
		computed: {
			headerEl() {
				return this.$refs.headerEl;
			},
			scrollBar() {
				return this.$refs.scrollBar;
			}
		},
		watch: {
			scrollBarOffset() {
				document.body.style.paddingRight = this.scrollBarOffset + "px";
			},
			isPhone() {
				if (!this.isPhone && !this.parallax) this.initParallax();
				if (this.isPhone && this.parallax) this.destroyParallax();
				this.updateLazy();
			}
		},
		methods: {
			checkDevice() {
				if (window.innerWidth<768) {
					if (!this.isPhone) this.isPhone = true;
				} else {
					if (this.isPhone) this.isPhone = false;
				}
			},
			lockScroll() {
				this.scrollBarOffset = this.scrollBarWidth;
				document.body.classList.add("lock");
			},
			checkUtm() {
				const vm = this;
				["source", "medium", "campaign", "term", "content"].forEach(function(name) {
					let id = "utm_"+ name;
					vm.UTM[name] = vm.getParameterByName(id);
				});
			},
			getParameterByName(name) {
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
				let results = regex.exec(location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
			},
			formatPhone(phone) {
				phone = phone.replace(/\s/g, "").replace("(", "").replace(")", "").replace("-", "").replace("-", "");
				if (phone.substr(0, 1)=="8" && phone.indexOf("+")<0) {
					phone = phone.substr(1);
					phone = "+7"+ phone;
				}
				return "tel:" + phone;
			},
			unLockScroll() {
				this.scrollBarOffset = 0;
				document.body.classList.remove("lock");
			},
			getScrollBarWidth() {
				this.scrollBarWidth = this.scrollBar.offsetWidth - this.scrollBar.clientWidth;
				this.scrollBar.classList.add("done");
			},
			updateLazy() {
				this.lazyLoadInstance.update();
			},
			initLazy() {
				this.lazyLoadInstance = new LazyLoad({
					callback_loaded: function(element) {
						element.closest("div").classList.add("loaded");
					}
				});
			},
			toggleDropMenu() {
				this.ShowDropMenu = !this.ShowDropMenu;
			},
			closeDropMenu() {
				this.ShowForm = false;
				this.ShowResponse = false;
				this.ShowDropMenu = false;
				this.ShowPolicy = false;
			},
			modalShow() {
				this.lockScroll();
			},
			modalShowed() {
				this.updateLazy();
			},
			modalHidden() {
				if (!this.ShowForm && !this.ShowDropMenu) {
					this.unLockScroll();
				}
				this.ShowResponse = false;
				this.StatusSlides = {};
			},
			modalTermsHidden() {
				if (!this.ShowForm && !this.ShowDropMenu) {
					this.unLockScroll();
				}
			},
			showStatus(slides) {
				this.StatusSlides = slides;
				this.StatusModalShow = true;
			},
			hideStatus() {
				this.StatusModalShow = false;
			},
			showPolicy() {
				this.ShowPolicy = true;
			},
			hidePolicy() {
				this.ShowPolicy = false;
			},
			toggleForm() {
				this.ShowForm = !this.ShowForm;
			},
			openForm() {
				if (this.ShowDropMenu) {
					this.ShowDropMenu = false;
				}
				this.ShowForm = true;
			},
			closeForm() {
				this.ShowForm = false;
			},
			showResponse() {
				const vm = this;
				vm.ShowResponse = true;
				if (vm.TermsDropShow) vm.TermsDropShow = false;
				if (!vm.ShowForm) vm.ShowForm = true;
				setTimeout(function() {
					vm.updateLazy();
				}, 100);
			},
			hideResponse() {
				this.ShowResponse = false;
				this.ShowForm = false;
			},
			openTerms(Terms) {
				this.TermsSelected = Terms;
				this.TermsDropShow = true;
			},
			closeTerms() {
				this.TermsDropShow = false;
			},
			initAnimations() {
				document.querySelectorAll(".anim").forEach(function(el) {
					const threshold = el.getAttribute("data-threshold");
					let isEntered;
					const observer = new IntersectionObserver(function(entries, observer) {
						entries.forEach(function(entry) {
							let isEnter = entry.isIntersecting;
							if (isEnter && !isEntered) {
								el.classList.add("animated");
								isEntered = true;
							}
							if (!isEnter && isEntered && entry.boundingClientRect.y>=0) {
								el.classList.remove("animated");
								isEntered = false;
							}
						});
					}, {
						threshold: threshold
					});
					observer.observe(el);
				});
			},
			initParallax() {
				this.parallax = skrollr.init({
					smoothScrolling: false,
					mobileDeceleration: 0.004,
					forceHeight: false
				});
			},
			destroyParallax() {
				this.parallax.destroy();
				this.parallax = false;
			}
		}
	});

}

function checkVendors() {
	if (typeof Vue!="undefined") {
		clearInterval(vendorsTimer);
		initOrder();
		initBenefits();
		initPoints();
		initGallery();
		initFlats();
		initTerms();
		initModalStatus();
		initStatus();
		initCommercial();
		initContacts();
		initForms();
		initDropTerms();
		initCounters();
		initApp();
	}
}

window.onload = function() {
	vendorsTimer = setInterval(function() {
		checkVendors();
	}, 200);
}