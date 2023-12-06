# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

module TravelRoute
  module Representer
    # Represents list of Attractions for API output
    class AttractionsList < Roar::Decorator
      include Roar::JSON

      collection :attractions, extend: Representer::Attraction,
                               class: Struct
    end
  end
end
