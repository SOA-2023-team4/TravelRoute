# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

module TravelRoute
  module Representer
    # Representer for a DayPlans collection entity
    class Time < Roar::Decorator
      include Roar::JSON

      property :hour
      property :minute
    end
  end
end
