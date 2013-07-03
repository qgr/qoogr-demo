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
    'qgr-cntrl-checkbox/src/qgr-cntrl-checkbox',
    'qjb-qexec-array/src/qjb-qexec-array'
  ],
  function(require, $, _, Backbone, Qoogr, QgrCheckbox, QueryExecutor) {


  var ControlsView = Qoogr.ControlsView.extend({

    initialize: function(options) {
      var t = this;
      t.render();
      // Set up individual filter widgets here.
      t.color_choices = new QgrCheckbox.CheckboxChoices(
        [
          {choice_val: 'qoral'},
          {choice_val: 'qrimson'},
          {choice_val: 'xhrtreuse'}
        ],
        {
          col: 'color'
        }
      );

      // Proxy change events on contained data models to listeners.
      t.proxy(t.color_choices, 'change');

      t.color_choice_view  = new QgrCheckbox.CheckboxChoicesView({
        el: '#color-choices',
        choices: this.color_choices,
      })
      .render();
    },

  });


  var QueryMapper = Qoogr.QueryMapper.extend({

    map_controls: function() {
      var t = this;
      // Build a new qtree by reading each control's data model.
      // The following is a stub for a basic filter qtree.
      t.qtree = {
        select: {
          where: {
            and: []
          }
        }
      }
      // Alias the toplevel and subclause for brevity.
      var and = t.qtree.select.where.and;

      // Push subclauses from control data models into query tree.
      and.push(t.controls.color_choices.get_subtree());

      // Fire change event to alert listeners qtree has changed.
      t.trigger('change');
    }

  });


  var birds = [
    {species: 'Waterfall Swift', color: 'qrimson', val: 1},
    {species: 'Waterfall Swift', color: 'xhrtreuse', val: 2},
    {species: 'Cave Swiftlet', color: 'qoral', val: 4},
    {species: 'Cave Swiftlet', color: 'xhrtreuse', val: 2}
  ];

  var array_map = {
    birds: birds,
  }

  var bird_graph_config = {
    graph: 'qgr-graph-barchart/src/qgr-graph-barchart',
    from: 'birds',
    label: 'Birds'
  }

  var graph_config_map = {
    birds: bird_graph_config
  }

  var AppController = Backbone.View.extend({

    el: $('body'),

    initialize: function() {
      this.qoogr = new Qoogr.QoogrView({
        controls_class: ControlsView,
        qmapper_class: QueryMapper,
        qexec: QueryExecutor,
        array_map: array_map,
        graph_config_map: graph_config_map
      });
    },

  });

  window.app_con = new AppController();

});

