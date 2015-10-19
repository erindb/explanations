function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.listenerInferModel = slide({
    name : "listenerInferModel",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : _.shuffle([
      "First, Alice chose her shirt color. Then, based on Alice's choice, Bob chose his shirt color.",
      "First, Bob chose his shirt color. Then, based on Bob's choice, Alice chose her shirt color.",
      "Alice and Bob chose their shirt colors completely independently.",
      "Something happened that influenced Alice's choice and Bob's choice in the same way, but they didn't directly pay attention to each other's choices."
    ]),

    start: function() {
      $(".err").hide();
      $(".story").hide();
      $("#explanation").html(exp.explanation);
    },

    storyIndex: 0,

    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#theory").html(stim);
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (_s.storyIndex < 4) {
        $('#story' + _s.storyIndex).show();
        _s.storyIndex = _s.storyIndex + 1;
      } else {
        if (exp.sliderPost == null) {
          $(".err").show();
        } else {
          this.log_responses();

          /* use _stream.apply(this); if and only if there is
          "present" data. (and only *after* responses are logged) */
          _stream.apply(this);
        }
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider0", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "listenerInferModel",
        "model" : this.stim,
        "response" : exp.sliderPost,
        "explanation" : exp.explanation
      });
    }
  });

  slides.speaker2 = slide({
    name : "speaker2",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : _.shuffle([
      "she has a red shirt",
      "Bob has a " + exp.bobShirtColor + " shirt"
    ]),

    start: function() {
      $(".err").hide();
      $(".story").hide();
      $("#bobShirtColor").html(exp.bobShirtColor);
      $("#howShirtColors").html(exp.howShirtColors);
    },

    storyIndex: 0,

    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#speaker2Explanation").html(stim);
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (_s.storyIndex < 6) {
        $('#speakerStory' + _s.storyIndex).show();
        _s.storyIndex = _s.storyIndex + 1;
      } else {
        if (exp.sliderPost == null) {
          $(".err").show();
        } else {
          this.log_responses();

          /* use _stream.apply(this); if and only if there is
          "present" data. (and only *after* responses are logged) */
          _stream.apply(this);
        }
      }
    },

    init_sliders : function() {
      utils.make_slider("#speakerSingle_slider0", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "speaker2",
        "speaker2Explanation" : this.stim,
        "response" : exp.sliderPost,
        "bobShirtColor" : exp.bobShirtColor,
        "howShirtColors" : exp.howShirtColors
      });
    }
  });

  slides.multi_slider = slide({
    name : "multi_slider",
    present : _.shuffle([
      {"critter":"Wugs", "property":"fur"},
      {"critter":"Blicks", "property":"fur"}
    ]),
    present_handle : function(stim) {
      $(".err").hide();
      this.stim = stim; //FRED: allows you to access stim in helpers

      this.sentence_types = _.shuffle(["generic", "negation", "always", "sometimes", "usually"]);
      var sentences = {
        "generic": stim.critter + " have " + stim.property + ".",
        "negation": stim.critter + " do not have " + stim.property + ".",
        "always": stim.critter + " always have " + stim.property + ".",
        "sometimes": stim.critter + " sometimes have " + stim.property + ".",
        "usually": stim.critter + " usually have " + stim.property + "."
      };

      this.n_sliders = this.sentence_types.length;
      $(".slider_row").remove();
      for (var i=0; i<this.n_sliders; i++) {
        var sentence_type = this.sentence_types[i];
        var sentence = sentences[sentence_type];
        $("#multi_slider_table").append('<tr class="slider_row"><td class="slider_target" id="sentence' + i + '">' + sentence + '</td><td colspan="2"><div id="slider' + i + '" class="slider">-------[ ]--------</div></td></tr>');
        utils.match_row_height("#multi_slider_table", ".slider_target");
      }

      this.init_sliders(this.sentence_types);
      exp.sliderPost = [];
    },

    button : function() {
      if (exp.sliderPost.length < this.n_sliders) {
        $(".err").show();
      } else {
        this.log_responses();
        _stream.apply(this); //use _stream.apply(this); if and only if there is "present" data.
      }
    },

    init_sliders : function(sentence_types) {
      for (var i=0; i<sentence_types.length; i++) {
        var sentence_type = sentence_types[i];
        utils.make_slider("#slider" + i, this.make_slider_callback(i));
      }
    },
    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;
      };
    },
    log_responses : function() {
      for (var i=0; i<this.sentence_types.length; i++) {
        var sentence_type = this.sentence_types[i];
        exp.data_trials.push({
          "trial_type" : "multi_slider",
          "sentence_type" : sentence_type,
          "response" : exp.sliderPost[i]
        });
      }
    },
  });

  slides.vertical_sliders = slide({
    name : "vertical_sliders",
    present : _.shuffle([
      {
        "bins" : [
          {
            "min" : 0,
            "max" : 10
          },
          {
            "min" : 10,
            "max" : 20
          },
          {
            "min" : 20,
            "max" : 30
          },
          {
            "min" : 30,
            "max" : 40
          },
          {
            "min" : 40,
            "max" : 50
          },
          {
            "min" : 50,
            "max" : 60
          }
        ],
        "question": "How tall is tall?"
      }
    ]),
    present_handle : function(stim) {
      $(".err").hide();
      this.stim = stim;

      $("#vertical_question").html(stim.question);

      for (var i=0; i<stim.bins.length; i++) {
        $("#sliders").append("<td><div id='vslider" + i + "' class='vertical_slider'>|</div></td>");
        $("#bin_labels").append("<td class='bin_label'>" + stim.bins[i].min + " - " + stim.bins[i].max + "</td>");
      }

      // var sliders_and_top_label = "<td class='thin'>likely</td>";
      // for (var i=0; i<stim.bins.length; i++) {
      //   bin_labels += "<td class='bin_label'>" + stim.bins[i].min + " - " + stim.bins[i].max + "</td>";
      //   sliders_and_top_label += "<td rowspan='3'><div id='vslider" + i + "' class='vertical_slider'>|</div></td>";
      // }
      // $("#sliders_and_top_label").html(sliders_and_top_label);
      // $("#bin_labels").html(bin_labels);

      this.init_sliders(stim);
      exp.sliderPost = [];
    },

    button : function() {
      if (exp.sliderPost.length < this.n_sliders) {
        $(".err").show();
      } else {
        this.log_responses();
        _stream.apply(this); //use _stream.apply(this); if and only if there is "present" data.
      }
    },

    init_sliders : function(stim) {
      for (var i=0; i<stim.bins.length; i++) {
        utils.make_slider("#vslider" + i, this.make_slider_callback(i), "vertical");
      }
    },
    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost[i] = ui.value;
      };
    },
    log_responses : function() {
      for (var i=0; i<this.stim.bins.length; i++) {
        exp.data_trials.push({
          "trial_type" : "vertical_slider",
          "question" : this.stim.question,
          "response" : exp.sliderPost[i],
          "min" : this.stim.bins[i].min,
          "max" : this.stim.bins[i].max
        });
      }
    },
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "howShirtColors": exp.howShirtColors,
          "bobShirtColor": exp.bobShirtColor,
          "explanation" : exp.explanation,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["listenerInferModel", "speaker2"]); //can randomize between subject conditions here
  exp.explanation = _.sample([
    "Because Bob has a red shirt.",
    "Because Bob has a blue shirt.",
    "Because she has a red shirt.",
    "Because."
  ]); //can randomize between subject conditions here
  exp.bobShirtColor = _.sample(["red", "blue"]);
  exp.howShirtColors = _.sample([
    "First Alice chooses her shirt color. Then, based on Alice's choice, Bob chooses his shirt color. Bob tries to choose the same shirt color as Alice (but with some low probability he might end up with a different color shirt from Alice).",
    "First Bob chooses his shirt color. Then, based on Bob's choice, Alice chooses her shirt color. Alice tries to choose the same shirt color as Bob (but with some low probability she might end up with a different color shirt from Bob).",
    "Alice and Bob choose their shirt colors independently.",
    "First their mutual friend Carol chooses her shirt color. Then, based on Carol's choice, Alice and Bob choose their shirt colors. They try to choose the same shirt color as Carol (but with some low probability each of them might end up with a different color shirt from Carol). Alice and Bob don't see each other's shirt choice."
  ])
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", exp.condition, 'subj_info', 'thanks'];
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}