# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'
require_relative 'visit_duration_representer'

module TravelRoute
  module Representer
    # Representer for a DayPlans collection entity
    class DayPlan < Roar::Decorator
      include Roar::JSON

      property :day_start
      property :day_end
      property :date
      collection :visit_durations, extend: Representer::VisitDuration, class: OpenStruct
    end
  end
end
