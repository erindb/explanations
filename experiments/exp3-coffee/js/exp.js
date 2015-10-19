var stories = {
  coffee: [
    "It's night time.",
    "",
    "Bob drinks coffee.",
    "Bob stays up late tonight."
  ],
  sunday: [
    "Bob stays up late on Sunday nights.",
    "The rest of the week, Bob goes to bed early.",
    "",
    "It's Sunday night.",
    "Bob stays up late tonight."
  ],
  paper: [
    "It's night time.",
    "Bob has a paper due tomorrow morning.",
    "",
    "Bob stays up late tonight.",
    "Bob's paper is finished in the morning."
  ],
  coffeeSunday: [
    "Bob drinks coffee on Sunday nights.",
    "Bob stays up late on Sunday nights.",
    "The rest of the week, Bob goes to bed early.",
    "",
    "It's Sunday night.",
    "",
    "Bob drinks coffee.",
    "Bob stays up late tonight."
  ],
  coffeePaper: [
    "It's night time.",
    "Bob has a paper due tomorrow morning.",
    "",
    "Bob drinks coffee.",
    "Bob stays up late tonight.",
    "Bob's paper is finished in the morning."
  ],
  sundayPaper: [
    "Every Monday morning, Bob has a paper due.",
    "Bob stays up late on Sunday nights.",
    "The rest of the week, Bob goes to bed early.",
    "",
    "It's Sunday night.",
    "Bob has a paper due tomorrow morning.",
    "",
    "Bob stays up late tonight.",
    "Bob's paper is finished in the morning."
  ],
  coffeeSundayPaper: [
    "Every Monday morning, Bob has a paper due.",
    "Bob drinks coffee on Sunday nights.",
    "Bob stays up late on Sunday nights.",
    "The rest of the week, Bob goes to bed early.",
    "",
    "It's Sunday night.",
    "Bob has a paper due tomorrow morning.",
    "",
    "Bob drinks coffee.",
    "Bob stays up late tonight.",
    "Bob's paper is finished in the morning."
  ],
};

var explanations = {
  coffee: [
    "Because he drank coffee",
    "Because coffee makes people stay up late"
  ],
  sunday: [
    "Because it was Sunday",
    "Because Bob stays up late on Sunday nights"
  ],
  paper: [
    "To finish his paper",
    "Because staying up late helped him finish his paper",
    "Because he had a paper due",
    "Because he wanted to finish his paper",
    "Because people tend to want to finish things by the due date"
  ],
  coffeeSunday: [
    "Because he drank coffee",
    "Because coffee makes people stay up late",

    "Because it was Sunday",
    "Because Bob stays up late on Sunday nights",

    "Because Bob drinks coffee on Sunday nights"
  ],
  coffeePaper: [
    "Because he drank coffee",
    "Because coffee makes people stay up late",

    "To finish his paper",
    "Because staying up late helped him finish his paper",
    "Because he had a paper due",
    "Because he wanted to finish his paper",
    "Because people tend to want to finish things by the due date"
  ],
  sundayPaper: [
    "Because it was Sunday",
    "Because Bob stays up late on Sunday nights",

    "To finish his paper",
    "Because staying up late helped him finish his paper",
    "Because he had a paper due",
    "Because he wanted to finish his paper",
    "Because people tend to want to finish things by the due date",

    "Because every Monday morning, Bob has a paper due."
  ],
  coffeeSundayPaper: [
    "Because he drank coffee",
    "Because coffee makes people stay up late",

    "Because it was Sunday",
    "Because Bob stays up late on Sunday nights",

    "To finish his paper",
    "Because staying up late helped him finish his paper",
    "Because he had a paper due",
    "Because he wanted to finish his paper",
    "Because people tend to want to finish things by the due date",

    "Because Bob drinks coffee on Sunday nights",

    "Because every Monday morning, Bob has a paper due."
  ]
};

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
    present : _.shuffle(explanations[exp.story]),

    start: function() {
      $(".err").hide();
      var story = stories[exp.story];
      var storyText = "";
      for (var i=0; i<story.length; i++) {
        storyText = storyText + story[i] + "<br/>";
      }
      $("#story").html(storyText);
    },

    storyIndex: 0,

    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.

      $("#explanation").html('"' + stim + '"');
      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "fullStory": stories[exp.story],
        "story": exp.story,
        "explanation": this.stim,
        "response" : exp.sliderPost
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
          "story": exp.story,
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
  repeatWorker = false;
  (function(){
      var ut_id = "explanations-exp3-coffee-sunday-paper";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  exp.trials = [];
  exp.catch_trials = [];
  exp.story = _.sample(["coffee", "sunday", "paper", "coffeeSunday", "coffeePaper", "sundayPaper", "coffeeSundayPaper"]);
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "trial", 'subj_info', 'thanks'];
  
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

  if (repeatWorker) {
    $('.slide').empty();
    alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
  }
  
  exp.go(); //show first slide
}