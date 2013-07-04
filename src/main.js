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
      console.log('rendering controlsview');
      var t = this;
      t.container = t.options.container;
      t.container.html(t.render());

      // Set up individual filter widgets here.
      t.color_choices = new QgrCheckbox.CheckboxChoices(
        [
          {choice_val: 'qoral'},
          {choice_val: 'qrimson'},
          {choice_val: 'xhrtreuse'},
          {choice_val: 'rainbow'},
          {choice_val: 'jet'}
        ],
        {
          col: 'color'
        }
      );

      t.sex_choices = new QgrCheckbox.CheckboxChoices(
        [
          {choice_val: 'm'},
          {choice_val: 'f'},
        ],
        {
          col: 'sex'
        }
      );

      // Maintain an array of filter data collections to iterate over.
      t.filter_collections = [t.color_choices, t.sex_choices];

      // Proxy change events on contained data models to listeners.
      t.proxy(t.color_choices, 'change');
      t.proxy(t.sex_choices, 'change');

      t.color_choice_view  = new QgrCheckbox.CheckboxChoicesView({
        el: '#color-choices',
        choices: this.color_choices,
      })
      .render();
      t.sex_choice_view  = new QgrCheckbox.CheckboxChoicesView({
        el: '#sex-choices',
        choices: this.sex_choices,
      })
      .render();
    },

    teardown: function() {
      this.stopListening();
      // Call teardown on individual controls here.
      this.color_choice_view.teardown();
      this.sex_choice_view.teardown();
      this.$el.remove();
      return this;
    }

  });


  var BirdQmapper = Qoogr.QueryMapper.extend({

    get_qtree_base: function() {
      // Filter and aggregate.
      return {
        select: {
          where: {
            and: [] // We are going to insert filter clauses here.
          },
          agg: {
            group_by: 'species'
          }
        }
      }
    },

  });

  var ColorQmapper = Qoogr.QueryMapper.extend({

    get_qtree_base: function() {
      return {
        select: {
          where: {
            and: [] // We are going to insert filter clauses here.
          },
          agg: {
            group_by: 'color'
          }
        }
      }
    },
  });

  var birds_raw = {
    meta: [
      'species',
      'color',
      'sex',
      'val'
    ],
    array: [
      ['Common Sprin',       'rainbow',    'm',  1],
      ['Waterfall Swift',    'qrimson',    'f',  1],
      ['Waterfall Swift',    'xhrtreuse',  'm',  2],
      ['Waterfall Swift',    'xhrtreuse',  'f',  2],
      ['Cave Swiftlet',      'qoral',      'm',  4],
      ['Cave Swiftlet',      'qoral',      'f',  1],
      ['Cave Swiftlet',      'xhrtreuse',  'f',  2],
      ['Cave Swiftlet',      'xhrtreuse',  'm',  3],
      ['Rainbow Lorikeet',   'rainbow',    'f',  3],
      ['Rainbow Lorikeet',   'rainbow',    'm',  2],
      ['European Starling',  'jet',        'm',  5],
      ['European Starling',  'jet',        'f',  5]
    ]
  };

  var birds = QueryExecutor.expand_meta(birds_raw.meta, birds_raw.array);

  var array_map = {
    birds: birds,
  }

  var bird_graph_config = {
    graph: 'qgr-graph-barchart/src/qgr-graph-barchart',
    from: 'birds',
    label: 'species',
    title: 'Birds',
    controls: ControlsView,
    qmapper: BirdQmapper
  }

  var color_graph_config = {
    graph: 'qgr-graph-barchart/src/qgr-graph-barchart',
    from: 'birds',
    label: 'color',
    title: 'Color',
    controls: ControlsView,
    qmapper: ColorQmapper
  }

  var graph_config_map = {
    birds: bird_graph_config,
    colors: color_graph_config
  }

  var AppController = Backbone.View.extend({

    el: $('body'),

    initialize: function() {
      this.qoogr = new Qoogr.QoogrView({
        qexec: QueryExecutor,
        array_map: array_map,
        graph_config_map: graph_config_map
      });
    },

  });

  window.app_con = new AppController();

});

