# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

module TravelRoute
  module Representer
    # Representer for visit duration entity
    class VisitDuration < Roar::Decorator
      include Roar::JSON

      property :attraction, extend: Representer::Attraction, class: OpenStruct
      property :start
      property :end
    end
  end
end
