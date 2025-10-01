window.MathJax = {
  tex: {
    inlineMath: {'[+]': [['$', '$']]},
  },
  options: {
    makeCollapsible: false,
    a11y: {
      help: false,
      backgroundOpacity: 0,
    },
  },
  startup: {
    ready() {
      const {SpeechExplorer} = MathJax._.a11y.explorer.KeyExplorer;
      SpeechExplorer.prototype.help = () => {};
      MathJax.startup.defaultReady();
    },
  },
};
