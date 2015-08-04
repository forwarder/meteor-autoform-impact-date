var isMobile = false;

AutoForm.addInputType("impact-date", {
  template: "afImpactDate",
  valueIn: function (val) {
    return (val instanceof Date) ? AutoForm.Utility.dateToDateStringUTC(val) : val;
  },
  valueOut: function () {
    var val, calendar;
    if (!isMobile) {
      // @TODO: Must be a nicer way to get the tpl reference here?
      calendar = Blaze.getView(this.get(0)).parentView._templateInstance.calendar;
      return calendar.toDate();
    } else {
      if (AutoForm.Utility.isValidDateString(this.val())) {
        return new Date(val);
      } else {
        return null;
      }
    }
  },
  valueConverters: {
    "string": function (val) {
      return (val instanceof Date) ? AutoForm.Utility.dateToDateStringUTC(val) : val;
    },
    "stringArray": function (val) {
      if (val instanceof Date) {
        return [AutoForm.Utility.dateToDateStringUTC(val)];
      }
      return val;
    },
    "number": function (val) {
      return (val instanceof Date) ? val.getTime() : val;
    },
    "numberArray": function (val) {
      if (val instanceof Date) {
        return [val.getTime()];
      }
      return val;
    },
    "dateArray": function (val) {
      if (val instanceof Date) {
        return [val];
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (typeof context.atts.max === "undefined" && context.max instanceof Date) {
      context.atts.max = AutoForm.Utility.dateToDateStringUTC(context.max);
    }
    if (typeof context.atts.min === "undefined" && context.min instanceof Date) {
      context.atts.min = AutoForm.Utility.dateToDateStringUTC(context.min);
    }
    return context;
  }
});

Template.afImpactDate.onCreated(function() {
  var instance = this;

  var options = _.extend({
    selected: this.data.value
  }, this.data.atts.impactDateOptions);

  this.calendar = new ImpactCalendar(options);
  this.active = new ReactiveVar(false);
});

Template.afImpactDate.onRendered(function() {
  var instance = this;

  $(document).on('click.impact-date, focusin.impact-date', function(event) {
    if ( event.target !== instance.$('input').get(0)) {
      instance.active.set(false);
    }
  });

  this.autorun(function() {
    var selected = instance.calendar.selected();
    instance.active.set(false);
    instance.$('input').change();
  });
});

Template.afImpactDate.onDestroyed(function() {
  $(document).off('.impact-date');
});

Template.afImpactDate.events({
  'click .impact-date-wrapper, focusin .impact-date-wrapper': function(event, template) {
    event.stopPropagation();
  },
  'change input': function(event, template) {
    var active = Tracker.nonreactive(function() {
      return template.active.get();
    });
    if (active) {
      if (!event.target.value) {
        template.calendar.clear();
      } else {
        template.calendar.select(new Date(event.target.value));
      }
    }
  },
  'focus input': function(event, template) {
    template.active.set(true);
  }
});

Template.afImpactDate.helpers({
  isMobile: function() {
    return isMobile;
  },
  calendar: function() {
    return Template.instance().calendar;
  },
  formattedDate: function() {
    var selected = Template.instance().calendar.selected();
    return selected && selected.format('L');
  },
  atts: function() {
    return _.omit(this.atts, 'impactDateOptions');
  },
  options: function() {
    var def = AutoForm.getSchemaForField(this.name);

    return _.extend({
      min: this.min,
      max: this.max,
      showClear: def.optional,
      active: Template.instance().active.get()
    }, this.atts.impactDateOptions);
  }
});

/**
 * Include bootstrap3 field because it's the default AutoForm style.
 */
Template.afImpactDate_bootstrap3.helpers({
  context: function() {
    var context = _.clone(this);
    AutoForm.Utility.addClass(context.atts, "form-control");
    return context
  }
});
