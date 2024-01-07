# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

module TravelRoute
  module Representer
    # Representer for a DayPlans collection entity
    class Location < Roar::Decorator
      include Roar::JSON

      property :latitude
      property :longitude
    end
  end
end
