// 响应式状态检测
export default {
  data () {
    return {
      isMobile: false
    }
  },
  methods: {
    checkScreenSize () {
      this.isMobile = window.innerWidth < 800
    }
  },
  mounted () {
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkScreenSize)
  }
}
