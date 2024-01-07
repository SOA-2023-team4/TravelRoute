# frozen_string_literal: true

require 'roar/decorator'
require 'roar/json'
require_relative 'location_representer'
require_relative 'opening_hour_list_representer'

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
      property :description
      property :address
      property :type
      property :opening_hours, extend: Representer::OpeningHourList, class: OpenStruct
      property :rating
      property :location, extend: Representer::Location, class: OpenStruct
      property :links
    end
  end
end
