const URL = 'https://zsolti.co/job/';

function createURL(url, params) {
  const query = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  return `${url}?${query}`;
}

Vue.component('count-up', {
  template: '<span :class="className"></span>',
  name: 'count-up',
  props: {
    className: {
      type: String,
      default: '',
    },
    start: {
      type: Number,
      default: 0,
    },
    end: {
      type: Number,
      required: true,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 5,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        useEasing: true,
        useGrouping: true,
        separator: ',',
      }),
    },
  },
  data: function() {
    return {
      instance: null,
    };
  },
  watch: {
    end: function(val) {
      if (this.instance && this.instance.update) {
        this.instance.update(val);
      }
    },
  },
  methods: {
    init: function() {
      if (!this.instance) {
        this.instance = new CountUp(
          this.$el,
          this.start,
          this.end,
          this.decimals,
          this.duration,
          this.options,
        );
        this.instance.start();
      }
    },
    destroy: function() {
      this.instance = null;
    },
  },
  mounted: function() {
    this.init();
  },
  beforeDestroy: function() {
    this.destroy();
  },
  start: function() {
    if (this.instance && this.instance.start) {
      this.instance.start();
    }
  },
  pauseResume: function() {
    if (this.instance && this.instance.pauseResume) {
      this.instance.pauseResume();
    }
  },
  reset: function() {
    if (this.instance && this.instance.reset) {
      this.instance.reset();
    }
  },
  update: function(newEndVal) {
    if (this.instance && this.instance.update) {
      this.instance.update(newEndVal);
    }
  },
});

new Vue({
  el: '#app',
  data: {
    filteredTotal: 0,
    isFetching: false,
    jobs: [],
    keyword: null,
    location: null,
    pageTitle: 'Browse Our Latest Jobs',
    radius: 5,
    total: 50000,
  },
  mounted: function() {
    this.fetchJobs({ sort: 'date' })
    .then(res => { this.total = res.total; });
  },
  methods: {
    fetchJobs: function(settings = {}) {
      this.isFetching = true;

      return fetch(createURL(URL, settings))
      .then(res => res.json())
      .then(res => {
        this.isFetching = false;

        if (res.error) {
          this.error = res.error;
        } else {
          this.jobs = res.data;
          this.filteredTotal = res.total;
        }
        return res;
      });
    },
    search: function() {
      const settings = { radius: this.radius };

      if (this.keyword) {
        settings.keyword = this.keyword;
      }

      if (this.location) {
        settings.location = this.location;
      }

      this.fetchJobs(settings)
      .then(res => {
        if (this.keyword && this.location) {
          this.pageTitle = `${this.$options.filters.number(this.filteredTotal)} ${this.keyword} Jobs in ${this.location}`;
        } else if (this.keyword) {
          this.pageTitle = `We Have Found ${this.$options.filters.number(this.filteredTotal)} ${this.keyword} Jobs`;
        } else if (this.location) {
          this.pageTitle = `We Have Found ${this.$options.filters.number(this.filteredTotal)} Jobs in ${this.location}`;
        } else {
          this.pageTitle = 'Browse Our Latest Jobs';
        }
      });

      document.querySelector('main').scrollIntoView({
        behavior: 'smooth',
      });
    },
  },
  filters: {
    capitalize: function(value) {
      if (value !== value.toUpperCase()) {
        return value.toLowerCase()
          .replace(/\b\w/g, x => x.toUpperCase());
      }
      return value;
    },
    number: function(value) {
      return new Intl.NumberFormat().format(value);
    },
  },
});

/*
 * smoothscroll polyfill - v0.3.5
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */
!function(a,b,c){function d(){function h(a,b){this.scrollLeft=a,this.scrollTop=b}function i(a){return.5*(1-Math.cos(Math.PI*a))}function j(a){if("object"!=typeof a||null===a||a.behavior===c||"auto"===a.behavior||"instant"===a.behavior)return!0;if("object"==typeof a&&"smooth"===a.behavior)return!1;throw new TypeError("behavior not valid")}function k(c){var d,e,f;do{c=c.parentNode,d=c===b.body,e=c.clientHeight<c.scrollHeight||c.clientWidth<c.scrollWidth,f="visible"===a.getComputedStyle(c,null).overflow}while(!d&&(!e||f));return d=e=f=null,c}function l(b){var d,f,h,c=g(),j=(c-b.startTime)/e;j=j>1?1:j,d=i(j),f=b.startX+(b.x-b.startX)*d,h=b.startY+(b.y-b.startY)*d,b.method.call(b.scrollable,f,h),f===b.x&&h===b.y||a.requestAnimationFrame(l.bind(a,b))}function m(c,d,e){var i,j,k,m,n=g();c===b.body?(i=a,j=a.scrollX||a.pageXOffset,k=a.scrollY||a.pageYOffset,m=f.scroll):(i=c,j=c.scrollLeft,k=c.scrollTop,m=h),l({scrollable:i,method:m,startTime:n,startX:j,startY:k,x:d,y:e})}if(!("scrollBehavior"in b.documentElement.style)){var d=a.HTMLElement||a.Element,e=468,f={scroll:a.scroll||a.scrollTo,scrollBy:a.scrollBy,elScroll:d.prototype.scroll||h,scrollIntoView:d.prototype.scrollIntoView},g=a.performance&&a.performance.now?a.performance.now.bind(a.performance):Date.now;a.scroll=a.scrollTo=function(){if(j(arguments[0]))return void f.scroll.call(a,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);m.call(a,b.body,~~arguments[0].left,~~arguments[0].top)},a.scrollBy=function(){if(j(arguments[0]))return void f.scrollBy.call(a,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);m.call(a,b.body,~~arguments[0].left+(a.scrollX||a.pageXOffset),~~arguments[0].top+(a.scrollY||a.pageYOffset))},d.prototype.scroll=d.prototype.scrollTo=function(){if(j(arguments[0]))return void f.elScroll.call(this,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);m.call(this,this,arguments[0].left,arguments[0].top)},d.prototype.scrollBy=function(){var a=arguments[0];"object"==typeof a?this.scroll({left:a.left+this.scrollLeft,top:a.top+this.scrollTop,behavior:a.behavior}):this.scroll(this.scrollLeft+a,this.scrollTop+arguments[1])},d.prototype.scrollIntoView=function(){if(j(arguments[0]))return void f.scrollIntoView.call(this,arguments[0]||!0);var c=k(this),d=c.getBoundingClientRect(),e=this.getBoundingClientRect();c!==b.body?(m.call(this,c,c.scrollLeft+e.left-d.left,c.scrollTop+e.top-d.top),a.scrollBy({left:d.left,top:d.top,behavior:"smooth"})):a.scrollBy({left:e.left,top:e.top,behavior:"smooth"})}}}"object"==typeof exports?module.exports={polyfill:d}:d()}(window,document);
