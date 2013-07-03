require.config({
    baseUrl: "src/",
    paths: {
      'text': '../vendor/require/text',
      'json': '../vendor/require/json',
      'underscore': '../vendor/underscore/underscore',
      'jquery': '../vendor/jquery/jquery',
      'handlebars': '../vendor/handlebars/handlebars',
      'backbone': '../vendor/backbone/backbone',
      'd3': '../vendor/d3/d3.v3',
      'topojson': '../vendor/topojson/topojson'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
          exports: '$'
        },
        'handlebars': {
          exports: 'Handlebars'
        },
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'd3': {
          exports: 'd3'
        },
    }
});

requirejs([
    'require',
    'jquery',
    'underscore',
    'backbone',
    'qoogr/src/qoogr',
    'qgr-cntrl-checkbox/src/qgr-cntrl-checkbox'
  ],
  function(require, $, _, Backbone, Qoogr, QgrCheckbox) {


  var ControlsView = Qoogr.ControlsView.extend({

    initialize: function(options) {
      this.global_q = this.options.global_q;
      this.render();
      // Set up individual filter widgets here.
      this.color_choices = new QgrCheckbox.CheckboxChoices([
        {choice_val: 'qoral'},
        {choice_val: 'qrimson'},
        {choice_val: 'xhrtreuse'}
      ]);
      this.checkboxes_view  = new QgrCheckbox.CheckboxChoicesView({
        el: '#color-choices',
        choices: this.color_choices,
        col: 'color',
        global_q: this.global_q
      })
      .render();
    },

  });

  var AppController = Backbone.View.extend({

    el: $('body'),

    initialize: function() {
      this.qoogr = new Qoogr.Controller({
        controls_class: ControlsView
      });
    },

  });

  window.app_con = new AppController();

});

