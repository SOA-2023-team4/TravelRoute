# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

# Represents essential Repo information for API output
module TravelRoute
  module Representer
    # Represent a Project entity as Json
    class Plan < Roar::Decorator
      include Roar::JSON

      collection :attractions, extend: Representer::Attraction, class: OpenStruct
      property :routes
    end
  end
end
