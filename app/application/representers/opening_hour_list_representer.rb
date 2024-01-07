# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'
require_relative 'opening_hour_representer'

module TravelRoute
  module Representer
    # Represents list of Attractions for API output
    class OpeningHourList < Roar::Decorator
      include Roar::JSON

      collection :opening_hours, extend: Representer::OpeningHour,
                                 class: OpenStruct
    end
  end
end
