# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'

# Represents essential Repo information for API output
module TravelRoute
  module Representer
    # Represent a Project entity as Json
    class Attraction < Roar::Decorator
      include Roar::JSON
      include Roar::Hypermedia
      include Roar::Decorator::HypermediaConsumer

      property :place_id
      property :name
      property :address
      property :type
      property :opening_hours
      property :rating
      property :location
    end
  end
end
