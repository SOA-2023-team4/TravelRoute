# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'
require_relative 'time_representer'

module TravelRoute
  module Representer
    # Represents list of Attractions for API output
    class OpeningHour < Roar::Decorator
      include Roar::JSON

      property :day_start, extend: Representer::Time, class: OpenStruct
      property :day_end, extend: Representer::Time, class: OpenStruct
    end
  end
end
