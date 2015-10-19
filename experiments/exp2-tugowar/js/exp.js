function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.trial = slide({
    name : "trial",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : _.shuffle([
      {quantity: "How strong do you think " + exp.playerA + " is?", leftLabel: "very weak", rightLabel: "very strong", quantityType: "aliceStrong"},
      {quantity: "How strong do you think " + exp.playerB + " is?", leftLabel: "very weak", rightLabel: "very strong", quantityType: "bobStrong"},
      {quantity: "How hard do you think " + exp.playerA + " tried?", leftLabel: exp.playerA + " didn't try at all", rightLabel: exp.playerA + " tried his best", quantityType: "aliceTried"},
      {quantity: "How hard do you think " + exp.playerB + " tried?", leftLabel: exp.playerB + " didn't try at all", rightLabel: exp.playerB + " tried his best", quantityType: "bobTried"}
    ]),

    start: function() {
      $(".err").hide();
      $(".story").hide();
      $("#explanation").html(exp.explanation);
      $(".playerA").html(exp.playerA);
      $(".playerB").html(exp.playerB);
    },

    storyIndex: 0,

    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#quantity").html(stim.quantity);
      $("#leftLabel").html(stim.leftLabel);
      $("#rightLabel").html(stim.rightLabel);
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
        "trialType": this.stim.quantityType,
        "playerA": exp.playerA,
        "alice": exp.playerA,
        "playerB": exp.playerB,
        "bob": exp.playerB,
        "quantity" : this.stim.quantity,
        "response" : exp.sliderPost,
        "explanation" : exp.explanation,
        "explanationTag" : exp.explanation.split(" ").slice(-1),
      });
    }
  });

  slides.prior = slide({
    name : "prior",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present : _.shuffle([
      {quantity: "How strong do you think " + exp.playerA + " is?", leftLabel: "very weak", rightLabel: "very strong", quantityType: "aliceStrong"},
      {quantity: "How strong do you think " + exp.playerB + " is?", leftLabel: "very weak", rightLabel: "very strong", quantityType: "bobStrong"},
      {quantity: "How hard do you think " + exp.playerA + " tried?", leftLabel: exp.playerA + " didn't try at all", rightLabel: exp.playerA + " tried his best", quantityType: "aliceTried"},
      {quantity: "How hard do you think " + exp.playerB + " tried?", leftLabel: exp.playerB + " didn't try at all", rightLabel: exp.playerB + " tried his best", quantityType: "bobTried"}
    ]),

    start: function() {
      $(".err").hide();
      $(".story").hide();
      $(".playerA").html(exp.playerA);
      $(".playerB").html(exp.playerB);
    },

    storyIndex: 0,

    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#quantityPrior").html(stim.quantity);
      $("#leftLabelPrior").html(stim.leftLabel);
      $("#rightLabelPrior").html(stim.rightLabel);
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (_s.storyIndex < 2) {
        $('#storyPrior' + _s.storyIndex).show();
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
      utils.make_slider("#single_slider0Prior", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trialType": this.stim.quantityType,
        "playerA": exp.playerA,
        "alice": exp.playerA,
        "playerB": exp.playerB,
        "bob": exp.playerB,
        "quantity" : this.stim.quantity,
        "response" : exp.sliderPost,
        "explanation" : "prior",
        "explanationTag" : "prior",
      });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        assess : $('input[name="assess"]:checked').val(),
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
          "playerA": exp.playerA,
          "playerB": exp.playerB,
          "condition": exp.condition,
          "explanation" : exp.condition == "trial" ? exp.explanation : "prior",
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
  exp.condition = _.sample(["trial", "trial", "trial", "trial", "trial", "trial", "prior"]);
  exp.playerA = _.sample(["Alan", "Bill"]);
  exp.playerB = exp.playerA == "Alan" ? "Bill" : "Alan";
  exp.explanation = _.sample([
    "Because " + exp.playerA + " is strong.",
    "Because " + exp.playerA + " tried.",
    "Because " + exp.playerB + " is weak.",
    "Because " + exp.playerB + " was lazy.",
    "Because he won.",
    "Because."
  ]); //can randomize between subject conditions here
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